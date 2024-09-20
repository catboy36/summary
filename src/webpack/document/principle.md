# 核心

最核心的功能依然是：At its core, webpack is a static module bundler for modern JavaScript applications，也就是所谓的静态模块打包能力。

# 上述过程划分为三个阶段：

1. 初始化阶段：修整配置参数，创建 Compiler、Compilation 等基础对象，并初始化插件及若干内置工厂、工具类，并最终根据 entry 配置，找到所有入口模块；
2. 构建阶段：从 entry 文件开始，调用 loader 将模块转译为 JavaScript 代码，调用 Acorn 将代码转换为 AST 结构，遍历 AST 从中找出该模块依赖的模块；之后 递归 遍历所有依赖模块，找出依赖的依赖，直至遍历所有项目资源后，构建出完整的 模块依赖关系图；
3. 生成阶段：根据 entry 配置，将模块组装为一个个 Chunk 对象，之后调用一系列 Template 工厂类翻译 Chunk 代码并封装为 Asset，最后写出到文件系统。

- 单次构建过程自上而下按顺序执行，如果启动了 watch ，则构建完成后不会退出 Webpack 进程，而是持续监听文件内容，发生变化时回到「构建」阶段重新执行构建。

三个阶段环环相扣，「初始化」的重点是根据用户配置设置好构建环境；「构建阶段」则重在解读文件输入与文件依赖关系；最后在「生成阶段」按规则组织、包装模块，并翻译为适合能够直接运行的产物包。三者结合，实现 Webpack 最核心的打包能力，其它功能特性也几乎都是在此基础上，通过 Hook 介入、修改不同阶段的对象状态、流程逻辑等方式实现

# 初始化阶段

## 初始化阶段主要完成三个功能：修整 & 校验配置对象、运行插件、调用 compiler.compile 方法开始执行构建操作

1. 首先，校验用户参数，并合并默认配置对象：
   启动时，首先将 process.args 参数与 webpack.config.js 文件合并成用户配置；
   调用 validateSchema 校验配置对象（validateSchema 底层依赖于 schema-utils 库）；
   调用 getNormalizedWebpackOptions + applyWebpackOptionsBaseDefaults 合并出最终配置。
2. 之后，创建 Compiler 对象并开始启动插件：
   调用 createCompiler 函数创建 compiler 对象。
   遍历 配置中的 plugins 集合，执行插件的 apply 方法。
   调用 new WebpackOptionsApply().process 方法，根据配置内容动态注入相应插件，包括：
   调用 EntryOptionPlugin 插件，该插件根据 entry 值注入 DynamicEntryPlugin 或 EntryPlugin 插件；
   根据 devtool 值注入 Sourcemap 插件，包括：SourceMapDevToolPlugin、EvalSourceMapDevToolPlugin 、EvalDevToolModulePlugin；
   注入 RuntimePlugin ，用于根据代码内容动态注入 webpack 运行时。
3. 最后，调用 compiler.compile 方法开始执行构建

```js
// webpack/lib/compiler.js
compile(callback) {
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, err => {
      // ...
      const compilation = this.newCompilation(params);
      this.hooks.make.callAsync(compilation, err => {
        // ...
        this.hooks.finishMake.callAsync(compilation, err => {
          // ...
          process.nextTick(() => {
            compilation.finish(err => {
              // ...
              compilation.seal(err => {
                // ...
                this.hooks.afterCompile.callAsync(compilation, err => {
                    if (err) return callback(err);
                    return callback(null, compilation);
                });
              });
            });
          });
        });
      });
    });
  }

```

虽然 compile 方法并没有任何实质的功能逻辑，但它搭建起了后续构建流程框架：

调用 newCompilation 方法创建 compilation 对象；
触发 make 钩子，紧接着 EntryPlugin 在这个钩子中调用 compilation 对象的 addEntry 方法创建入口模块，主流程开始进入「构建阶段」；
make 执行完毕后，触发 finishMake 钩子；
执行 compilation.seal 函数，进入「生成阶段」，开始封装 Chunk，生成产物；
seal 函数结束后，触发 afterCompile 钩子，开始执行收尾逻辑。

compile 函数是后续所有功能逻辑的起点

调用 compile 函数触发 make 钩子后，初始化阶段就算是结束了，流程逻辑开始进入「构建阶段」

# 构建阶段

「构建阶段」从 entry 模块开始递归解析模块内容、找出模块依赖，按图索骥逐步构建出项目整体 module 集合以及 module 之间的 依赖关系图，这个阶段的主要作用就是读入并理解所有原始代码。

在上述「初始化阶段」的最后，compiler.compile 函数会触发 compiler.hook.make 钩子，EntryPlugin 监听该钩子并开始调用 compilation.addEntry 添加入口

```js
class EntryPlugin {
  apply(compiler) {
    const { entry, options, context } = this;
    // 创建入口 Dependency 对象
    const dep = EntryPlugin.createDependency(entry, options);

    compiler.hooks.make.tapAsync('EntryPlugin', (compilation, callback) => {
      compilation.addEntry(context, dep, options, err => {
        callback(err);
      });
    });
  }
}
```

