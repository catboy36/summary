# 配置结构

Webpack 还支持以数组、函数方式配置运行参数

1. 单个配置对象：比较常用的一种方式，逻辑简单，适合大多数业务项目；
2. 配置对象数组：每个数组项都是一个完整的配置对象，每个对象都会触发一次单独的构建，通常用于需要为同一份代码构建多种产物的场景，如 Library；
3. 函数：Webpack 启动时会执行该函数获取配置，我们可以在函数中根据环境参数(如 NODE_ENV)动态调整配置对象。

## 配置数组

数组方式时，Webpack 会在启动后创建多个 Compilation 实例，并行执行构建工作，但需要注意，Compilation 实例间基本上不作通讯，这意味着这种并行构建对运行性能并没有任何正向收益，例如某个 Module 在 Compilation 实例 A 中完成解析、构建后，在其它 Compilation 中依然需要完整经历构建流程，无法直接复用结果。

数组方式主要用于应对“同一份代码打包出多种产物”的场景，例如在构建 Library 时，我们通常需要同时构建出 ESM/CMD/UMD 等模块方案的产物

- 提示：使用配置数组时，还可以通过 --config-name 参数指定需要构建的配置对象，例如上例配置中若执行 npx webpack --config-name='amd'，则仅使用数组中 name='amd' 的项做构建。

- 若是“多份代码打包多份产物”的场景，则建议使用 entry 配置多个应用入口。

```js
// webpack.config.js
// webpack.config.js
module.exports = [
  {
    output: {
      filename: './dist-amd.js',
      libraryTarget: 'amd',
    },
    name: 'amd',
    entry: './app.js',
    mode: 'production',
  },
  {
    output: {
      filename: './dist-commonjs.js',
      libraryTarget: 'commonjs',
    },
    name: 'commonjs',
    entry: './app.js',
    mode: 'production',
  },
];
```

- 使用数组方式时，我们还可以借助 webpack-merge 工具简化配置逻辑

```js
const { merge } = require('webpack-merge');

const baseConfig = {
  output: {
    path: './dist',
  },
  name: 'amd',
  entry: './app.js',
  mode: 'production',
};

module.exports = [
  merge(baseConfig, {
    output: {
      filename: '[name]-amd.js',
      libraryTarget: 'amd',
    },
  }),
  merge(baseConfig, {
    output: {
      filename: './[name]-commonjs.js',
      libraryTarget: 'commonjs',
    },
  }),
];
```

## 配置函数

配置函数方式要求在配置文件中导出一个函数，并在函数中返回 Webpack 配置对象，或配置数组，或 Promise 对象，如：

env：通过 --env 传递的命令行参数，适用于自定义参数
argv：命令行 Flags 参数，支持 entry/output-path/mode/merge 等。

“配置函数”这种方式的意义在于，允许用户根据命令行参数动态创建配置对象，可用于实现简单的多环境治理策略

```js
// npx webpack --env app.type=miniapp --mode=production
module.exports = function (env, argv) {
  return {
    mode: argv.mode ? "production" : "development",
    devtool: argv.mode ? "source-map" : "eval",
    output: {
      path: path.join(__dirname, `./dist/${env.app.type}`,
      filename: '[name].js'
    },
    plugins: [
      new TerserPlugin({
        terserOptions: {
          compress: argv.mode === "production",
        },
      }),
    ],
  };
};

```

## 环境治理策略

我们能根据部署环境需求，对同一份代码执行各有侧重的打包策略

1. 开发环境需要使用 webpack-dev-server 实现 Hot Module Replacement；
2. 测试环境需要带上完整的 Soucemap 内容，以帮助更好地定位问题；
3. 生产环境需要尽可能打包出更快、更小、更好的应用代码，确保用户体验。

业界比较流行将不同环境配置分别维护在单独的配置文件中
之后配合 --config 选项指定配置目标

# 核心配置项汇总

包括：流程配置、性能优化类配置、日志类配置、开发效率类配置等

