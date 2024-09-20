# 如何扩展 webpack

一是 Loader —— 主要负责将资源内容翻译成 Webpack 能够理解、处理的 JavaScript 代码；二是 Plugin —— 深度介入 Webpack 构建过程，重塑 构建逻辑。

# 为什么需要 loader

Loader 正是为了将文件资源的“读”与“处理”逻辑解耦，Webpack 内部只需实现对标准 JavaScript 代码解析/处理能力，由第三方开发者以 Loader 方式补充对特定资源的解析逻辑。

- 提示：Webpack5 之后增加了 Parser 对象，事实上已经内置支持图片、JSON 等格式的内容，不过这并不影响我们对 Loader 这一概念的理解。

Loader 通常是一种 mapping 函数形式，接收原始代码内容，返回翻译结果

```js
module.exports = function (source) {
  // 执行各种代码计算
  return modifySource;
};
```

在 Webpack 进入构建阶段后，首先会通过 IO 接口读取文件内容，之后调用 LoaderRunner 并将文件内容以 source 参数形式传递到 Loader 数组，source 数据在 Loader 数组内可能会经过若干次形态转换，最终以标准 JavaScript 代码提交给 Webpack 主流程，以此实现内容翻译功能。

Loader 函数签名如下：

```js
module.exports = function (source, sourceMap?, data?) {
  return source;
};
```

Loader 接收三个参数，分别为：

source：资源输入，对于第一个执行的 Loader 为资源文件的内容；后续执行的 Loader 则为前一个 Loader 的执行结果，可能是字符串，也可能是代码的 AST 结构；
sourceMap: 可选参数，代码的 sourcemap 结构；
data: 可选参数，其它需要在 Loader 链中传递的信息，比如 posthtml/posthtml-loader 就会通过这个参数传递额外的 AST 对象。

其中 source 是最重要的参数，大多数 Loader 要做的事情就是将 source 转译为另一种形式的 output

需要注意，Loader 中执行的各种资源内容转译操作通常都是 CPU 密集型 —— 这放在 JavaScript 单线程架构下可能导致性能问题；又或者异步 Loader 会挂起后续的加载器队列直到异步 Loader 触发回调，稍微不注意就可能导致整个加载器链条的执行时间过长

为此，Webpack 默认会缓存 Loader 的执行结果直到资源或资源依赖发生变化，开发者需要对此有个基本的理解，必要时可以通过 this.cachable 显式声明不作缓存：

```js
module.exports = function (source) {
  this.cacheable(false);
  // ...
  return output;
};
```

# 使用上下文接口

除了作为内容转换器外，Loader 运行过程还可以通过一些上下文接口，有限制地影响 Webpack 编译过程，从而产生内容转换之外的副作用。上下文接口将在运行 Loader 时以 this 方式注入到 Loader 函数：

Webpack 官网对 Loader Context 已经有比较详细的说明，这里简单介绍几个比较常用的接口：

fs：Compilation 对象的 inputFileSystem 属性，我们可以通过这个对象获取更多资源文件的内容；
resource：当前文件路径；
resourceQuery：文件请求参数，例如 import "./a?foo=bar" 的 resourceQuery 值为 ?foo=bar；
callback：可用于返回多个结果；
getOptions：用于获取当前 Loader 的配置对象；
async：用于声明这是一个异步 Loader，开发者需要通过 async 接口返回的 callback 函数传递处理结果；
emitWarning：添加警告；
emitError：添加错误信息，注意这不会中断 Webpack 运行；
emitFile：用于直接写出一个产物文件，例如 file-loader 依赖该接口写出 Chunk 之外的产物；
addDependency：将 dep 文件添加为编译依赖，当 dep 文件内容发生变化时，会触发当前文件的重新构建；

# 取消 loader 缓存

- Loader 中执行的各种资源内容转译操作通常都是 CPU 密集型 —— 这放在 JavaScript 单线程架构下可能导致性能问题；又或者异步 Loader 会挂起后续的加载器队列直到异步 Loader 触发回调，稍微不注意就可能导致整个加载器链条的执行时间过长。
  为此，Webpack 默认会缓存 Loader 的执行结果直到资源或资源依赖发生变化，开发者需要对此有个基本的理解，必要时可以通过 this.cachable 显式声明不作缓存：

