// webpack优化前端性能

// 方案
// 1. JS代码压缩
// 2. CSS代码压缩
// 3. HTML代码压缩
// 4. 文件大小压缩
// 5. 图片压缩
// 6. Tree Shaking
// 7. 代码分离
// 8. 内联chunk

// js代码压缩
// terser帮助我们压缩，uglify代码，让bundle更小
// production模式下，webpack默认就是使用TerserPlugin来处理代码的，自定义配置如下：
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 多进程并发提高构建速度
      }),
    ],
  },
};

// css代码压缩
// css压缩通常是去除无用的空格，因为很难修改选择器，属性名称，值等
// css-minimizer-webpack-plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};

// Html文件代码压缩
// 使用HtmlWebpackPlugin插件来生成HTML模板，通过配置属性minify进行html优化
module.exports = {
  plugin: [
    new HtmlwebpackPlugin({
      // 设置minify，实际上会使用另一个插件html-minifier-terser
      minify: {
        minifyCSS: false, // 是否压缩css
        collapseWhitespace: false, // 是否折叠空格
        removeComments: true, // 是否移除注释
      },
    }),
  ],
};

// 文件大小压缩
// 对文件大小压缩，减少http传输过程中宽带的损耗
// compression-webpack-plugin
new ComepressionPlugin({
  test: /\.(css|js)$/, // 哪些文件需要压缩
  threshold: 500, // 设置文件多大开始压缩
  minRatio: 0.7, // 只要压缩比例
  algorithm: "gzip", // 采用的压缩算法
});

// 图片压缩
// 图片往往很大，压缩较为重要
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
          },
        },
        {
          loader: "image-webpack-loader",
          options: {
            // 压缩jpeg的配置
            mozjpeg: {
              progressive: true,
              quality: 65,
            },
            // 使用imagemin**-optipng压缩 png， enable: false为关闭
            optipng: {
              enabled: false,
            },
            // 使用imagemin-pngquant 压缩png
            pngquant: {
              quality: "65-90",
              speed: 4,
            },
            // 压缩gif的配置
            gifsicle: {
              interlaced: false,
            },
            // 开启webp，会把 jpg 和png图片压缩为 webp格式
            webp: {
              quality: 75,
            },
          },
        },
      ],
    },
  ];
}

// Tree Shaking
// 计算机术语，表示消除死代码，依赖于ES moudle的静态语法分析（不执行任何代码，可以明确知道模块的依赖关系）

// webpack实现tree shaking两种方案：
// usedExports: 通过标记某些函数是否被使用，之后通过terser进行优化
// sideEffects：跳过整个模块/文件，直接查看该文件是否有副作用

// usedExports
module.exports = {
  optimization: {
    usedExports: true,
  },
};
// 没有被用上的代码在webpack打包中会加入unused harmony export mul 注释，用来告知terser在优化时，可以删除这段代码

// sideEffects
// sideEffects用于告知webpack compiler哪些模块时有副作用，配置方法是在package.json中设置sideEffects属性
// 如果sideEffects设置为false，就是告知webpack可以安全的删除未用到的exports
// 如果有些文件需要保留，可以设置为数组的形式

// "sideEffects":[
//  "./src/util/format.js",
//  "*.css" // css
// ]

// css tree shaking
// css进行tree shaking可以安装PurgeCss插件
// purgecss-webpack-plugin
const PurgeCssPlugin = require("purgecss-webpack-plugin");
const glob = require("glob");
module.exports = {
  plugins: [
    new PurgeCssPlugin({
      paths: glob.sync(`${path.resolve("./src")}/**/*`, { nodir: true }),
      // src
      safelist: function () {
        return {
          standard: ["html"],
        };
      },
    }),
  ],
};

// 代码分离
// 将代码分离到不同的bundle中，之后按需加载，或并行加载
// splitChunksPlugin，webpack默认集成，只需配置
// 默认配置中，chunks仅仅针对异步请求，我们可以设置为initial或all
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 300, // 拆分包的大小，至少为minSize，如果不大于minSize，不拆分
      maxSize: 1000, // 将大雨maxSize的包，拆分为不小于minSize的包
      minChunks: 1, // 被引入次数，默认1(至少是1)
    },
  },
};

// 内联chunk
// 可以通过InlineChunkHtmlPlugin插件将一些chunk的模块内联到html，如runtime的代码（对模块进行解析，加载，模块信息相关的代码）
// 代码量不大，但是必须加载
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  plugin: [new InlineChunkHtmlPlugin(HtmlWebpackPlugin, /runtime.+\.js/)],
};
