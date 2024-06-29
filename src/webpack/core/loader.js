// webpack中常见的loader，解决的问题
// loader用于对模块的源代码进行转换，在import或加载模块时预处理文件
// webpack做的是，分析出各个模块的依赖关系，然后形成资源列表，最终打包生成到指定的文件中

// webpack内部，任何文件都是模块，不仅仅是js文件
// 默认情况下import或require加载模块时，webpack只支持对js和json文件打包，css，sass,png等无能为力，这时需要
// 配置对应的loader进行文件内容解析

// 加载模块时，执行顺序：
// entry ---- loaders ---- output
// 当webpack不认识模块时，webpack会在配置文件中查找该文件的解析规则
// 配置loader的三种方式
// 1.配置方式（推荐）：在webpack.config.js文件中指定loader
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          { loader: "sass-loader" },
        ],
      },
    ],
  },
};
// 内联方式：在每个import语句中显示指定loader
// CLI方式：在shell命令中指定


// loader特性
// 反方向链式调用：如上代码 sass-loader --- css-loader --- style-loader
// loader其它特性：
// loader可以是同步的，也可以是异步的
// loader运行在node.js中，且能执行任何操作
// 除了常见的通过package.json的main来讲一个npm模块导出为loader，还可以在module.rules中使用loader字段直接引用一个模块
// 插件（plugin）可以为loader带来更多特性
// loader能够产生额外的任意文件

// 常见loader
// style-loader 将css添加到dom的内联样式标签style里
// css-loader 允许css文件通过require方式引入，返回css代码
// less-loader
// sass-loader
// postcss-loader 用postcss处理css
// autoprefixer-loader 处理css3前缀，已被弃用，建议直接使用postcss
// file-loader 分发文件到output目录并返回相对路径
// url-loader 和file-loader类似，但是当文件小于设定的limit时可以返回一个Data url
// html-minify-loader 压缩html
// babel-loader 用babel来转换ES6文件到ES低版本
// raw-loader webpack中通过import方式导入文件内容