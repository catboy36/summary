# chunkGraph 构建过程

「构建」阶段负责分析模块间的依赖关系，建立起模块之间的 依赖关系图（ModuleGraph）；
紧接着，在「封装」阶段根据依赖关系图，将模块分开封装进若干 Chunk 对象中，并将 Chunk 之间的父子依赖关系梳理成 ChunkGraph 与若干 ChunkGroup 对象。

「封装」阶段最重要的目标就是根据「构建」阶段收集到的 ModuleGraph 关系图构建 ChunkGraph 关系图，这个过程的逻辑比较复杂：

1. 调用 seal() 函数后，遍历 entry 配置，为每个入口创建一个空的 Chunk 与 EntryPoint 对象（一种特殊的 ChunkGroup），并初步设置好基本的 ChunkGraph 结构关系，为下一步骤做好准备:
   若此时配置了 entry.runtime，Webpack 还会在这个阶段为运行时代码 创建 相应的 Chunk 并直接 分配 给 entry 对应的 ChunkGroup 对象。一切准备就绪后调用 buildChunkGraph 函数，进入下一步骤。

```js
class Compilation {
  seal(callback) {
    // ...
    const chunkGraph = new ChunkGraph(this.moduleGraph, this.outputOptions.hashFunction);
    this.chunkGraph = chunkGraph;
    // ...
    const chunkGraphInit = new Map();
    // 遍历入口模块列表
    for (const [name, { dependencies, includeDependencies, options }] of this.entries) {
      // 为每一个 entry 创建对应的 Chunk 对象
      const chunk = this.addChunk(name);
      // 为每一个 entry 创建对应的 ChunkGroup 对象
      const entrypoint = new Entrypoint(options);
      // 关联 Chunk 与 ChunkGroup
      connectChunkGroupAndChunk(entrypoint, chunk);

      // 遍历 entry Dependency 列表
      for (const dep of [...this.globalEntry.dependencies, ...dependencies]) {
        // 为每一个 EntryPoint 关联入口依赖对象，以便下一步从入口依赖开始遍历其它模块
        entrypoint.addOrigin(null, { name }, /** @type {any} */ (dep).request);

        const module = this.moduleGraph.getModule(dep);
        if (module) {
          // 在 ChunkGraph 中记录入口模块与 Chunk 关系
          chunkGraph.connectChunkAndEntryModule(chunk, module, entrypoint);
          // ...
        }
      }
    }
    // 调用 buildChunkGraph 方法，开始构建 ChunkGraph
    buildChunkGraph(this, chunkGraphInit);
    // 触发各种优化钩子
    // ...
  }
}
```

2.  在 buildChunkGraph 函数内 调用 visitModules 函数，遍历 ModuleGraph，将所有 Module 按照依赖关系分配给不同 Chunk 对象；这个过程中若遇到 异步模块，则为该模块 创建新的 ChunkGroup 与 Chunk 对象

3.  在 buildChunkGraph 函数中调用 connectChunkGroups 方法，建立 ChunkGroup 之间、Chunk 之间的依赖关系，生成完整的 ChunkGraph 对象

4.  在 buildChunkGraph 函数中调用 cleanupUnconnectedGroups 方法，清理无效 ChunkGroup，主要起到性能优化作用。

- 自上而下经过这四个步骤后，ModuleGraph 中存储的模块将根据模块本身的性质，被分配到 Entry、Async、Runtime 三种不同的 Chunk 对象，并将 Chunk 之间的依赖关系存储到 ChunkGraph 与 ChunkGroup 集合中，后续可在这些对象基础上继续修改分包策略（例如 SplitChunksPlugin），通过重新组织、分配 Module 与 Chunk 对象的归属实现分包优化

# Chunk vs ChunkGroup vs ChunkGraph

1. Chunk：Module 用于读入模块内容，记录模块间依赖等；而 Chunk 则根据模块依赖关系合并多个 Module，输出成资产文件
2. ChunkGroup：一个 ChunkGroup 内包含一个或多个 Chunk 对象；ChunkGroup 与 ChunkGroup 之间形成父子依赖关系
3. ChunkGraph：最后，Webpack 会将 Chunk 之间、ChunkGroup 之间的依赖关系存储到 compilation.chunkGraph 对象中

