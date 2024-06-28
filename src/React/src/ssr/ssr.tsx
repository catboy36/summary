// ssr
// server-side rendering 服务端渲染
// 由服务端完成页面html结构拼接的页面处理技术，发送到浏览器，然后为其绑定状态和事件，成为完全可交互页面的过程
// 解决的问题如下：
// 1.SEO 由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面
// 2. 加速首屏加载，解决首页白屏问题

// 方案
// 1.手动搭建
// 2.使用成熟的ssr框架，如next.js

// 搭建过程，适用express
// const express = require('express');
// const app = express();
// app.get('/', (req, res) =>
//   res.send(`
// <html>
//  <head>
//  <title>ssr demo</title>
//  </head>
//  <body>
//  Hello world
//  </body>
// </html>
// `)
// );
// app.listen(3000, () => console.log('Exampleapp listening on port 3000!'));

// 在服务端编写react代码
import React from 'react';
const Home = () => {
  return <div>home</div>;
};
export default Home;
// 为了服务器识别jsx，这里需要使用webpack对项目打包转换 webpack.server.js
// const path = require('path'); //node path
// const nodeExternals = require('webpack-node-externals');
// module.exports = {
//   target: 'node',
//   mode: 'development', // 开发模式
//   entry: './app.js', // 入口
//   output: {
//     // 打包出口
//     filename: 'bundle.js', // 打包后文件名
//     path: path.resolve(__dirname, 'build'), // 存放在根目录build文件夹下
//   },
//   externals: [nodeExternals()], // 保持node中require的引用方式
//   module: {
//     rules: [ //打包规则
//       {
//         //
//         test: /\.js?$/, // 对所有js进行打包
//         loader: 'babel-loader', // 使用babel-loader进行打包
//         exclude: /node_modules/, // 不打包node_modules中的js文件
//         options: {
//           presets: [
//             'react',
//             'stage-0',
//             [
//               'env',
//               {
//                 //loader时额外的打包规则 , 对react,JSX ES6进行转换
//                 targets: {
//                   browsers: ['last 2versions'], // 对主流浏览器最近两个版本进行兼容
//                 },
//               },
//             ],
//           ],
//         },
//       },
//     ],
//   },
// };
// 接着借助react-dom提供了服务端渲染的rednerToString方法，负责把react组件解析为html
// import express from 'express';
// import React from 'react'; // React JSX
// import { renderToString } from 'react-dom/server'; // renderToString
// import Home from './src/containers/Home';
// const app = express();
// const content = renderToString(<Home />);
// app.get('/', (req, res) =>
//   res.send(`
// <html>
//  <head>
//  <title>ssr demo</title>
//  </head>
//  <body>
//  ${content}
//  </body>
// </html>
// `)
// );
// app.listen(3001, () => console.log('Exampleapp listening on port 3001!'))

// 上述过程，已经能成功将组件渲染到页面
// 事件处理方法，无法在服务端完成，因此需要将组件代码在浏览器中再执行一遍，这种服务器端和客户端共用一套代码的方式称之为同构
// 通俗说就是一套react代码在服务器运行一遍，到达浏览器又运行一遍：
// 1. 服务端渲染完成页面结构
// 2. 浏览器端渲染完成事件绑定

// 浏览器实现事件绑定的方式为让浏览器去拉去js文件执行，让js代码来控制，因此需要引入script标签
// 通过script标签为页面引入客户端执行的react代码，并通过express的static中间件为js文件配置路由
// import express from 'express';
// import React from 'react'; // React JSX
// import { renderToString } from 'react-dom/server'; // renderToString
// import Home from './src/containers/Home';
// const app = express();
// app.use(express.static('public'));
// // 使用express提供的static中间件 , 中间件会将所有静态文件的路由指向public文件夹
// const content = renderToString(<Home />);
// app.get('/', (req, res) =>
//   res.send(`
// <html>
//  <head>
//  <title>ssr demo</title>
//  </head>
//  <body>
//  ${content}
//  <script src="/index.js"></script>
//  </body>
// </html>
// `)
// );
// app.listen(3001, () => console.log('Example app listening on port 3001!'));

// 然后在客户端执行以下react代码，创建webpack.client.js作为客户端react代码的webpack配置文件：
// const path = require('path'); //node path
// module.exports = {
//   mode: 'development', //
//   entry: './src/client/index.js', //
//   output: {
//     //
//     filename: 'index.js', //
//     path: path.resolve(__dirname, 'public'), // build
//   },
//   module: {
//     rules: [
//       {
//         //
//         test: /\.js?$/, // js
//         loader: 'babel-loader', // babel-loader
//         exclude: /node_modules/, // node_modules js
//         options: {
//           presets: [
//             'react',
//             'stage-0',
//             [
//               'env',
//               {
//                 //loader , react,JSX
//                 targets: {
//                   browsers: ['last 2versions'], //
//                 },
//               },
//             ],
//           ],
//         },
//       },
//     ],
//   },
// };

// 该方法能够简单实现首页的react服务端渲染，过程如下
//服务端运行react代码生成html
// 发送html给浏览器
// 浏览器接到内容显示
// 浏览器加载js文件
// js代码执行并接管页面的操作

// 在做完初始渲染时，一个应用会存在路由的情况，配置如下：
// import React from 'react'; // React JSX
// import { Route } from 'react-router-dom'; //
// import Home from './containers/Home'; // Home
// export default (
//   <div>
//     <Route path="/" exact component={Home}></Route>
//   </div>
// );

// 然后通过index.js引用路由信息
// import React from 'react';
// import ReactDom from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
// import Router from '../Routers';
// const App = () => {
//   return <BrowserRouter>{Router}</BrowserRouter>;
// };
// ReactDom.hydrate(<App />, document.getElementById('root'));

// 以上会报错，在于Route组件外包div，但服务端返回代码没有这个div
// 解决方法：服务端使用StaticRouter代替BrowserRouter，通过context传参
// import express from 'express';
// import React from 'react'; // React JSX
// import { renderToString } from 'react-dom/server'; // renderToString
// import { StaticRouter } from 'react-router-dom';
// import Router from '../Routers';
// const app = express();
// app.use(express.static('public'));
// // express static , public
// app.get('/', (req, res) => {
//   const content = renderToString(
//     // 传入当前path
//     // context为必填参数, 用于服务端渲染参数传递
//     <StaticRouter location={req.path} context={{}}>
//       {Router}
//     </StaticRouter>
//   );
//   res.send(`
//  <html>
//  <head>
//  <title>ssr demo</title>
//  </head>
//  <body>
//  <div id="root">${content}</div>
//  <script src="/index.js"></script>
//  </body>
//  </html>
//  `);
// });
// app.listen(3001, () => console.log('Exampleapp listening on port 3001!'));

// 总结
// react服务端渲染原理：
// node server接收客户端请求，得到当前的请求url
// 在已有的路由表内查找到对应的组件，拿到需要请求的数据，将数据作为props，context或者store形式传入组件
// 然后计入react内置的服务端渲染方法renderToString()把组件渲染为html字符串，在把最终的html进行输出钱需要将数据注入到浏览器端
// 浏览器开始进行渲染和节点对比，然后执行完成组件内事件绑定和一些交互，浏览器重用了服务端输出的html节点，流程结束