```js
module.exports = function (source) {
  this.cacheable(false);
  // ...
  return output;
};
```

# 在 Loader 中返回多个结果

简单的 Loader 可直接 return 语句返回处理结果，复杂场景还可以通过 callback 接口返回更多信息，供下游 Loader 或者 Webpack 本身使用，例如在 webpack-contrib/eslint-loader 中：

```js
export default function loader(content, map) {
  // ...
  linter.printOutput(linter.lint(content));
  this.callback(null, content, map);
}

this.callback(
    // 异常信息，Loader 正常运行时传递 null 值即可
    err: Error | null,
    // 转译结果
    content: string | Buffer,
    // 源码的 sourcemap 信息
    sourceMap?: SourceMap,
    // 任意需要在 Loader 间传递的值
    // 经常用来传递 ast 对象，避免重复解析
    data?: any
);

```

# 在 Loader 返回异步结果

涉及到异步或 CPU 密集操作时，Loader 中还可以以异步形式返回处理结果, 例如 webpack-contrib/less-loader 的核心逻辑：

```js
import less from 'less';

async function lessLoader(source) {
  // 1. 获取异步回调函数
  const callback = this.async();
  // ...

  let result;

  try {
    // 2. 调用less 将模块内容转译为 css
    result = await (options.implementation || less).render(data, lessOptions);
  } catch (error) {
    // ...
  }

  const { css, imports } = result;

  // ...

  // 3. 转译结束，返回结果
  callback(null, css, map);
}

export default lessLoader;
```

在 less-loader 中，包含三个重要逻辑：

调用 this.async 获取异步回调函数，此时 Webpack 会将该 Loader 标记为异步加载器，会挂起当前执行队列直到 callback 被触发；
调用 less 库将 less 资源转译为标准 css；
调用异步回调 callback 返回处理结果。
this.async 返回的异步回调函数签名与上一节介绍的 this.callback 相同，此处不再赘述。

# 在 Loader 中直接写出文件

Loader Context 的 emitFile 接口可用于直接写出新的产物文件，例如在 file-loader 中：

```js
export default function loader(content) {
  const options = getOptions(this);

  validate(schema, options, {
    name: 'File Loader',
    baseDataPath: 'options',
  });
  // ...

  if (typeof options.emitFile === 'undefined' || options.emitFile) {
    // ...
    this.emitFile(outputPath, content, null, assetInfo);
  }

  const esModule = typeof options.esModule !== 'undefined' ? options.esModule : true;

  return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`;
}

export const raw = true;
```

借助 emitFile 接口，我们能够在 Webpack 构建主流程之外提交更多产物，这有时候是必要的，除上面提到的 file-loader 外，response-loader 、mermaid-loader 等也依赖于 emitFile 实现构建功能。

# 在 Loader 中添加额外依赖

Loader Context 的 addDependency 接口用于添加额外的文件依赖，当这些依赖发生变化时，也会触发重新构建，例如在 less-loader 中包含这样一段代码：

```js
try {
  result = await (options.implementation || less).render(data, lessOptions);
} catch (error) {
  // ...
}

const { css, imports } = result;

imports.forEach(item => {
  // ...
  this.addDependency(path.normalize(item));
});
```

代码中首先调用 less 库编译文件内容，之后遍历所有 @import 语句(result.imports 数组)，调用 this.addDependency 函数将 import 到的文件都注册为依赖，此后这些资源文件发生变化时都会触发重新编译

所以，addDependency 接口适用于那些 Webpack 无法理解隐式文件依赖的场景。除上例 less-loader，babel-loader 也是一个特别经典的案例。在 babel-loader 内部会添加对 Babel 配置文件如 .babelrc 的依赖，当 .babelrc 内容发生变化时，也会触发 babel-loader 重新运行。

Loader Context 还提供了下面几个与依赖处理相关的接口：

addContextDependency(directory: String)：添加文件目录依赖，目录下内容变更时会触发文件变更；
addMissingDependency(file: String)：用于添加文件依赖，效果与 addDependency 类似；
clearDependencies()：清除所有文件依赖

# 处理二进制资源

有时候我们期望以二进制方式读入资源文件，例如在 file-loader、image-loader 等场景中，此时只需要添加 export const raw = true 语句即可

```js
export default function loader(source) {
  /* ... */
}

