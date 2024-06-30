// 提高webpack构建速度
// 背景
// 构建时间与开发效率相关

// 方案
// 1. 优化loader配置
// 2. 合理使用resolve.extensions
// 3. 优化resolve.modules
// 4. 优化resolve.alias
// 5. 使用DLLPlugin
// 6. 使用cache-loader
// 7. terser启动多进程
// 8. 合理使用sourceMap

// 优化loader配置
// 在使用loader时，可以通过配置include，exclude，test属性来匹配文件，
module.exports = {
  module: {
    rules: [
      {
        // 如果项目源码只有js文件，就不要写成/\.jsx?$/，提升正则表达式性能
        test: /\.js$/,
        // babel-loader支持缓存转换出的结果，开启cacheDirectory
        use: ["babel-loader?cacheDirectory"],
        // 只对项目根目录下的src目录中的文件采用babel-loader
        include: path.resolve(__dirname, "src"),
      },
    ],
  },
};

// 合理使用resolve.extensions
// 从每个require/import语句中，找到需要引入的合适模块代码，此选项添加匹配扩展名，依次查找，不要写多余的，多次文件查找，减慢打包速度
module.exports = {
  //..访问默认扩展
  resolve: {
    extensions: [".ts", "..."],
  },
};

// 优化resolve.modules
// 配置webpack去哪些目录下寻找第三方模块，默认值为['node_modules']
// 如果第三方模块都放在项目根目录node_modules下时，使用绝对路径，减少匹配，配置如下：
module.exports = {
  resolve: {
    // 使用绝对路径指明第三方模块存放位置，减少搜索步骤
    // __dirname表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, "node_modules")],
  },
};

// 优化resolve.alias
// alias给一些常用的路径起一个别名，特别当我们的项目目录比较深时
// 配置alias减少查找过程
module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};

// 使用DLLPlugin
// DLL全称动态链接库，是为软件在windows中实现共享函数库的一种实现方式，webpack内置DLL功能
// 为的就是可以共享，不经常改变代码，抽成一个共享的库
// 这个库在之后的编译过程中，会被引入到其它项目代码中
// 步骤：1.打包一个DLL库 2.引入DLL库
// 1.打包一个DLL库
// 单独的webpack.dll.js配置文件
module.exports = {
  plugins: [
    new webpack.DllPlugin({
      name: "dll_[name]",
      path: path.resolve(__dirname, "./dll/[name].mainfest.json"),
    }),
  ],
};
// 2.引入DLL库
// webpack自带的DllReferencePlugin插件对mainfest.json映射文件进行分析，获取要使用的DLL库
// 通过AddAssetHtmlPlugon，将打包的DLL库引入Html模板中
// 主webpack.config.js配置文件
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, "./dll/dll_react.js"),
      mainfest: path.resolve(__dirname, "./dll/react.mainfest.json"),
    }),
    new AddAssetHtmlPlugin({
      outputPath: "./auto",
      filepath: path.resolve(__dirname, "./dll/dll_react.js"),
    }),
  ],
};

// 使用cache-loader
// 在一些性能开销较大的loader之前添加cache-loader，将结果缓存到磁盘，显著提示二次构建速度
// 保存和读取这些缓存文件会有一些时间开销，所以只对性能开销较大的loader使用此loader

module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ["cache-loader", ...loaders],
        include: path.resolve("src"),
      },
    ],
  },
};

// terser启动多进程
// 使用多进程并行运行来提高构建速度
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
};


// 合理使用sourceMap
// 打包生成sourceMap时，如果信息越详细，打包速度越慢，对应属性如下：
module.exports = {
    // node, eval速度最快,source-map打出代码质量高
    detool: 'source-map'
}

// 主要从优化搜索时间，缩小文件搜索范围，减少不必要的编译等方面入手