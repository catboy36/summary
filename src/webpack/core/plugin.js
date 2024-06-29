// plugin是一种计算机应用程序，它和主应用程序互相交互，以提供特定的功能
// plugin运行在webpack的不同阶段（钩子/生命周期），贯穿整个webpack编译周期

// 目的在于解决loader无法实现的其他事

// 配置方式
// 一般情况，通过配置文件导出对象中plugins属性传入new实例对象
const HtmlWebpackPlugin = require("html-webpack-plugin"); // npm
const webpack = require("webpack"); //
module.exports = {
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
  ],
};

// 特性
// 本质是一个具有apply方法的js对象
// apply方法会被webpack compiler调用，并在整个编译生命周期都可以访问compiler对象
const pluginName = "ConsoleLogOnBuildWebpackPlugin";
class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log("webpack ");
    });
  }
}
module.exports = ConsoleLogOnBuildWebpackPlugin;

// 编译生命周期钩子：
// entry-option: 初始化option
// run
// compile: 真正开始编译，在创建compilation对象之前
// compilation：生成好了compilation对象
// make：从entry开始递归分析依赖，准备对每个模块进行build
// after-compile：编译build过程结束
// emit: 将内存中assets内容写到磁盘文件夹之前
// after-emit：将内存中assets内容写到磁盘文件夹之后
// done：完成所有的编译过程
// failed：编译失败的时候

// 常见的plugin
// HtmlWebpackPlugin 在打包结束后，自动生成一个html文件，并把打包生成的js模块引入该html
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: "My App",
      filename: "app.html",
      template: "./src/html/index.html",
    }),
  ],
};
// 在html模板中，通过<%=htmlWebpackPlugin.options.XXX%>方式获取配置的值
// <!DOCTYPE html>
// <html lang="en">
// <head>
//  <meta charset="UTF-8">
//  <meta name="viewport" content="width=device-width, initial-scale=1.0">
//  <meta http-equiv="X-UA-Compatible" content="ie=edge">
//  <title><%=htmlWebpackPlugin.options.title%></title>
// </head>
// <body>
//  <h1>html-webpack-plugin</h1>
// </body>
// </html>

// clean-webpack-plugin 删除（清理）构建目录
// mini-css-extract-plugin 提取css到一个单独的文件夹
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
};

// DefinePlugin 允许在编译时创建配置的全局对象，是一个webpack内置插件，不需要安装
const { DefinePlugin } = require("webpack");
module.exports = {
  plugins: [
    new DefinePlugin({
      BASE_URL: '"./"',
    }),
  ],
};
// 这时候编译template模块的时候，可以获取全局对象
{
  /* <link rel="icon" href="<%= BASE_URL%>favicon.ico>" */
}

// copy-webpack-plugin
// 复制文件或目录到执行区域，比如vue打包中，把一些文件放public目录下，这个目录会复制到dist目录
const CopyWebpackPlugin = require('copy-webpack-plugin');
new CopyWebpackPlugin({
  patterns: [
    {
      from: "public",
      to:'dist', // 可以省略，默认复制到打包目录下
      globOptions: { // 额外选项
        ignore: ["**/index.html"], // 需要忽略的文件
      },
    },
  ],
});