export const raw = true;
```

# 在 Loader 中正确处理日志

Webpack 内置了一套 infrastructureLogging 接口，专门用于处理 Webpack 内部及各种第三方组件的日志需求，与 log4js、winston 等日志工具类似，infrastructureLogging 也提供了根据日志分级筛选展示功能，从而将日志的写逻辑与输出逻辑解耦。

- 提示：作为对比，假如我们使用 console.log 等硬编码方式输出日志信息，用户无法过滤这部分输出，可能会造成较大打扰，体感很不好。

在编写 Loader 时也应该尽可能复用 Webpack 内置的这套 Logging 规则，方法很简单，只需使用 Loader Context 的 getLogger 接口

```js
export default function loader(source) {
  const logger = this.getLogger('xxx-loader');
  // 使用适当的 logging 接口
  // 支持：verbose/log/info/warn/error
  logger.info('information');

  return source;
}
```

getLogger 返回的 logger 对象支持 verbose/log/info/warn/error 五种级别的日志，最终用户可以通过 infrastructureLogging.level 配置项筛选不同日志内容

```js
module.exports = {
  // ...
  infrastructureLogging: {
    level: 'warn',
  },
  // ...
};
```

# 在 Loader 中正确上报异常

Webpack Loader 中有多种上报异常信息的方式：

1. 使用 logger.error，仅输出错误日志，不会打断编译流程
2. 使用 this.emitError 接口，同样不会打断编译流程
3. 与 logger.error 相比，emitError 不受 infragstrustureLogging 规则控制，必然会强干扰到最终用户；其次，emitError 会抛出异常的 Loader 文件、代码行、对应模块，更容易帮助定位问题。
4. 使用 this.callback 接口提交错误信息，但注意导致当前模块编译失败，效果与直接使用 throw 相同,之后，Webpack 会将 callback 传递过来的错误信息当做模块内容，打包进产物文件：

```js
export default function loader(source) {
  this.callback(new Error('发生了一些异常'));

  return source;
}
```

总的来说，这些方式各自有适用场景，我个人会按如下规则择优选用：

一般应尽量使用 logger.error，减少对用户的打扰；
对于需要明确警示用户的错误，优先使用 this.emitError；
对于已经严重到不能继续往下编译的错误，使用 callback 。

# 为 Loader 编写单元测试

常规的 Webpack Loader 单元测试流程大致如下：

创建在 Webpack 实例，并运行 Loader；
获取 Loader 执行结果，比对、分析判断是否符合预期；
判断执行过程中是否出错。

## 如何运行 Loader？

有两种办法，

1. 在 node 环境下运行调用 Webpack 接口，用代码而非命令行执行编译，很多框架都会采用这种方式，例如 vue-loader、stylus-loader、babel-loader 等，优点是运行效果最接近最终用户，缺点是运行效率相对较低（可以忽略）

以 posthtml/posthtml-loader 为例，它会在启动测试之前创建并运行 Webpack 实例

```js
// posthtml-loader/test/helpers/compiler.js 文件
module.exports = function (fixture, config, options) {
  config = {
    /*...*/
  };

  options = Object.assign({ output: false }, options);

  // 创建 Webpack 实例
  const compiler = webpack(config);

  // 以 MemoryFS 方式输出构建结果，避免写磁盘
  if (!options.output) compiler.outputFileSystem = new MemoryFS();

  // 执行，并以 promise 方式返回结果
  return new Promise((resolve, reject) =>
    compiler.run((err, stats) => {
      if (err) reject(err);
      // 异步返回执行结果
      resolve(stats);
    })
  );
};
```

- 上面的示例中用到 compiler.outputFileSystem = new MemoryFS() 语句将 Webpack 设定成输出到内存，能避免写盘操作，提升编译速度。

2. 另外一种方法是编写一系列 mock 方法，搭建起一个模拟的 Webpack 运行环境，例如 emaphp/underscore-template-loader ，优点是运行速度更快，缺点是开发工作量大通用性低，了解即可

## 如何校验 Loader 执行结果？

上例运行结束之后会以 resolve(stats) 方式返回执行结果，stats 对象中几乎包含了编译过程所有信息，包括：耗时、产物、模块、chunks、errors、warnings 等等，我们可以从 stats 对象中读取编译最终输出的产物，例如 style-loader：

```js
// style-loader/src/test/helpers/readAsset.js 文件
function readAsset(compiler, stats, assets) => {
  const usedFs = compiler.outputFileSystem
  const outputPath = stats.compilation.outputOptions.path
  const queryStringIdx = targetFile.indexOf('?')

  if (queryStringIdx >= 0) {
    // 解析出输出文件路径
    asset = asset.substr(0, queryStringIdx)
  }

  // 读文件内容
  return usedFs.readFileSync(path.join(outputPath, targetFile)).toString()
}

