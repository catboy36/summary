# tree-shaking 思想

Tree Shaking 较早前由 Rich Harris 在 Rollup 中率先实现，Webpack 自 2.0 版本开始接入，本质上是一种基于 ES Module 规范的 Dead Code Elimination 技术，它会在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未曾其他模块使用，并将其删除，以此实现打包产物的优化。

在 Webpack 中，启动 Tree Shaking 功能必须同时满足三个条件：

1. 使用 ESM 规范编写模块代码；
2. 配置 optimization.usedExports 为 true，启动标记功能；
3. 启动代码优化功能，可以通过如下方式实现：

- 配置 mode = production；
- 配置 optimization.minimize = true ；
- 提供 optimization.minimizer 数组。

```js
// webpack.config.js
module.exports = {
  entry: './src/index',
  mode: 'production',
  devtool: false,
  optimization: {
    usedExports: true,
  },
};
```

# 核心原理

Webpack 中，Tree-shaking 的实现，一是需要先 「标记」 出模块导出值中哪些没有被用过；二是使用代码压缩插件 —— 如 Terser 删掉这些没被用到的导出变量。

- 标记功能需要配置 optimization.usedExports = true 开启

标记的效果就是删除那些没有被其它模块使用的“导出语句”

标记功能只会影响到模块的导出语句，真正执行“Shaking”操作的是 Terser 插件。例如在上例中， foo 变量经过标记后，已经变成一段 Dead Code —— 不可能被执行到的代码，这个时候只需要用 Terser 提供的 DCE 功能就可以删除这一段定义语句，以此实现完整的 Tree Shaking 效果。

# Tree-Shaking 源码分析

Tree-Shaking 的实现大致上可以分为三个步骤：

「构建」阶段，「收集」 模块导出变量并记录到模块依赖关系图 ModuleGraph 对象中；
「封装」阶段，遍历所有模块，「标记」 模块导出变量有没有被使用；
使用代码优化插件 —— 如 Terser，删除无效导出代码。

## 首先，Webpack 需要弄清楚每个模块分别有什么导出值，收集各个模块的导出列表，这一过程发生在 「构建」 阶段

1. 将模块的所有 ESM 导出语句转换为 Dependency 对象，并记录到 module 对象的 dependencies 集合，转换规则：

具名导出转换为 HarmonyExportSpecifierDependency 对象；
default 导出转换为 HarmonyExportExpressionDependency 对象。

2. 所有模块都编译完毕后，触发 compilation.hooks.finishModules 钩子，开始执行 FlagDependencyExportsPlugin 插件回调；
3. FlagDependencyExportsPlugin 插件 遍历 所有 module 对象；
4. 遍历 module 对象的 dependencies 数组，找到所有 HarmonyExportXXXDependency 类型的依赖对象，将其转换为 ExportInfo 对象并记录到 ModuleGraph 对象中。

经过 FlagDependencyExportsPlugin 插件处理后，所有 ESM 风格的模块导出信息都会记录到 ModuleGraph 体系内，后续操作就可以从 ModuleGraph 中直接读取出模块的导出值。

## 接下来，Webpack 需要再次遍历所有模块，逐一 「标记」 出模块导出列表中，哪些导出值有被其它模块用到，哪些没有，这个过程主要发生在 FlagDependencyUsagePlugin 插件中，主流程：

1. 触发 compilation.hooks.optimizeDependencies 钩子，执行 FlagDependencyUsagePlugin 插件 回调；
2. 在 FlagDependencyUsagePlugin 插件中，遍历 modules 数组；
3. 遍历每一个 module 对象的 exportInfo 数组；
4. 为每一个 exportInfo 对象执行 compilation.getDependencyReferencedExports 方法，确定其对应的 dependency 对象有否被其它模块使用；
5. 被任意模块使用到的导出值，调用 exportInfo.setUsedConditionally 方法将其标记为已被使用；
6. exportInfo.setUsedConditionally 内部修改 exportInfo.\_usedInRuntime 属性，记录该导出被如何使用。

执行完毕后，Webpack 会将所有导出语句的使用状况记录到 exportInfo.\_usedInRuntime 字典中。

## 经过前面的收集与标记步骤后，Webpack 已经在 ModuleGraph 体系中清楚地记录了每个模块都导出了哪些值，每个导出值又被哪些模块所使用。接下来，Webpack 会根据导出值的使用情况生成不同的代码，具体逻辑由导出语句对应的 HarmonyExportXXXDependency 类实现，大体流程：

1. 在 compilation.seal 函数中，完成 ChunkGraph 后，开始调用 compilation.codeGeneration 函数生成最终代码；
2. compilation.codeGeneration 中会逐一遍历模块的 dependencies ，并调用 HarmonyExportXXXDependency.Template.apply 方法生成导出语句代码；
3. 在 apply 方法内，读取 ModuleGraph 中存储的 exportsInfo 信息，判断哪些导出值被使用，哪些未被使用；
4. 对已经被使用及未被使用的导出值，分别创建对应的 HarmonyExportInitFragment 对象，保存到 initFragments 数组；
5. 遍历 initFragments 数组，生成最终结果。

简单说，这一步的逻辑就是，用前面收集好的 exportsInfo 对象为模块的导出值分别生成导出语句。

经过前面几步操作之后，模块导出列表中未被使用的值都不会定义在 **webpack_exports** 对象中，形成一段不可能被执行的 Dead Code 效果