addEntry 之后的执行逻辑:

1. 调用 handleModuleCreation，根据文件类型构建 module 子类 —— 一般是 NormalModule；
2. 调用 loader-runner 转译 module 内容，将各类资源类型转译为 Webpack 能够理解的标准 JavaScript 文本；
3. 调用 acorn 将 JavaScript 代码解析为 AST 结构；
4. 在 JavaScriptParser 类中遍历 AST，触发各种钩子，其中最关键的：
   - 遇到 import 语句时，触发 exportImportSpecifier 钩子；
   - HarmonyExportDependencyParserPlugin 监听该钩子，将依赖资源添加为 Dependency 对象；
   - 调用 module 对象的 addDependency， 将 Dependency 对象转换为 Module 对象并添加到依赖数组中。
5. AST 遍历完毕后，调用 module.handleParseResult 处理模块依赖数组；
6. 对于 module 新增的依赖，调用 handleModuleCreate，控制流回到第一步；
7. 所有依赖都解析完毕后，构建阶段结束。

过程中模块源码经历了 module => ast => dependences => module 的流转，先将源码解析为 AST 结构，再在 AST 中遍历 import 等模块导入语句，收集模块依赖数组 —— dependences，最后遍历 dependences 数组将 Dependency 转换为 Module 对象，之后递归处理这些新的 Module，直到所有项目文件处理完毕。

这个过程会调用 acorn 将模块内容 —— 包括 JS、CSS，甚至多媒体文件，解析为 AST 结构，所以需要使用 loaders 将不同类型的资源转译为标准 JavaScript 代码。

Dependency、Module、Entry 等都是 Webpack 内部非常重要的基本类型

到这里解析完所有模块，没有新的依赖后就可以继续推进，进入「生成阶段」。

# 生成阶段

「构建阶段」负责读入与分析源代码文件，将之一一转化为 Module、Dependency 对象，解决的是资源“输入”问题；而「生成阶段」则负责根据一系列内置规则，将上一步构建出的所有 Module 对象拆分编排进若干 Chunk 对象中，之后以 Chunk 粒度将源码转译为适合在目标环境运行的产物形态，并写出为产物文件，解决的是资源“输出”问题

生成阶段」发生在 make 阶段执行完毕，compiler.compile 调用 compilation.seal 函数时：

```js
// webpack/lib/compiler.js
compile(callback) {
    // ...
    const compilation = this.newCompilation(params);
    this.hooks.make.callAsync(compilation, err => {
        // ...
        compilation.seal(err => {/* */});
    });
  }
```

compilation.seal 函数是「生成阶段」的入口函数，seal 原意密封、上锁，我个人理解在 Webpack 语境下接近于“将模块装进 Chunk”，核心流程：

1. 创建本次构建的 ChunkGraph 对象。
2. 遍历 入口集合 compilation.entries：
   - 调用 addChunk 方法为每一个入口 创建 对应的 Chunk 对象（EntryPoint Chunk）；
   - 遍历 该入口对应的 Dependency 集合，找到 相应 Module 对象并 关联 到该 Chunk。
3. 到这里可以得到若干 Chunk，之后调用 buildChunkGraph 方法将这些 Chunk 处理成 Graph 结构，方便后续处理。
4. 之后，触发 optimizeModules/optimizeChunks 等钩子，由插件（如 SplitChunksPlugin）进一步修剪、优化 Chunk 结构。
5. 一直到最后一个 Optimize 钩子 optimizeChunkModules 执行完毕后，开始调用 compilation.codeGeneration 方法生成 Chunk 代码，在 codeGeneration 方法内部：
   - 遍历每一个 Chunk 的 Module 对象，调用 \_codeGenerationModule；
   - \_codeGenerationModule 又会继续往下调用 module.codeGeneration 生成单个 Module 的代码，这里注意不同 Module 子类有不同 codeGeneration 实现，对应不同产物代码效果。
6. 所有 Module 都执行完 codeGeneration，生成模块资产代码后，开始调用 createChunkAssets 函数，为每一个 Chunk 生成资产文件。
7. 调用 compilation.emitAssets 函数“提交”资产文件，注意这里还只是记录资产文件信息，还未写出磁盘文件。
8. 上述所有操作正常完成后，触发 callback 回调，控制流回到 compiler 函数。
9. 最后，调用 compiler 对象的 emitAssets 方法，输出资产文件。

seal 很复杂，重点在于将 Module 按入口组织成多个 Chunk 对象，之后暴露 optimizeXXX 钩子，交由插件根据不同需求对 Chunk 做进一步修剪、整形、优化，最后按 Chunk 为单位做好代码合并与转换，输出为资产文件。

- 上述 optimizeXXX 钩子常被用于优化最终产物代码，例如 SplitChunksPlugin 就可以在这里分析 Chunk、Module 关系，将使用率较高的 Module 封装进新的 Chunk，实现 Common Chunk 效果。