```

这段代码首先计算 asset 输出的文件路径，之后调用 outputFileSystem 的 readFile 方法读取文件内容。

接下来，有两种分析内容的方法：

调用 Jest 的 expect(xxx).toMatchSnapshot() 断言，判断当前运行结果是否与之前的运行结果一致，从而确保多次修改的结果一致性，很多框架都大量用了这种方法；
解读资源内容，判断是否符合预期，例如 less-loader 的单元测试中会对同一份代码跑两次 less 编译，一次由 Webpack 执行，一次直接调用 less 库，之后分析两次运行结果是否相同。

## 如何判断执行过程是否触发异常？

最后，还需要判断编译过程是否出现异常，同样可以从 stats 对象解析：

```js
export default getErrors = stats => {
  const errors = stats.compilation.errors.sort();
  return errors.map(e => e.toString());
};
```

大多数情况下都希望编译没有错误，此时只要判断结果数组是否为空即可。某些情况下可能需要判断是否抛出特定异常，此时可以 expect(xxx).toMatchSnapshot() 断言，用快照对比更新前后的结果。

# 链式调用模型详解

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
```

例针对 .less 后缀的文件设定了 less、css、style 三个 Loader，Webpack 启动后会以一种所谓“链式调用”的方式按 use 数组顺序从后到前调用 Loader：

首先调用 less-loader 将 Less 代码转译为 CSS 代码；
将 less-loader 结果传入 css-loader，进一步将 CSS 内容包装成类似 module.exports = "${css}" 的 JavaScript 代码片段；
将 css-loader 结果传入 style-loader，在运行时调用 injectStyle 等函数，将内容注入到页面的 <style> 标签。

三个 Loader 分别完成内容转化工作的一部分，形成从右到左的执行链条。链式调用这种设计有两个好处，一是保持单个 Loader 的单一职责，一定程度上降低代码的复杂度；二是细粒度的功能能够被组装成复杂而灵活的处理链条，提升单个 Loader 的可复用性。

不过，这只是链式调用的一部分，这里面有两个问题：

Loader 链条一旦启动之后，需要所有 Loader 都执行完毕才会结束，没有中断的机会 —— 除非显式抛出异常；
某些场景下并不需要关心资源的具体内容，但 Loader 需要在 source 内容被读取出来之后才会执行。

- 为了解决这两个问题，Webpack 在 Loader 基础上叠加了 pitch 的概念。

## 什么是 pitch？

Webpack 允许在 Loader 函数上挂载名为 pitch 的函数，运行时 pitch 会比 Loader 本身更早执行

```js
const loader = function (source) {
  console.log('后执行');
  return source;
};

loader.pitch = function (requestString) {
  console.log('先执行');
};

module.exports = loader;
```