在此之后，将由 Terser、UglifyJS 等 DCE 工具“摇”掉这部分无效代码，构成完整的 Tree Shaking 操作。

## 综上所述，Webpack 中 Tree Shaking 的实现分为如下步骤：

1. 在 FlagDependencyExportsPlugin 插件中根据模块的 dependencies 列表收集模块导出值，并记录到 ModuleGraph 体系的 exportsInfo 中；
2. 在 FlagDependencyUsagePlugin 插件中收集模块的导出值的使用情况，并记录到 exportInfo.\_usedInRuntime 集合中；
3. 在 HarmonyExportXXXDependency.Template.apply 方法中根据导出值的使用情况生成不同的导出语句；
4. 使用 DCE 工具删除 Dead Code，实现完整的树摇效果。

# 最佳实践

1. 始终使用 ESM
   Tree-Shaking 强依赖于 ESM 模块化方案的静态分析能力，所以你应该尽量坚持使用 ESM 编写模块代码，对比而言，在过往的 CommonJS、AMD、CMD 旧版本模块化方案中，导入导出行为是高度动态，难以预测的
   ESM 方案则从规范层面规避这一行为，它要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须为字符串常量
   ，ESM 下模块之间的依赖关系是高度确定的，与运行状态无关，编译工具只需要对 ESM 模块做静态分析，就可以从代码字面量中推断出哪些模块值未曾被其它模块使用，这是实现 Tree Shaking 技术的必要条件。
2. 避免无意义的赋值
3. 使用 #pure 标注纯函数调用

与赋值语句类似，JavaScript 中的函数调用语句也可能产生副作用，因此默认情况下 Webpack 并不会对函数调用做 Tree Shaking 操作。不过，开发者可以在调用语句前添加 /_#**PURE**_/ 备注，明确告诉 Webpack 该次函数调用并不会对上下文环境产生副作用，

4. 禁止 Babel 转译模块导入导出语句

Babel 提供的部分功能特性会致使 Tree Shaking 功能失效，例如 Babel 可以将 import/export 风格的 ESM 语句等价转译为 CommonJS 风格的模块化语句，但该功能却导致 Webpack 无法对转译后的模块导入导出内容做静态分析

所以，在 Webpack 中使用 babel-loader 时，建议将 babel-preset-env 的 moduels 配置项设置为 false，关闭模块导入导出语句的转译。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              {
                modules: false,
              },
            ],
          },
        },
      },
    ],
  },
};
```

5. 优化导出值的粒度
   Tree Shaking 逻辑作用在 ESM 的 export 语句上，因此对于下面这种导出场景：

```js
export default {
  bar: 'bar',
  foo: 'foo',
};
```

即使实际上只用到 default 导出值的其中一个属性，整个 default 对象依然会被完整保留。所以实际开发中，应该尽量保持导出值颗粒度和原子性，上例代码的优化版本:

```js
const bar = 'bar';
const foo = 'foo';

export { bar, foo };
```

6. 使用支持 Tree Shaking 的包
   如果可以的话，应尽量使用支持 Tree Shaking 的 npm 包，例如：

使用 lodash-es 替代 lodash ，或者使用 babel-plugin-lodash 实现类似效果。
不过，并不是所有 npm 包都存在 Tree Shaking 的空间，诸如 React、Vue2 一类的框架，原本已经对生产版本做了足够极致的优化，此时业务代码需要整个代码包提供的完整功能，基本上不太需要进行 Tree Shaking。

7. 在异步模块中使用 Tree-Shaking
   Webpack5 之后，我们还可以用一种特殊的备注语法，实现异步模块的 Tree-Shaking 功能，

```js
import(/* webpackExports: ["foo", "default"] */ './foo').then(module => {
  console.log(module.foo);
});
```

示例中，通过 /_ webpackExports: xxx _/ 备注语句，显式声明即将消费异步模块的哪些导出内容，Webpack 即可借此判断模块依赖，实现 Tree-Shaking。

# 总结

Tree-Shaking 是一种只对 ESM 有效的 Dead Code Elimination 技术，它能够自动删除无效（没有被使用，且没有副作用）的模块导出变量，优化产物体积。不过，受限于 JavaScript 语言灵活性所带来的高度动态特性，Tree-Shaking 并不能完美删除所有无效的模块导出，需要我们在业务代码中遵循若干最佳实践规则，帮助 Tree-Shaking 更好地运行。

# 将文件标记为无副作用（side-effect-free）

通过 package.json 的 "sideEffects" 属性即可实现此目的。
如果所有代码都不包含副作用，我们就可以简单地将该属性标记为 false 以告知 webpack 可以安全地删除未使用的导出内容。

```js
{
  "name": "your-project",
  "sideEffects": false
}
```

如果某些代码确实存在一些副作用，可以将 sideEffects 指定为一个数组：

```js
{
  "name": "your-project",
  "sideEffects": ["./src/some-side-effectful-file.js"]
}

{
  "name": "your-project",
  "sideEffects": ["./src/some-side-effectful-file.js", "*.css"]
}
```

sideEffects 和 usedExports（更多地被称为 tree shaking）是两种不同的优化方式。

sideEffects 更为有效 是因为它允许跳过整个模块/文件和整个文件子树。

usedExports 依赖于 terser 检测语句中的副作用。它是一个 JavaScript 任务而且不像 sideEffects 一样简单直接。并且由于规范认为副作用需要被评估，因此它不能跳过子树/依赖项