seal 过程中会不断调用 compilation.emitAssets 提交资产记录，而直到 seal 结束后则调用 compiler.emitAssets 函数，函数内部调用 compiler.outputFileSystem.writeFile 方法将 assets 集合写入文件系统，Webpack 完成从源码到资产文件的转换，构建工作至此结束。

# 资源形态流转

结合资源形态流转的角度重新考察整个过程

1. compiler.make 阶段：
   entry 文件以 dependence 对象形式加入 compilation 的依赖列表，dependence 对象记录了 entry 的类型、路径等信息；
   根据 dependence 调用对应的工厂函数创建 module 对象，之后读入 module 对应的文件内容，调用 loader-runner 对内容做转化，转化结果若有其它依赖则继续读入依赖资源，重复此过程直到所有依赖均被转化为 module。
2. compilation.seal 阶段：
   遍历 module 集合，根据 entry 配置及引入资源的方式，将 module 分配到不同的 Chunk；
   Chunk 之间最终形成 ChunkGraph 结构；
   遍历 ChunkGraph，调用 compilation.emitAsset 方法标记 chunk 的输出规则，即转化为 assets 集合。
3. compiler.emitAssets 阶段：
   将 assets 写入文件系统。

这个过程用到很多 Webpack 基础对象，包括：

Entry：编译入口；
Compiler：编译管理器，Webpack 启动后会创建 compiler 对象，该对象一直存活直到构建结束进程退出；
Compilation：单次构建过程的管理器，比如 watch = true 时，运行过程中只有一个 compiler，但每次文件变更触发重新编译时，都会创建一个新的 compilation 对象；
Dependence：依赖对象，记录模块间依赖关系；
Module：Webpack 内部所有资源都会以 Module 对象形式存在，所有关于资源的操作、转译、合并都是以 Module 为单位进行的；
Chunk：编译完成准备输出时，将 Module 按特定的规则组织成一个一个的 Chunk。

# 总结

Webpack 底层源码非常复杂，但撇除所有分支逻辑后，构建主流程可以简单划分为三个阶段：

初始化阶段：负责设置构建环境，初始化若干工厂类、注入内置插件等；
构建阶段：读入并分析 Entry 模块，找到模块依赖，之后递归处理这些依赖、依赖的依赖，直到所有模块都处理完毕，这个过程解决资源“输入”问题；
生成阶段：根据 Entry 配置将模块封装进不同 Chunk 对象，经过一系列优化后，再将模块代码翻译成产物形态，按 Chunk 合并成最终产物文件，这个过程解决资源“输出”问题。

# dependency

在现代前端构建系统（如 Webpack）中，将源文件转换为依赖（Dependency）对象，再基于这些依赖创建模块（Module）对象的流程是非常核心的一部分。这个过程设计精妙，旨在解决代码模块化构建的复杂性，优化构建输出，以及提供灵活的代码分割和加载策略。下面是这一流程的几个关键点和 Dependency 对象的作用：

依赖（Dependency）对象的作用
1. 表示文件之间的连接：Dependency 对象是源文件之间联系的抽象表示。每一个 Dependency 实例代表了一个文件对另一个文件的依赖，这种依赖不仅限于 JavaScript 代码模块间的 import/require 语句，也包括 CSS 中的@import，图片、字体文件的引用等。

2. 精细化的依赖管理：通过将依赖具体化为对象，构建系统能够更精细地控制和管理每个依赖项。例如，它可以分析依赖关系的类型（例如，是否是动态导入），依赖的加载优先级，以及是否需要将依赖项分割到不同的 bundle 中。

3. 便于进行依赖解析和优化：将依赖关系具象化为对象，使得构建工具可以在不直接操作源代码的情况下，对依赖关系进行解析、修改和优化。例如，通过修改 Dependency 对象，构建工具可以实现代码拆分、懒加载等高级功能。

4. 支持不同类型的依赖：在现代前端项目中，依赖不仅仅是 JavaScript 代码之间的依赖。样式文件、图片、字体以及其他类型的资源都可以是模块依赖。Dependency 对象允许构建系统以统一的方式处理这些不同类型的依赖。

创建 Module 对象的原因
1. 模块封装：Module 对象代表了从一个入口依赖及其所有依赖文件构建出的最终代码块。每个 Module 包含了处理后的代码、模块的依赖关系、以及模块的元数据等信息。

2. 代码转换和优化：在创建 Module 对象的过程中，源代码会被加载、转换（例如，通过 Babel 进行语法转换）和优化（如压缩）。这一步是实现代码转换和优化策略的关键环节。

3. 支持代码分割和动态加载：基于模块和依赖关系的分析，构建工具可以决定如何分割代码以支持代码分割和动态加载，优化应用的加载时间和性能。

总的来说，将依赖文件构建为 Dependency 对象，然后基于这些 Dependency 创建 Module 对象的流程，不仅使得依赖管理更为灵活和高效，也为代码转换、优化和高级功能实现（如代码拆分、懒加载）提供了必要的基础。这种设计使得现代构建系统能够支持复杂的前端项目，满足开发和生产环境下的性能要求。
