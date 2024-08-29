# node 是什么，可以做什么

高性能 web 服务器
commonjs 规范，node 是 cjs 的实现

跨端开发：weex,rn，pc
后端开发： koa,express,egg
前端开发：webpack,rollup
工具开发： 脚本，脚手架，cra,vue-cli

压缩代码：zip, uglifyjs,JSmin
依赖： npm bower
模块： commonjs
构建： webpack,rollup,vite
模板： jade handlebars
跨端： electron,tuari

# node 架构，node 的问题

## 架构

- native modules: 暴漏出的接口，是 js 实现 path fs htpp

- Builtin Modules: 中间层，让 node 获取一些底层操作

- v8 | libuv | http-parser | zlib | openssl

libuv 高性能的， C 编写的，异步非阻塞 IO 库 实现事件循环

http-parser 处理网络报文
zlib 文件压缩

- CPU GPU RAM DISK OS

## 问题

- js 单线程，脆弱 cluster/ pm2
- nodejs 对一些数据库 mongoDB，mySQL 支持比较好，但是对一些 es,neo4j,tigerGraph 支持一般

# node 环境和浏览器环境区别

- runtime engine 和宿主环境
- node v8 + API 文件，网络的支持
- chrome: V8 + 浏览器 API -> DOM BOM

宿主环境不一样，事件循环也不一样

- 浏览器： 微任务，宏任务， raf, layout, requestIdelCallback
- node commonjs 规范，浏览器不支持
- 浏览器 ESM 标准

# node 的事件循环机制

- v8 引擎解析 js 代码，调用 node api
- libuv 库负责 node api 执行，将不同的任务分为不同的线程，形成一个 event loop

- 定时器：本阶段执行已经被 setTimeout / setInterval 调度的函数
- 待定回调： 执行延迟到下一个循环迭代的 I/O 回调
- idle, prepare: 系统内部调用
- poll 轮询： 检索新的 I/O 事件，执行与 I/O 相关的回调
- 检测： setImmediate 的回调函数
- 关闭回调函数： socket.on('close')

每个阶段执行完，执行 process.nextTick ---> promise(nextTick 优先级高于 promise 回调)

# node 题目

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(() => {
  console.log("setTimeout0");
  setTimeout(() => {
    console.log("setTimeout1");
  }, 0);
  setImmediate(() => {
    console.log("setImmediate");
  });
}, 0);

async1();

process.nextTick(() => {
  console.log("nextTick");
});

new Promise((res) => {
  console.log("promise1");
  res();
  console.log("promise2");
}).then(() => {
  console.log("promise.then");
});

console.log("script end");
```

- script start
- async1 start
- async2
- promise1
- promise2
- script end
- nextTick
- async1 end
- promise.then
- setTimeout0

如果两者都在主模块（main module）调用，那么执行先后取决于进程性能，即随机。
如果两者都不在主模块调用（即在一个 IO circle 中调用），那么 setImmediate 的回调永远先执行。

- setImmediate
- setTimeout1

# npm 包依赖关系 / 为什么有 xxxDependencies

- dependencies: 直接项目依赖
- 项目中打包后实际要用到的
- src 文件夹下要用到的
- lodash,vue,react

- devDependencies: 开发依赖，不会被自动下载
- webpack
- 打包是否会构建，取决于项目是否声明

- peerDependencies: 同版本依赖， 插件依赖
- 插件不能单独运行
- 插件运行的前提时核心库必须安装了
- 不希望核心库重复下载
- 核心库在主项目中的版本，最好和插件需要使用的保持一致

- bundledDependencies: 捆绑依赖
- npm pack 命令时，压缩包中会有对应的 bundle，安装时也会安装相应的 bundle

- optionsDependencies: 可选依赖，即使安装失败也不影响项目运行

# npm ci 和 npm install 区别

- npm ci 要求项目中必须存在 lock 文件
- npm ci 完全根据 package-lock.json 去安装依赖，可以保证整个团队开发都是用版本完全一致的依赖
- npm ci 不需要计算依赖树，所以速度更快
- npm ci 安装的时候会先删除 node_modules
- npm ci 无法单独安装某一个依赖包，只能一次安装整个项目所有依赖
- 如果 package.json 和 package-lock.json 产生冲突，npm ci 会直接报错，并不会更新 lock 文件
- npm ci 是一个非常稳定的安装方式，完全不会改变 package.json 和 lock 文件

# npm 和 yarn 区别

- npm 在还没有到 v5.4.2 版本之前，lock 机制本身有很大差别
- npm v5.0.x 根据 package-lock.json 来下载
- npm v5.1.0 - v5.4.2 如果 package.json 有符号的更新版本，忽略 lock，根据 package.json 进行安装
- npm v5.4.2 以上，如果 package.json 和 package-lock.json 之间兼容，则根据 lock 进行安装，不兼容则根据 package.json 安装，然后更新 lock

- yarn 就是 npm v5.4.2 以上的规则
- yarn 刚出现时，有很多优点

  - lock
  - 扁平化安装
  - 网络更好
  - 缓存机制
  - npm 也在逐渐补齐这些能力了

- 命令：
- npm config get cache / yarn cache dir

- 独有命令
- yarn why
- yarn pack
- yarn autoclean
- yarn license
- yarn import
- npm rebuild
- synp(将 yarn.lock 转换为 package-lock.json)

# 什么是阻塞 | 非阻塞

系统在接受到了输入，再到输出的整个过程中，是否运行其它输入

- 阻塞： async/await

# 垃圾回收

- GC Root
- 标记清除

- 通过 GC Root 标记空间中的活动对象和非活动对象

  - 如果是 GC Root 能遍历到的对象，认为是 reachable，活动对象，不应该被清除
  - 如果是 GC Root 遍历不到的，认为是 unreachable, 非活动对象，可能会被清除

- 之前： 引用计数

  - 循环引用 内存泄漏

- GC Root 包括：
- 全局对象 window/ global
- DOM 树
- 存放在栈上面的一些变量

# process 对象

- process 代表 node 应用程序，它可以获取到程序应用时的各种环境
- process.argv
- process.on('exit', callback)
- process.cwd() 命令行运行的地址
- process.memoryUsage()
- process.nextTick()

# 如何创建子进程，子进程 crash 以后如何重启

```js
const cp = require("child_process");
// spawn, exec, execfile
const pm = cp.fork(__dirname, +"child.js");
pm.send('666')
```

- pm2 做进程守护
- 对进程使用健康检查模式，定时新启动一个进程，去查询目标进程的健康状态，如果该进程推出了，就重启一下


# node多进程架构
- 多进程架构又称为 master-worker 架构，或者主从架构
- 进程分为：主进程，工作进程
- 典型分布式的并行处理任务模式，具有较好的稳定性，扩展性和伸缩性
- 主进程
  - 一般用来调度和管理子进程
- 子进程
  - 一般直接处理业务

- node中可以通过fork复制出子进程，需要30ms和1MB的内存空间

- 通信上：node中有个管道的概念，有libuv提供， 在应用上，使用message,send方法，比较方便通信


# child_process有哪几种子线程方法，区别
- spawn: 最基础 异步的
- fork: 在源码里，加了个RPC，默认只能走RPC通信
- execfile: 专门用于运行某个可执行文件
  - 拿不到系统环境，参数是数组
-exec: 能拿到系统环境，参数进行了格式化 同步的方法

# 如何使用cluster实现多进程

- node提供的一个模块，允许在多个子进程中，运行不同的node程序
