// HMR Hot Moudle Replacement 模块热替换
// 应用程序运行过程中，替换，添加，删除模块，而无需重新刷新整个应用
const webpack = require('webpack');
module.exports = {
  // ...
  devServer: {
    // HMR
    hot: true,
    // hotOnly: true
  },
};

if (module.hot) {
  module.hot.accept('./util.js', () => {
    console.log('util.js更新了');
  });
}

// 实现原理
// webpack compile: 将 js源代码编译成 bundle.js
// HMR Server: 用来将热更新的文件输出给 HMR runtime
// Bundle Server: 静态资源文件管理器，提供文件访问路径
// HMR runtime: socket服务器，会被注入到浏览器，更新文件的变化
// bundle.js：构建输出的文件
// 在 HMR runtime和 HMR server之间建立 socket，用于实时更新文件编号

// 流程
// 第一阶段
// 编写完源码后，webpack compile 将源代码和HMR runtime一起编译成bundle文件，传输给Bundle Server
// 静态资源服务器

// 第二阶段
// 当一个文件或模块变化时，webpack监听文件变化对文件重新编译打包，编译生成唯一的hash,这个hash值
// 用来作为下一次热更新的标识
// 根据变化的内容生成两个补丁文件：manifest（包含了hash和chundId来说明变化的内容）和chunk.js模块

// 由于socket服务器在HMR server和HMR runtime之间建立websocket链接，当文件发生变动时，服务端向浏览器推送
// 一条消息，消息包含文件改动后生成的hash值，作为下一次热更新的标识

// 浏览器接收到这条消息之前，浏览器已经在上一次socket消息中记住了此时的hash,此时我们会创建一个ajax去服务端请求获取变化内容的manifest文件
// manifest文件包含重新build生成的hash值，以及变化的模块，浏览器根据manifest文件获取模块变化内容，从而触发render
// 实现局部模块更新

// 总结
// 1. 通过webpack-dev-server创建两个服务器：提供静态资源的服务器和Socket服务器
// express server负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
// socket server是一个websocket长链接，双方可以通信
// socket server监听到对于模块发生变化时，会生成两个文件：.json（manifest文件）和js文件（update chunk）
// 通过长连接，socket server可以直接将两个文件主动发送给客户端
// 浏览器拿到两个新文件后，通过HMR runtime机制，加载两个文件，且针对修改的模块进行更新