# 默认分包规则

综合上述 ChunkGraph 构建流程最终会将 Module 组织成三种不同类型的 Chunk：

Entry Chunk：同一个 entry 下触达到的模块组织成一个 Chunk；
Async Chunk：异步模块单独组织为一个 Chunk；
Runtime Chunk：entry.runtime 不为空时，会将运行时模块单独组织成一个 Chunk。

- 这是 Webpack 内置的，在不使用 splitChunks 或其它插件的情况下，模块输入映射到输出的默认规则，是 Webpack 底层关键原理之一

1. entry chunk
   先从 Entry Chunk 开始，Webpack 首先会为每一个 entry 创建 Chunk 对象，例如对于如下配置：

```js
module.exports = {
  entry: {
    main: './src/main',
    home: './src/home',
  },
};
```

遍历 entry 对象属性并创建出 chunk[main] 、chunk[home] 两个对象，此时两个 Chunk 分别包含 main 、home 模块：
初始化完毕后，Webpack 会根据 ModuleGraph 的依赖关系数据，将 entry 下所触及的所有 Module 塞入 Chunk （发生在 visitModules 方法）

2. async chunk
   Webpack 会将每一个异步导入语句（import(xxx) 及 require.ensure）处理为一个单独的 Chunk 对象，并将其子模块都加入这个 Chunk 中 —— 我们称之为 Async Chunk。

```js
// index.js
import './sync-a.js';
import './sync-b.js';

import('./async-a.js');

// async-a.js
import './sync-c.js';
```

Webpack 会为入口 index.js、异步模块 async-a.js 分别创建分包
且 chunk[index] 与 chunk[async-a] 之间形成了单向依赖关系，Webpack 会将这种依赖关系保存在 ChunkGroup.\_parents 、ChunkGroup.\_children 属性中

3. runtime chunk
   除了 entry、异步模块外，Webpack5 还支持将 Runtime 代码单独抽取为 Chunk。这里说的 Runtime 代码是指一些为了确保打包产物能正常运行，而由 Webpack 注入的一系列基础框架代码
   编译时，Webpack 会根据业务代码，决定输出哪些支撑特性的运行时代码（基于 Dependency 子类）

   需要 **webpack_require**.f、**webpack_require**.r 等功能实现最起码的模块化支持；
   如果用到动态加载特性，则需要写入 **webpack_require**.e 函数；
   如果用到 Module Federation 特性，则需要写入 **webpack_require**.o 函数；
   等等。

虽然每段运行时代码可能都很小，但随着特性的增加，最终结果会越来越大，特别对于多 entry 应用，在每个入口都重复打包一份相似的运行时显得有点浪费，为此 Webpack5 提供了 entry.runtime 配置项用于声明如何打包运行时代码。用法上只需在 entry 项中增加字符串形式的 runtime 值

```js
module.exports = {
  entry: {
    index: { import: './src/index', runtime: 'solid-runtime' },
  },
};
```

在 compilation.seal 函数中，Webpack 首先为 entry 创建 EntryPoint，之后判断 entry 配置中是否带有 runtime 属性，有则创建以 runtime 值为名的 Chunk，因此，上例配置将生成两个 Chunk：chunk[index.js] 、chunk[solid-runtime]，并据此最终产出两个文件：

入口 index 对应的 index.js 文件；
运行时配置对应的 solid-runtime.js 文件。

在多 entry 场景中，只要为每个 entry 都设定相同的 runtime 值，Webpack 运行时代码就会合并写入到同一个 Runtime Chunk 中，最终达成产物性能优化效果。

```js
module.exports = {
  entry: {
    index: { import: './src/index', runtime: 'solid-runtime' },
    home: { import: './src/home', runtime: 'solid-runtime' },
  },
};
```

此时入口 chunk[index]、chunk[home] 与运行时 chunk[solid-runtime] 也会形成父子依赖关系。

# 分包规则的问题

默认分包规则最大的问题是无法解决模块重复，如果多个 Chunk 同时包含同一个 Module，那么这个 Module 会被不受限制地重复打包进这些 Chunk。

