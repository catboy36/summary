// 对 webpack的理解，解决了什么问题
// webpack的最初目标是实现前端项目模块化，高效地管理维护项目中每一个资源

// webpack是一个用于现代 JavaScript应用程序的静态模块打包工具
// 静态模块：开发阶段，可以被webpack直接饮用的资源（可以直接被获取打包进 bundle.js资源）

// webpack处理应用程序时，在内部构建一个依赖图，此依赖图对应映射到项目所需的每个模块
// （不再局限 js文件），并生成一个或多个 bundle

// webpack的能力
// 编译代码能力：提高效率，解决浏览器兼容问题
// 模块整合能力：提高性能，可维护性，解决浏览器频繁请求文件的问题
// 万物皆可模块能力：项目维护性增强，支持不同种类的前端模块类型，统一的模块化方案，所有资源文件的加载都可以通过代码控制
