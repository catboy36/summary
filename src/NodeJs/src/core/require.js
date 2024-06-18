// Node文件查找优先级，require方法文件查找策略
// nodejs对commonjs进行了支持和实现
// exports module.exports require

// require方法接收以下参数
// 原生模块 http fs path
// 相对路径
// 绝对路径
// 目录作为模块
// 非原生模块的文件模块

// require绝对路径的文件，则直接查找对应的路径，速度最快
// 相对路径模块则相对于当前调用require的文件去查找
// 如果按照确切文件名没有找到模块，nodejs会带上.js .json .node扩展名再加载

// 目录作为模块
// 默认是根据根目录package.json文件的main来指定目录模块
// 不存在package.json或者main入口不存在无法解析，尝试加载目录下的index.js, index.node
// { "name" : "some-library",
//     "main" : "main.js" }

// 非原生模块
// 每个文件中都存在module.paths, 表示模块搜索路径，require就是根据其来寻找文件
// 都找不到的时候，从系统NODE_PATH环境变量查找
console.log(module.paths, module.path)
console.log(process.env.NODE_PATH)