1. entry：声明项目入口文件，Webpack 会从这个文件开始递归找出所有文件依赖；
2. output：声明构建结果的存放位置；
3. target：用于配置编译产物的目标运行环境，支持 web、node、electron 等值，不同值最终产物会有所差异；
4. mode：编译模式短语，支持 development、production 等值，Webpack 会根据该属性推断默认配置；
5. optimization：用于控制如何优化产物包体积，内置 Dead Code Elimination、Scope Hoisting、代码混淆、代码压缩等功能；
6. module：用于声明模块加载规则，例如针对什么类型的资源需要使用哪些 Loader 进行处理；
7. plugin：Webpack 插件列表。

## entry

字符串：指定入口文件路径；
对象：对象形态功能比较完备，除了可以指定入口文件列表外，还可以指定入口依赖、Runtime 打包方式等；
函数：动态生成 Entry 配置信息，函数中可返回字符串、对象或数组；
数组：指明多个入口文件，数组项可以为上述介绍的文件路径字符串、对象、函数形式，Webpack 会将数组指明的入口全部打包成一个 Bundle。

```js
module.exports = {
  //...
  entry: {
    // 字符串形态
    home: './home.js',
    // 数组形态
    shared: ['react', 'react-dom', 'redux', 'react-redux'],
    // 对象形态
    personal: {
      import: './personal.js',
      filename: 'pages/personal.js',
      dependOn: 'shared',
      chunkLoading: 'jsonp',
      asyncChunks: true,
    },
    // 函数形态
    admin: function () {
      return './admin.js';
    },
  },
};
```

- 「对象」 形态的配置逻辑最为复杂，支持如下配置属性：
  import：声明入口文件，支持路径字符串或路径数组(多入口)；
  dependOn：声明该入口的前置依赖 Bundle；
  runtime：设置该入口的 Runtime Chunk，若该属性不为空，Webpack 会将该入口的运行时代码抽离成单独的 Bundle；
  filename：效果与 output.filename 类同，用于声明该模块构建产物路径；
  library：声明该入口的 output.library 配置，一般在构建 NPM Library 时使用；
  publicPath：效果与 output.publicPath 相同，用于声明该入口文件的发布 URL；
  chunkLoading：效果与 output.chunkLoading 相同，用于声明异步模块加载的技术方案，支持 false/jsonp/require/import 等值；
  asyncChunks：效果与 output.asyncChunks 相同，用于声明是否支持异步模块加载，默认值为 true。

* dependOn 属性用于声明前置 Bundle 依赖，从效果上看能够减少重复代码，优化构建产物质量
* dependOn 适用于那些有明确入口依赖的场景

```js
module.exports = {
  // ...
  entry: {
    main: './src/index.js',
    foo: { import: './src/foo.js', dependOn: 'main' },
  },
};
```

- runtime 管理运行时代码：
  为支持产物代码在各种环境中正常运行，Webpack 会在产物文件中注入一系列运行时代码，用以支撑起整个应用框架。运行时代码的多寡取决于我们用到多少特性，
  需要导入导出文件时，将注入 **webpack_require**.r 等；
  使用异步加载时，将注入 **webpack_require**.l 等；
  等等。
  使用 runtime 配置将运行时抽离为独立 Bundle

```js
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    main: { import: './src/index.js', runtime: 'common-runtime' },
    foo: { import: './src/foo.js', runtime: 'common-runtime' },
  },
  output: {
    clean: true,
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

entry.runtime 是一种常用的应用性能优化手段

## output
output.path：声明产物放在什么文件目录下；
output.filename：声明产物文件名规则，支持 [name]/[hash] 等占位符；
output.publicPath：文件发布路径，在 Web 应用中使用率较高；
output.clean：是否自动清除 path 目录下的内容，调试时特别好用；
output.library：NPM Library 形态下的一些产物特性，例如：Library 名称、模块化(UMD/CMD 等)规范；
output.chunkLoading：声明加载异步模块的技术方案，支持 false/jsonp/require 等方式。
等等。

## mode
production/ development