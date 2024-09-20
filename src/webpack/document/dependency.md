# dependency graph

Dependency Graph 贯穿 Webpack 整个运行周期，从「构建阶段」的模块解析，到「生成阶段」的 Chunk 生成，以及 Tree-shaking 等功能都高度依赖于 Dependency Graph ，是 Webpack 资源构建流程中一个非常核心的数据结构。

webpack 构建过程从 entry 模块开始，逐步递归找出所有依赖文件，模块之间隐式形成了以 entry 为起点，以模块为节点，以导入导出依赖为边的有向图关系 —— 也就是 Webpack 官网所说的 Dependency Graph。˝

# Webpack 5.0 之后的 Dependency Graph 涉及如下数据类型：

ModuleGraph：记录 Dependency Graph 信息的容器，记录构建过程中涉及到的所有 module、dependency 对象，以及这些对象互相之间的引用；
ModuleGraphConnection ：记录模块间引用关系的数据结构，内部通过 originModule 属性记录引用关系中的父模块，通过 module 属性记录子模块；
ModuleGraphModule ：Module 对象在 Dependency Graph 体系下的补充信息，包含模块对象的 incomingConnections —— 指向模块本身的 ModuleGraphConnection 集合，即谁引用了模块自身；outgoingConnections —— 该模块对外的依赖，即该模块引用了其他那些模块。

这些类型之间关系的基本逻辑是：

Compilation 类内部会维护一个全局唯一的 ModuleGraph 实例对象；
每次解析出新模块后，将 Module、Dependency，以及模块之间的关系 —— ModuleConnection 记录到 compilation.moduleGraph 对象中；
ModuleGraph 除了记录依赖关系外，还提供了许多工具方法，方便使用者迅速读取出 module 或 dependency 附加的信息。ModuleGraph 内部有两个关键属性：
通过 \_dependencyMap 属性记录 Dependency 对象与 ModuleGraphConnection 连接对象之间的映射关系，后续的处理中可以基于这层映射迅速找到 Dependency 实例对应的引用与被引用者；
通过 \_moduleMap 属性记录 Module 与 ModuleGraphModule 之间的映射关系。
最终，通过 ModuleGraph、ModuleGraphConnection、ModuleGraphModule 三种类型的协作，在主体的 Module、Dependency 体系之外，记录模块之间的依赖信息。

# 依赖关系收集过程，主要发生在构建阶段的两个节点：

addDependency ：webpack 从模块内容中解析出引用关系后，创建适当的 Dependency 子类并调用该方法记录到 module 实例；
handleModuleCreation ：模块解析完毕后，webpack 遍历父模块的依赖集合，调用该方法创建 Dependency 对应的子模块对象，之后调用 moduleGraph.setResolvedModule 方法将父子引用信息记录到 moduleGraph 对象上。

moduleGraph.setResolvedModule 方法的逻辑大致为：

```js
class ModuleGraph {
  constructor() {
    /** @type {Map<Dependency, ModuleGraphConnection>} */
    this._dependencyMap = new Map();
    /** @type {Map<Module, ModuleGraphModule>} */
    this._moduleMap = new Map();
  }

  /**
   * @param {Module} originModule the referencing module
   * @param {Dependency} dependency the referencing dependency
   * @param {Module} module the referenced module
   * @returns {void}
   */
  setResolvedModule(originModule, dependency, module) {
    const connection = new ModuleGraphConnection(
      originModule,
      dependency,
      module,
      undefined,
      dependency.weak,
      dependency.getCondition(this)
    );
    this._dependencyMap.set(dependency, connection);
    const connections = this._getModuleGraphModule(module).incomingConnections;
    connections.add(connection);
    const mgm = this._getModuleGraphModule(originModule);
    if (mgm.outgoingConnections === undefined) {
      mgm.outgoingConnections = new Set();
    }
    mgm.outgoingConnections.add(connection);
  }
}
```

主要更改了 \_dependencyMap 及 moduleGraphModule 的出入 connections 属性，以此收集当前模块的上下游依赖关系。

# 作用

Webpack5 中，关键字 moduleGraph 出现了 1000 多次，几乎覆盖了 webpack/lib 文件夹下的所有文件，其作用可见一斑。虽然出现的频率很高，但总的来说可以看出有两个主要作用：信息索引，以及辅助构建 ChunkGraph。

1. 信息索引是 ModuleGraph 最重要的功能，在 ModuleGraph 类型中提供了很多实现 module / dependency 信息查询的工具函数，例如：