remainingRequest : 当前 loader 之后的资源请求字符串；
previousRequest : 在执行当前 loader 之前经历过的 loader 列表；
data : 与 Loader 函数的 data 相同，用于传递需要在 Loader 传播的信息。

```js
function pitch(remainingRequest: string, previousRequest: string, data = {}): void {}
```

## pitch 函数调度逻辑

Loader 链条执行过程分三个阶段：pitch、解析资源、执行，设计上与 DOM 的事件模型非常相似，pitch 对应到捕获阶段；执行对应到冒泡阶段；而两个阶段之间 Webpack 会执行资源内容的读取、解析操作，对应 DOM 事件模型的 AT_TARGET 阶段

pitch 阶段按配置顺序从左到右逐个执行 loader.pitch 函数(如果有的话)，开发者可以在 pitch 返回任意值中断后续的链路的执行:

### 那么为什么要设计 pitch 这一特性呢？

在分析了 style-loader、vue-loader、to-string-loader 等开源项目之后，我个人总结出两个字：阻断！

回顾一下前面提到过的 less 加载链条：

less-loader ：将 less 规格的内容转换为标准 css；
css-loader ：将 css 内容包裹为 JavaScript 模块；
style-loader ：将 JavaScript 模块的导出结果以 link 、style 标签等方式挂载到 html 中，让 css 代码能够正确运行在浏览器上。
实际上， style-loader 只是负责让 CSS 在浏览器环境下跑起来，并不需要关心具体内容，很适合用 pitch 来处理，核心代码：

```js
// ...
// Loader 本身不作任何处理
const loaderApi = () => {};

// pitch 中根据参数拼接模块代码
loaderApi.pitch = function loader(remainingRequest) {
  //...

  switch (injectType) {
    case 'linkTag': {
      return `${
        esModule
          ? `...`
          : // 引入 runtime 模块
            `var api = require(${loaderUtils.stringifyRequest(
              this,
              `!${path.join(__dirname, 'runtime/injectStylesIntoLinkTag.js')}`
            )});
            // 引入 css 模块
            var content = require(${loaderUtils.stringifyRequest(this, `!!${remainingRequest}`)});

            content = content.__esModule ? content.default : content;`
      } // ...`;
    }

    case 'lazyStyleTag':
    case 'lazySingletonStyleTag': {
      //...
    }

    case 'styleTag':
    case 'singletonStyleTag':
    default: {
      // ...
    }
  }
};

export default loaderApi;
```

关键点：

loaderApi 为空函数，不做任何处理；
loaderApi.pitch 中拼接结果，导出的代码包含：
引入运行时模块 runtime/injectStylesIntoLinkTag.js；
复用 remainingRequest 参数，重新引入 css 文件。

运行后，关键结果大致如：

```js
var api = require('xxx/style-loader/lib/runtime/injectStylesIntoLinkTag.js');
var content = require('!!css-loader!less-loader!./xxx.less');
```

之后，Webpack 继续解析、构建 style-loader 返回的结果，遇到 inline loader 语句：

```js
var content = require('!!css-loader!less-loader!./xxx.less');
```

所以从 Webpack 的角度看，对同一个文件实际调用了两次 loader 链，第一次在 style-loader 的 pitch 中断，第二次根据 inline loader 的内容跳过了 style-loader。

style 的 pitch 实际上是给了 webpack 一个返回值，这个返回值里包含语句“require('!!css-loader!less-loader!./xxx.less')”。这个语句说明，需要将此 less 文件只通过 less 和 css 两个 loader 来处理（所以使用了!!前缀）。所以不是第二次调用 loader 链，而是这个 inline 语句的内容让它执行了一次 loader 调用

# 总结

Loader 主要负责将资源内容转换为 Webpack 能够理解的 JavaScript 代码形式，开发时我们可以借助 Loader Context 提供的丰富接口实现各种各样的诉求。此外，也需要结合 Loader 的链式调用模型，尽可能设计出复用性更强，更简洁的资源加载器。
