# 性能优化 & 架构设计

### 编译，部署，框架，代码

### 1. 编译

    自我救赎 --- webpack自身升级的提升

#### v3-v4 的升级

- 配置项：

1. 提出零配置概念 --- 简化配置
2. 区分了开发与编译态 --- mode
   => 提升了开发编译效率，让生产环境更加专注于编译产品
3. 配置差异
   => 分 chunk => commonTrunkPlugin => optimization.splitChunks

#### v4 -v5 的升级

1. 持久化缓存 => cache => 直接利用缓存结果反向跳过构建部分
2. 资源模块的优化 => asset/resource(不用额外引入 loader)
3. 打包优化 跨模块 tree-shaking 配置更丰富

#### 外部 --- webpack 插件

1. 缓存加速
   cache-loader 指向性的缓存
   terser-webpack-plugin
   uglify.js

2. 减肥瘦身
   purifycss-webpack-plugin 未执行的 css
   optimize-css-webpack-plugin css 压缩（v3）

3. 辅助
   cleanWebpackPlugin 自动清理无用文件

4. 改革
   vite 新一代效率导向工程化工具

- 模式

1. 冷启动、冷服务 => dev 状态下不出包（esm）
2. hmr => 直接更新原视图
3. 按需更新 -- 浏览器链接形式加载模块，可以直接缓存

- 原理对比：
  相同点：
  开发环境 vs 生存环境 =》 运行时 & 编译打包

不同点：

1. webpack --- 编译支撑打包
   src => bundle => dev server

hmr 把改动模块以及相关依赖全部编译

2. vite --- 路由劫持，实时编译
   启动 dev server => 直接请求所需模块路由并实时编译
   hmr 只需要让浏览器重新请求变动模块优化资源

### 2 部署

```js
// 寻址 => <link pre-fetch> => 跨域寻址优化
// 静态资源加载优化 => CDN
// ssr => 服务端渲染
```

### 3 框架 & 代码
```js
  // lodash => lodash-es
  // 内存泄漏（闭包）
  // 网络层浪费（节流，防抖）
```

### 防恶化 --- 监控，埋点