getModule(dep: Dependency) ：根据 dep 查找对应的 module 实例；
getOutgoingConnections(module) ：查找 module 实例的所有依赖；
getIssuer(module: Module) ：查找 module 在何处被引用；
等等。
Webpack5 内部的许多插件、Dependency 子类、Module 子类的实现都需要用到这些工具函数查找特定模块、依赖的信息，例如：

SplitChunksPlugin 在优化 chunks 处理中，需要使用 moduleGraph.getExportsInfo 查询各个模块的 exportsInfo (模块导出的信息集合，与 tree-shaking 强相关，后续会单出一篇文章讲解)信息以确定如何分离 chunk。
在 compilation.seal 函数中，需要遍历 entry 对应的 dep 并调用 moduleGraph.getModule 获取完整的 module 定义
...
所以，你在编写插件时，可以考虑适度参考 webpack/lib/ModuleGraph.js 中提供的方法，确认可以获取使用哪些函数，获取到你所需要的信息。

2. 在 Webpack 完成模块构建，进入「生成阶段」之后，会按一系列规则将模块逐一分配到不同 Chunk 对象中，在 Webpack4 时，这个过程主要围绕 Chunk 及 ChunkGroup 两个类型展开。

而 5.0 之后，对 Chunk 之间的依赖关系管理也做了一次大型 重构：首先根据默认规则为每一个 entry 创建对应 Chunk 对象 ，之后调用 buildChunkGraph 方法，遍历 moduleGraph 对象，找出入口模块对应的所有 Module 对象，并将依赖关系转化为 ChunkGraph 对象。

# 总结

，Webpack 构建过程中会持续收集模块之间的引用、被引用关系，并记录到 Dependency Graph 结构中，后续的 Chunk 封装、Code Split、Tree-Shaking 等，但凡需要分析模块关系的功能都强依赖于 Dependency Graph。

可以说，Dependency Graph 是 Webpack 底层最关键的模块地图数据，因此在 Webpack5 之后，Dependency Graph 结构被解耦抽离为以 ModuleGraph 为中心的若干独立类型，架构逻辑更合理，模块搜索、分析效率也得到不同程度优化，进而使得 Webpack5 构建速度也有明显提升。

学习 Dependency Graph，一是能帮助我们从数据结构角度，更深入理解 Webpack 模块读入与分析处理的过程；二是编写自定义插件时，可以通过 ModuleGraph 提供的若干工具函数了解模块之间的相互依赖关系。

# Dependency Graph 在 Webpack 的「构建阶段」与「生成阶段」分别扮演什么样的角色？
1. 构建阶段（Build Phase）
在构建阶段，Webpack 的主要任务是分析你的项目，解析出所有模块之间的依赖关系，并构建起一个依赖图。这个依赖图是一个数据结构，用于表示各个模块之间的依赖关系，它是整个打包过程的基础。

角色：在这个阶段，依赖图的角色是作为源代码组织结构的表示。Webpack 从入口文件开始，递归地解析每个模块的导入语句，识别出项目中所有的模块以及它们之间的依赖关系。
过程：对于每个识别的模块，Webpack 使用相应的 Loader 处理模块内容（例如，将 ES6 代码转换为 ES5，将 SCSS 转换为 CSS），然后将处理后的模块添加到依赖图中。这个过程持续进行，直到所有的模块都被处理并加入到依赖图中。

2. 生成阶段（Emit Phase）
构建完成后，Webpack 进入生成阶段。在这个阶段，Webpack 使用构建阶段创建的依赖图来生成输出的静态资源（bundles）。依赖图在这个阶段中的角色转变为生成输出文件的蓝图。

角色：依赖图在生成阶段的角色是作为打包输出的指导。Webpack 根据依赖图来决定如何合并模块，生成最终的静态文件。这可能包括代码分割、模块合并、压缩优化等操作。
过程：Webpack 遍历依赖图，根据配置（如入口定义、输出设置、优化规则等）将模块分组成一个或多个 Chunk。每个 Chunk 随后被转换成一个或多个输出文件。Webpack 还会处理诸如懒加载模块的动态导入语句，以及通过特定插件生成的附加资源（如 CSS 文件、映射文件等）。
总结来说，在构建阶段，依赖图作为项目结构的表示，指导着模块的解析和处理。而在生成阶段，依赖图转变为生成最终输出文件的蓝图，指导着文件的合并、分割和优化过程。这一转变体现了依赖图在整个 Webpack 打包过程中的核心地位。