# 使用 HMR (Hot Module Replacement)

能够在保持页面状态不变的情况下动态替换、删除、添加代码模块，提供超级丝滑顺畅的 Web 页面开发体验

Webpack 生态下，只需要经过简单的配置，即可启动 HMR 功能，大致分两步：

1. 设置 devServer.hot 属性为 true：

```js
// webpack.config.js
module.exports = {
  // ...
  devServer: {
    // 必须设置 devServer.hot = true，启动 HMR 功能
    hot: true,
  },
};
```

2. 之后，还需要在代码调用 module.hot.accept 接口，声明如何将模块安全地替换为最新代码，如：

```js
import component from './component';
let demoComponent = component();

document.body.appendChild(demoComponent);
// HMR interface
if (module.hot) {
  // Capture hot update
  module.hot.accept('./component', () => {
    const nextComponent = component();

    // Replace old content with the hot loaded one
    document.body.replaceChild(nextComponent, demoComponent);

    demoComponent = nextComponent;
  });
}
```

# 实现原理

Webpack HMR 特性的执行过程并不复杂，核心：

1. 使用 webpack-dev-server （后面简称 WDS）托管静态资源，同时以 Runtime 方式注入一段处理 HMR 逻辑的客户端代码；
2. 浏览器加载页面后，与 WDS 建立 WebSocket 连接；
3. Webpack 监听到文件变化后，增量构建发生变更的模块，并通过 WebSocket 发送 hash 事件；
4. 浏览器接收到 hash 事件后，请求 manifest 资源文件，确认增量变更范围；
5. 浏览器加载发生变更的增量模块；
6. Webpack 运行时触发变更模块的 module.hot.accept 回调，执行代码变更逻辑；
   done。

#

1. 首先是 注入 HMR 客户端运行时：在前面章节《Runtime：模块编译打包及运行时逻辑》中，我们已经详细介绍了 Webpack 运行时概念与底层实现逻辑，在 HMR 场景下，执行 npx webpack serve 命令后，webpack-dev-server 首先会调用 HotModuleReplacementPlugin 插件向应用的主 Chunk 注入一系列 HMR Runtime，包括：

用于建立 WebSocket 连接，处理 hash 等消息的运行时代码；
用于加载热更新资源的 RuntimeGlobals.hmrDownloadManifest 与 RuntimeGlobals.hmrDownloadUpdateHandlers 接口；
用于处理模块更新策略的 module.hot.accept 接口；
……

经过 HotModuleReplacementPlugin 处理后，构建产物中即包含了所有运行 HMR 所需的客户端运行时与接口。这些 HMR 运行时会在浏览器执行一套基于 WebSocket 消息的时序框架，

2. 其次，实现增量构建：除注入客户端代码外，HotModuleReplacementPlugin 插件还会借助 Webpack 的 watch 能力，在代码文件发生变化后执行增量构建，生成：

manifest 文件：JSON 格式文件，包含所有发生变更的模块列表，命名为 [hash].hot-update.json；
模块变更文件：js 格式，包含编译后的模块代码，命名为 [hash].hot-update.js。
增量构建完毕后，Webpack 将触发 compilation.hooks.done 钩子，并传递本次构建的统计信息对象 stats。WDS 则监听 done 钩子，在回调中通过 WebSocket 发送模块更新消息：

3. 再次，加载更新：客户端通过 WebSocket 接收到 hash 消息后，首先发出 manifest 请求获取本轮热更新涉及的 chunk

- 注意：在 Webpack 4 及之前，热更新文件以模块为单位，即所有发生变化的模块都会生成对应的热更新文件； Webpack 5 之后热更新文件以 chunk 为单位，如上例中，main chunk 下任意文件的变化都只会生成 main.[hash].hot-update.js 更新文件。

manifest 请求完成后，客户端 HMR 运行时开始下载发生变化的 chunk 文件，将最新模块代码加载到本地。

4. 最后，执行 module.hot.accept 回调：经过上述步骤，浏览器加载完最新模块代码后，HMR 运行时会继续触发 module.hot.accept 回调，将最新代码替换到运行环境中。

module.hot.accept 是 HMR 运行时暴露给用户代码的重要接口之一，它在 Webpack HMR 体系中开了一个口子，让用户能够自定义模块热替换的逻辑，

```js
module.hot.accept(path?: string, callback?: function);

```

它接受两个参数：

path：指定需要拦截变更行为的模块路径；
callback：模块更新后，将最新模块代码应用到运行环境的函数。

```js
// src/bar.js
export const bar = 'bar';

// src/index.js
import { bar } from './bar';
const node = document.createElement('div');
node.innerText = bar;
document.body.appendChild(node);

module.hot.accept('./bar.js', function () {
  node.innerText = bar;
});
```

回顾整个 HMR 过程，所有的状态流转均由 WebSocket 消息驱动，这部分逻辑由 HMR 运行时控制，开发者几乎无感，唯一需要关注的就是是为每一个需要支持 HMR 特性的文件注册 module.hot.accept 回调。

# accept 函数注意事项

从应用视角看，module.hot.accept 是 Webpack 开放出来，由用户自定义模块更新逻辑的重要函数

## 开发技巧

1. 处理失败兜底逻辑
   module.hot.accept 函数只接受具体路径的 path 参数，也就是说，我们无法通过 glob 或类似风格的方式批量注册热更新回调。

一旦某个模块没有注册对应的 module.hot.accept 函数后，HMR 运行时会执行兜底策略，通常是刷新页面，确保页面上运行的始终是最新的代码，因此有时候你可能明明已经注册了 accept 回调，但热更新无法生效，此时可以检查一下文件路径是否真的命中资源。

2. 更新事件冒泡
   module.hot.accept 函数只能捕获当前模块对应子孙模块的更新事件
   新事件会沿着模块依赖树自底向上逐级传递
   这一特性与 DOM 事件规范中的冒泡过程极为相似，使用时如果摸不准模块的依赖关系，建议直接在应用的入口文件中编写热更新函数。

3. 使用无参数调用风格
   除上述调用方式外，module.hot.accept 函数还支持无参数调用风格，作用是捕获当前文件的变更事件，并从模块第一行开始重新运行该模块的代码

```js
// src/bar.js
console.log('bar');

module.hot.accept();
```

# 总结
Webpack 的 HMR 特性底层有两个重点，一是监听文件变化并通过 WebSocket 发送变更消息；二是需要客户端配合，通过 module.hot.accept 接口定制特定模块的热替换规则