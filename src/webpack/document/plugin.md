# pulgin 简介

从形态上看，插件通常是一个带有 apply 函数的类

```js
class SomePlugin {
  apply(compiler) {}
}
```

Webpack 在启动时会调用插件对象的 apply 函数，并以参数方式传递核心对象 compiler ，以此为起点，插件内可以注册 compiler 对象及其子对象的钩子(Hook)回调

```js
class SomePlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('SomePlugin', compilation => {
      compilation.addModule(/* ... */);
    });
  }
}
```

示例中的 compiler 为 Hook 挂载的对象；thisCompilation 为 Hook 名称；后面调用的 tap 为调用方式，支持 tap/tapAsync/tapPromise 等

在 Webpack 运行过程中，随着构建流程的推进会触发各个钩子回调，并传入上下文参数(例如上例回调函数中的 compilation 对象)，插件可以通过调用上下文接口、修改上下文状态等方式「篡改」构建逻辑，从而将扩展代码「勾入」到 Webpack 构建流程中

- 提示：网上不少资料将 Webpack 的插件架构归类为“事件/订阅”模式，我认为这种归纳有失偏颇。订阅模式是一种松散耦合结构，发布器只是在特定时机发布事件消息，订阅者并不或者很少与事件源直接发生交互。

基于 Hook 这一设计，开发插件时我们需要重点关注两个问题：

1. 针对插件需求，我们应该使用什么钩子？
2. 选定钩子后，我怎么跟上下文参数交互？

## 什么时候会触发什么钩子：

Webpack5 暴露了多达 200+ 个 Hook，基本上覆盖了整个构建流程的所有环节 —— 这也就意味着通过编写插件，我们几乎可以改写 Webpack 的所有执行逻辑

Webpack 内部几个核心对象，以及各对象下 Hook 的触发时机:

### Compiler：全局构建管理器，Webpack 启动后会首先创建 compiler 对象，负责管理配置信息、Loader、Plugin 等

### Compilation：单次构建过程的管理器，负责遍历模块，执行编译操作；当 watch = true 时，每次文件变更触发重新编译，都会创建一个新的 compilation 对象；

### 还有 Module、Resolver、Parser、Generator 等关键类型，也都相应暴露了许多 Hook。

## 使用 Hook 上下文接口：

Webpack Hook 有两个重点，一是上面介绍的触发时机；二是触发时传递的上下文参数

compiler.hooks.compilation ：
时机：Webpack 刚启动完，创建出 compilation 对象后触发；
参数：当前编译的 compilation 对象。
compiler.hooks.make：
时机：正式开始构建时触发；
参数：同样是当前编译的 compilation 对象。
compilation.hooks.optimizeChunks ：
时机： seal 函数中，chunk 集合构建完毕后触发；
参数：chunks 集合与 chunkGroups 集合。
compiler.hooks.done：
时机：编译完成后触发；
参数： stats 对象，包含编译过程中的各类统计信息。

每个钩子传递的上下文参数不同，但主要包含如下几种类型(以 Webpack5 为例)：

1. complation 对象：构建管理器，使用率非常高，主要提供了一系列与单次构建相关的接口，包括：
   addModule：用于添加模块，例如 Module 遍历出依赖之后，就会调用该接口将新模块添加到构建需求中；
   addEntry：添加新的入口模块，效果与直接定义 entry 配置相似；
   emitAsset：用于添加产物文件，效果与 Loader Context 的 emitAsset 相同；
   getDependencyReference：从给定模块返回对依赖项的引用，常用于计算模块引用关系；
   等等。
2. compiler 对象：全局构建管理器，提供如下接口：
   createChildCompiler：创建子 compiler 对象，子对象将继承原始 Compiler 对象的所有配置数据；
   createCompilation：创建 compilation 对象，可以借此实现并行编译；
   close：结束编译；
   getCache：获取缓存接口，可借此复用 Webpack5 的缓存功能；
   getInfrastructureLogger：获取日志对象；
   等等。
3. module 对象：资源模块，有诸如 NormalModule/RawModule/ContextModule 等子类型，其中 NormalModule 使用频率较高，提供如下接口：
   identifier：读取模块的唯一标识符；
   getCurrentLoader：获取当前正在执行的 Loader 对象；
   originalSource：读取模块原始内容；
   serialize/deserialize：模块序列化与反序列化函数，用于实现持久化缓存，一般不需要调用；
   issuer：模块的引用者；
   isEntryModule：用于判断该模块是否为入口文件；
   等等。