了解决这个问题，Webpack 3 引入 CommonChunkPlugin 插件试图将 entry 之间的公共依赖提取成单独的 chunk，但 CommonChunkPlugin 本质上还是基于 Chunk 之间简单的父子关系链实现的，很难推断出提取出的第三个包应该作为 entry 的父 chunk 还是子 chunk，CommonChunkPlugin 统一处理为父 chunk，某些情况下反而对性能造成了不小的负面影响。

为此，在 Webpack4 之后才专门引入了更复杂的数据结构 —— ChunkGroup 专门实现关系链管理，配合 SplitChunksPlugin 能够更高效、智能地实现启发式分包

# 总结

「构建」阶段负责根据模块的引用关系构建 ModuleGraph；「封装」阶段则负责根据 ModuleGraph 构建一系列 Chunk 对象，并将 Chunk 之间的依赖关系（异步引用、Runtime）组织为 ChunkGraph —— Chunk 依赖关系图对象。与 ModuleGraph 类似，ChunkGraph 结构的引入也能解耦 Chunk 之间依赖关系的管理逻辑，整体架构逻辑更合理更容易扩展。

封装」阶段最重要的目标还是在于：确定有多少个 Chunk，以及每一个 Chunk 中包含哪些 Module —— 这些才是真正影响最终打包结果的关键因素。

Webpack5 内置的三种分包规则：Entry Chunk、Async Chunk 与 Runtime Chunk，这些是最最原始的分包逻辑，其它插件（例如 splitChunksPlugin）都是在此基础，借助 buildChunkGraph 后触发的各种钩子进一步拆分、合并、优化 Chunk 结构，实现扩展分包效果。

# Chunk 一定会且只会生产出一个产物文件吗？为什么？mini-css-extract-plugin、file-loader 这一类能写出额外文件的组件，底层是怎么实现的？

Chunk 产物文件的数量
关于 Chunk 是否一定会且只会生产出一个产物文件，答案是：不一定。通常情况下，一个 Chunk 会被打包成一个文件，比如一个 JavaScript 文件。但是，这不是绝对的，因为存在一些场景和插件，比如 mini-css-extract-plugin 和 file-loader，它们可以从一个 Chunk 中提取出一些内容，生成额外的文件。例如：

mini-css-extract-plugin：用于将 CSS 从 JavaScript 中提取到独立的文件中。在使用此插件时，即便是来源于同一个 Chunk 的 CSS，也会被打包到一个单独的 CSS 文件中，而不是与 JavaScript 混合在一起。
file-loader：用于处理文件（如图片、字体等），并将它们输出到构建目录。它会为每个处理的文件生成一个文件，而这些文件通常不会被视为 Chunk 的直接产物，但它们是从 Chunk 中引用的资源。
底层实现
Webpack 插件和 Loader 的工作原理基于 Webpack 的钩子系统和模块解析机制。它们如何工作的简化视图如下：

钩子系统（Hooks）：Webpack 提供了一个丰富的事件钩子系统，允许插件在编译过程的不同阶段执行自定义的操作。例如，mini-css-extract-plugin 可能会在处理完所有模块后，通过钩子系统提取那些标记为 CSS 的模块，并将它们合并成单独的 CSS 文件。

模块解析（Module Resolution）：Webpack 通过 Loader 机制来处理不同类型的文件。Loader 可以被视为一个转换器，将所有类型的文件转换成 Webpack 能够处理的模块。file-loader 在遇到指定类型的文件时，会将文件复制到输出目录，并返回一个 URL 替换原来的导入路径。这样，当 Webpack 打包 JavaScript 时，实际上引用的是文件的输出路径。

文件输出（File Emitting）：最终，在 Webpack 的输出阶段，所有被处理的模块和生成的额外文件都会被写入到文件系统。这一步骤包括了根据 Chunk 生成的主文件，以及像 mini-css-extract-plugin 和 file-loader 这样的插件生成的额外文件。

总之，Chunk 在 Webpack 中代表了一个模块集合和它们的依赖，它们通常会被打包成一个文件。但是，通过使用特定的插件和 Loader，可以从 Chunk 中提取内容或引用资源，从而生成额外的文件。这些工具的底层实现依赖于 Webpack 的钩子系统、模块解析机制和文件输出过程。
