# Webpack 如何处理 CSS 资源

css-loader：该 Loader 会将 CSS 等价翻译为形如 module.exports = "${css}" 的 JavaScript 代码，使得 Webpack 能够如同处理 JS 代码一样解析 CSS 内容与资源依赖；
style-loader：该 Loader 将在产物中注入一系列 runtime 代码，这些代码会将 CSS 内容注入到页面的 <style> 标签，使得样式生效；
mini-css-extract-plugin：该插件会将 CSS 代码抽离到单独的 .css 文件，并将文件通过 <link> 标签方式插入到页面中。

- 当 Webpack 版本低于 5.0 时，请使用 extract-text-webpack-plugin 代替 mini-css-extract-plugin。

三种组件各司其职：css-loader 让 Webpack 能够正确理解 CSS 代码、分析资源依赖；style-loader、mini-css-extract-plugin 则通过适当方式将 CSS 插入到页面，对页面样式产生影响：

经过 style-loader + css-loader 处理后，样式代码最终会被写入 Bundle 文件，并在运行时通过 style 标签注入到页面。这种将 JS、CSS 代码合并进同一个产物文件的方式有几个问题：

JS、CSS 资源无法并行加载，从而降低页面性能；
资源缓存粒度变大，JS、CSS 任意一种变更都会致使缓存失效。

生产环境中通常会用 mini-css-extract-plugin 插件替代 style-loader，将样式代码抽离成单独的 CSS 文件。

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 根据运行环境判断使用那个 loader
          process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin(), new HTMLWebpackPlugin()],
};
```

这里需要注意几个点：

mini-css-extract-plugin 库同时提供 Loader、Plugin 组件，需要同时使用
mini-css-extract-plugin 不能与 style-loader 混用，否则报错
mini-css-extract-plugin 需要与 html-webpack-plugin 同时使用，才能将产物路径以 link 标签方式插入到 html 中

# css 预处理

less-loader, sass-loader, stylus-loader

# post-css

预处理器通常定义了一套 CSS 之上的超集语言；PostCSS 并没有定义一门新的语言，而是与 @babel/core 类似，只是实现了一套将 CSS 源码解析为 AST 结构，并传入 PostCSS 插件做处理的流程框架，具体功能都由插件实现。

```js
yarn add -D autoprefixer

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // 添加 autoprefixer 插件
                plugins: [require("autoprefixer")],
              },
            },
          }
        ],
      },
    ],
  }
};

```

# PostCSS 最大的优势在于其简单、易用、丰富的插件生态，基本上已经能够覆盖样式开发的方方面面。实践中，经常使用的插件有：

autoprefixer：基于 Can I Use 网站上的数据，自动添加浏览器前缀
postcss-preset-env：一款将最新 CSS 语言特性转译为兼容性更佳的低版本代码的插件
postcss-less：兼容 Less 语法的 PostCSS 插件，类似的还有：postcss-sass、poststylus
stylelint：一个现代 CSS 代码风格检查器，能够帮助识别样式代码中的异常或风格问题

# 总结

Webpack 不能理解 CSS 代码，所以需要使用 css-loader、style-loader、mini-css-extract-plugin 三种组件处理样式资源；
Less/Sass/Stylus/PostCSS 等工具可弥补原生 CSS 语言层面的诸多功能缺失，例如数值运算、嵌套、代码复用等。