4. chunk 对象：模块封装容器，提供如下接口：
   addModule：添加模块，之后该模块会与 Chunk 中其它模块一起打包，生成最终产物；
   removeModule：删除模块；
   containsModule：判断是否包含某个特定模块；
   size：推断最终构建出的产物大小；
   hasRuntime：判断 Chunk 中是否包含运行时代码；
   updateHash：计算 Hash 值。
5. stats 对象：构建过程收集到的统计信息，包括模块构建耗时、模块依赖关系、产物文件列表等。

总结一下，Webpack 的插件体系与平常所见的 订阅/发布 模式差别很大，是一种非常强耦合的设计，Hook 回调由 Webpack 决定何时，以何种方式执行；而在 Hook 回调内部可以通过调用上下文 API 、修改上下文状态等方式，对 Webpack 原定流程产生 Side Effect。

# 实例剖析：imagemin-webpack-plugin

imagemin-webpack-plugin 是一个用于实现图像压缩的插件，它会在 Webpack 完成前置的代码分析构建，提交(emit)产物时，找出所有图片资源并调用 imagemin 压缩图像。

```js
export default class ImageminPlugin {
  constructor(options = {}) {
    // init options
  }

  apply(compiler) {
    // ...
    const onEmit = async (compilation, callback) => {
      // ...
      await Promise.all([
        ...this.optimizeWebpackImages(throttle, compilation),
        ...this.optimizeExternalImages(throttle),
      ]);
    };

    compiler.hooks.emit.tapAsync(this.constructor.name, onEmit);
  }

  optimizeWebpackImages(throttle, compilation) {
    const {
      // 用于判断是否对特定文件做图像压缩操作
      testFunction,
      // 缓存目录
      cacheFolder,
    } = this.options;

    // 遍历 `assets` 产物数组
    return map(compilation.assets, (asset, filename) =>
      throttle(async () => {
        // 读取产物内容
        const assetSource = asset.source();
        if (testFunction(filename, assetSource)) {
          // 尝试从缓存中读取
          let optimizedImageBuffer = await getFromCacheIfPossible(cacheFolder, assetSource, () => {
            // 调用 `imagemin` 压缩图片
            return optimizeImage(assetSource, this.options);
          });

          // 之后，使用优化版本替换原始文件
          compilation.assets[filename] = new RawSource(optimizedImageBuffer);
        }
      })
    );
  }

  optimizeExternalImages(throttle) {}
}
```

提示：Source 是 Webpack 内代表资源内容的类，由 webpack-source 库实现，支持 RawSource/ConcatSource 等子类型，用于实现文件读写、合并、修改、Sourcemap 等操作。

# 插件架构综述

插件架构至少需要解决三个方面的问题：

接口：需要提供一套逻辑接入方法，让开发者能够将代码插入特定环节，变更原始逻辑；
输入：如何将上下文信息高效传导给插件；
输出：插件内部通过何种方式影响整套运行体系。

针对这些问题，webpack 基于 tapable 实现了：

编译过程的特定节点以钩子形式，通知插件此刻正在发生什么事情；
通过 tapable 提供的回调机制，以参数方式传递上下文信息；
在上下文参数对象中附带了很多存在 Side Effect 的交互接口，插件可以通过这些接口改变。

```js
class Compiler {
  // 在构造函数中，先初始化钩子对象
  constructor() {
    this.hooks = {
      thisCompilation: new SyncHook(['compilation', 'params']),
    };
  }

  compile() {
    // 特定时机触发特定钩子
    const compilation = new Compilation();
    this.hooks.thisCompilation.call(compilation);
  }
}
```

Compiler 类型内部定义了 thisCompilation 钩子，并在 compilation 创建完毕后发布事件消息，插件开发者就可以基于这个钩子获取到最新创建出的 compilation 对象：

```js
class SomePlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('SomePlugin', (compilation, params) => {
      // 上下文信息： compilation、params
    });
  }
}
```

不同钩子会传递不同的上下文对象，这一点在钩子被创建的时候就定下来了

插件架构的灵魂就在于，框架自身只负责实现最关键的核心流程，其它具体功能都尽量交给具体插件实现，包括 Webpack 仓库内也会内置非常多插件(如 DefinePlugin/EntryPlugin 等)

# 总结

Webpack 插件在代码形态上是一个带 apply 方法的对象，我们可以在 apply 函数中注册各式各样的 Hook 回调，监听对应事件，之后在回调中修改上下文状态，达到干预 Webpack 构建逻辑的效果。

由此可见，编写插件时大部分工作都围绕 Hook 展开，因此我们需要理解构建过程中的不同环节会触发什么 Hook、对应传递什么上下文参数、如何与上下文参数对象交互
