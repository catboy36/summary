// webpack proxy webpack提供代理服务
// 基本行为就是接收客户端发送的请求后转发给其它服务器
// 目的是为了便于开发者在开发模式下解决跨域问题（浏览器安全策略限制）
// 想要实现代理需要中间服务器---webpack-dev-server

// webpack-dev-server 将自动编译和自动刷新浏览器等功能集成在一起
// ./webpack.config.js
const path = require("path");
module.exports = {
  // ...
  devServer: {
    // 新版是static字段
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    proxy: {
      "/api": {
        target: "https://api.github.com",
      },
    },
    // ...
  },
};

// 工作原理
// 利用http-proxy-middleware这个http代理中间件，实现请求转发

const express = require("express");
const proxy = require("http-proxy-middleware");
const app = express();
app.use(
  "/api",
  proxy({ target: "http://www.example.org", changeOrigin: true })
);
app.listen(3000);

// 跨域
// 本地 ---- 代理服务器 ----- 目标服务器

// 服务器和服务器之间请求数据并不会存在跨域行为，跨域行为是浏览器安全策略限制
