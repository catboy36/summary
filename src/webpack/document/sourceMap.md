# Sourcemap 映射结构

在 processAssets 钩子遍历产物文件 assets 数组，调用 webpack-sources 提供的 map 方法，最终计算出 asset 与源码 originSource 之间的映射关系。

Sourcemap 最初版本生成的 .map 文件非常大，体积大概为编译产物的 10 倍；V2 之后引入 Base64 编码等算法，将之减少 20% ~ 30%；而最新版本 V3 又在 V2 基础上引入 VLQ 算法，体积进一步压缩了 50%。

一系列进化造就了一个效率极高的 Sourcemap 体系，但伴随而来的则是较为复杂的 mappings 编码规则。V3 版本 Sourcemap 文件由三部分组成:

开发者编写的原始代码；
经过 Webpack 压缩、转化、合并后的产物，且产物中必须包含指向 Sourcemap 文件地址的 //# sourceMappingURL=https://xxxx/bundle.js.map 指令；
记录原始代码与经过工程化处理代码之间位置映射关系 Map 文件。

页面初始运行时只会加载编译构建产物，直到特定事件发生 —— 例如在 Chrome 打开 Devtool 面板时，才会根据 //# sourceMappingURL 内容自动加载 Map 文件，并按 Sourcemap 协议约定的映射规则将代码重构还原回原始形态，这既能保证终端用户的性能体验，又能帮助开发者快速还原现场，提升线上问题的定位与调试效率。

在 Webpack 中设置 devtool = 'source-map' 即可同时打包出代码产物 xxx.js 文件与同名 xxx.js.map 文件，Map 文件通常为 JSON 格

```json
{
  "version": 3,
  "sources": ["webpack:///./src/index.js"],
  "names": ["name", "console", "log"],
  "mappings": ";;;;;AAAA,IAAMA,IAAI,GAAG,QAAb;AAEAC,OAAO,CAACC,GAAR,CAAYF,IAAZ,E",
  "file": "main.js",
  "sourcesContent": ["const name = 'tecvan';\n\nconsole.log(name)"],
  "sourceRoot": ""
}
```

version： 指代 Sourcemap 版本，目前最新版本为 3；
names：字符串数组，记录原始代码中出现的变量名；
file：字符串，该 Sourcemap 文件对应的编译产物文件名；
sourcesContent：字符串数组，原始代码的内容；
sourceRoot：字符串，源文件根目录；
sources：字符串数组，原始文件路径名，与 sourcesContent 内容一一对应；
mappings：字符串数组，记录打包产物与原始代码的位置映射关系。

使用时，浏览器会按照 mappings 记录的数值关系，将产物代码映射回 sourcesContent 数组所记录的原始代码文件、行、列位置，这里面最复杂难懂的点就在于 mappings 字段的规则。

Webpack 生成的 mappings 字段

```js
AAAA, IAAMA, IAAI, GAAG, QAAb;
AAEAC, OAAO, CAACC, GAAR, CAAYF, IAAZ, E;
```

1. 以 ; 分割的行映射，每一个 ; 对应编译产物每一行到源码的映射，上例经过分割后

```js
[
  // 产物第 1-5 行内容为 Webpack 生成的 runtime，不需要记录映射关系
  '',
  '',
  '',
  '',
  '',
  // 产物第 6 行的映射信息
  'AAAA,IAAMA,IAAI,GAAG,QAAb',
  // 产物第 7 行的映射信息
  'AAEAC,OAAO,CAACC,GAAR,CAAYF,IAAZ,E',
];
```

2. 以 , 分割的片段映射，每一个 , 对应该行中每一个代码片段到源码的映射，上例经过分割后：

```js
[
  // 产物第 1-5 行内容为 Webpack 生成的 runtime，不需要记录映射关系
  '',
  '',
  '',
  '',
  '',
  // 产物第 6 行的映射信息
  [
    // 片段 `var` 到 `const` 的映射
    'AAAA',
    // 片段 `name` 到 `name` 的映射
    'IAAMA',
    // 等等
    'IAAI',
    'GAAG',
    'QAAb',
  ],
  // 产物第 7 行的映射信息
  ['AAEAC', 'OAAO', 'CAACC', 'GAAR', 'CAAYF', 'IAAZ', 'E'],
];
```

3. 第三层逻辑为片段映射到源码的具体位置，以上例 IAAMA 为例：
   第一位 I 代表该代码片段在产物中列数；
   第二位 A 代表源码文件的索引，即该片段对标到 sources 数组的元素下标；
   第三位 A 代表片段在源码文件的行数；
   第四位 M 代表片段在源码文件的列数；
   第五位 A 代表该片段对应的名称索引，即该片段对标到 names 数组的元素下标。

第三层逻辑中的片段位置映射则用到了一种比较高效数值编码算法 —— VLQ(Variable-length Quantity)。

# devtool 规则详解

Webpack 提供了两种设置 Sourcemap 的方式，一是通过 devtool 配置项设置 Sourcemap 规则短语；二是直接使用 SourceMapDevToolPlugin 或 EvalSourceMapDevToolPlugin 插件深度定制 Sourcemap 的生成逻辑。

devtool 支持 25 种字符串枚举值，包括 eval、source-map、eval-source-map 等：

这些枚举值内在有一个潜规则：都是由 inline、eval、source-map、nosources、hidden、cheap、module 七种关键字组合而成，这些关键词各自代表一项 Sourcemap 规则，拆开来看：

1. eval 关键字：当 devtool 值包含 eval 时，生成的模块代码会被包裹进一段 eval 函数中，且模块的 Sourcemap 信息通过 //# sourceURL 直接挂载在模块代码内
   eval 模式编译速度通常比较快，但产物中直接包含了 Sourcemap 信息，因此只推荐在开发环境中使用。
2. source-map 关键字：当 devtool 包含 source-map 时，Webpack 才会生成 Sourcemap 内容。例如，对于 devtool = 'source-map'，产物会额外生成 .map 文件

```js
{
    "version": 3,
    "sources": [
        "webpack:///./src/index.ts"
    ],
    "names": [
        "console",
        "log"
    ],
    "mappings": "AACAA,QAAQC,IADI",
    "file": "bundle.js",
    "sourcesContent": [
        "const foo = 'bar';\nconsole.log(foo);"
    ],
    "sourceRoot": ""
}

```

3. cheap 关键字：当 devtool 包含 cheap 时，生成的 Sourcemap 内容会抛弃列维度的信息，这就意味着浏览器只能映射到代码行维度。例如 devtool = 'cheap-source-map' 时，产物：

```json
{
  "version": 3,
  "file": "bundle.js",
  "sources": ["webpack:///bundle.js"],
  "sourcesContent": ["console.log(\"bar\");"],
  // 带 cheap 效果：
  "mappings": "AAAA",
  // 不带 cheap 效果：
  // "mappings": "AACAA,QAAQC,IADI",
  "sourceRoot": ""
}
```

虽然 Sourcemap 提供的映射功能可精确定位到文件、行、列粒度，但有时在行级别已经足够帮助我们达到调试定位的目的，此时可选择使用 cheap 关键字，简化 Sourcemap 内容，减少 Sourcemap 文件体积。

4. module 关键字：module 关键字只在 cheap 场景下生效，例如 cheap-module-source-map、eval-cheap-module-source-map。当 devtool 包含 cheap 时，Webpack 根据 module 关键字判断按 loader 联调处理结果作为 source，还是按处理之前的代码作为 source

注意观察上例 sourcesContent 字段，左边 devtool 带 module 关键字，因此此处映射的，是包含 class Person 的最原始代码；而右边生成的 sourcesContent ，则是经过 babel-loader 编译处理的内容。

5. nosources 关键字：当 devtool 包含 nosources 时，生成的 Sourcemap 内容中不包含源码内容 —— 即 sourcesContent 字段。

```js
{
    "version": 3,
    "sources": [
        "webpack:///./src/index.ts"
    ],
    "names": [
        "console",
        "log"
    ],
    "mappings": "AACAA,QAAQC,IADI",
    "file": "bundle.js",
    "sourceRoot": ""
}

```

虽然没有带上源码，但 .map 产物中还带有文件名、 mappings 字段、变量名等信息，依然能够帮助开发者定位到代码对应的原始位置，配合 sentry 等工具提供的源码映射功能，可在异地还原诸如错误堆栈之类的信息。

6. inline 关键字：当 devtool 包含 inline 时，Webpack 会将 Sourcemap 内容编码为 Base64 DataURL，直接追加到产物文件中。例如对于 devtool = 'inline-source-map'
   inline 模式编译速度较慢，且产物体积非常大，只适合开发环境使用。

7. hidden 关键字：通常，产物中必须携带 //# sourceMappingURL= 指令，浏览器才能正确找到 Sourcemap 文件，当 devtool 包含 hidden 时，编译产物中不包含 //# sourceMappingURL= 指令

两者区别仅在于编译产物最后一行的 //# sourceMappingURL= 指令，当你需要 Sourcemap 功能，又不希望浏览器 Devtool 工具自动加载时，可使用此选项。需要打开 Sourcemap 时，可在浏览器中手动加载：

然提供了 27 种候选项，但逻辑上都是由上述规则叠加而成，例如：

cheap-source-map：代表 不带列映射 的 Sourcemap ；
eval-nosources-cheap-source-map：代表 以 eval 包裹模块代码 ，且 .map 映射文件中不带源码，且 不带列映射 的 Sourcemap。

## 最佳实践

1. 对于开发环境，适合使用：
   eval：速度极快，但只能看到原始文件结构，看不到打包前的代码内容；
   cheap-eval-source-map：速度比较快，可以看到打包前的代码内容，但看不到 loader 处理之前的源码；
   cheap-module-eval-source-map：速度比较快，可以看到 loader 处理之前的源码，不过定位不到列级别；
   eval-source-map：初次编译较慢，但定位精度最高；
2. 对于生产环境，则适合使用：
   source-map：信息最完整，但安全性最低，外部用户可轻易获取到压缩、混淆之前的源码，慎重使用；
   hidden-source-map：信息较完整，安全性较低，外部用户获取到 .map 文件地址时依然可以拿到源码；
   nosources-source-map：源码信息缺失，但安全性较高，需要配合 Sentry 等工具实现完整的 Sourcemap 映射。

# 使用 source-map 插件

上面介绍的 devtool 配置项，本质上只是一种方便记忆、使用的规则缩写短语，Sourcemap 的底层处理逻辑实际由 SourceMapDevToolPlugin 与 EvalSourceMapDevToolPlugin 插件实现。

在 devtool 基础上，插件还提供了更多、更细粒度的配置项，用于满足更复杂的需求场景，包括：

使用 test、include、exclude 配置项过滤需要生成 Sourcemap 的 Bundle；
使用 append、filename、moduleFilenameTemplate、publicPath 配置项设定 Sourcemap 文件的文件名、URL

```js
const webpack = require('webpack');
module.exports = {
  // ...
  devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      exclude: ['vendor.js'],
    }),
  ],
};
```

# 总结

综上，Sourcemap 是一种高效的位置映射算法，它将产物到源码之间的位置关系表达为 mappings 分层设计与 VLQ 编码，再通过 Chrome、Safari、VS Code、Sentry 等工具异地还原为接近开发状态的源码形式。

在 Webpack 中，通常只需要选择适当的 devtool 短语即可满足大多数场景需求，特殊情况下也可以直接使用 SourceMapDevToolPlugin 做更深度的定制化。

# 为什么 Sourcemap 要设计分层结构 + VLQ 编码做行列映射？假设直接记录行列号，会有什么问题？

## 问题一：为什么 Sourcemap 要设计分层结构 + VLQ 编码做行列映射？

1. 减少文件大小
   直接记录每个位置的行号和列号将非常冗长，尤其是对于大型项目来说。VLQ 编码通过相对差值和基于文本的编码方式大大减小了这种映射信息的体积。由于源代码的相邻行和列通常会有大量连续的映射，通过记录差值而不是绝对值，能够使得这些映射在编码后显著缩小。

2. 提高解析效率
   使用分层结构（通常以每行为单位分层）和 VLQ 编码，可以快速定位到源代码中的具体位置。当开发者在调试器中查看转换后的代码时，只需对相关行的映射进行解码，而不是整个文件的映射，这样可以更快地解析映射并提高调试效率。

3. 动态加载
   对于大型的 web 应用，将所有的映射信息一次性加载到内存中可能会消耗大量资源。通过分层和压缩的映射数据，可以实现按需加载映射信息，即只有当需要映射特定文件或代码段时才加载对应的映射信息，从而节省资源。

## 问题二：假设直接记录行列号，会有什么问题？
   如果直接记录行列号会怎样？
   文件体积增大：映射文件的大小会显著增加，因为它需要为源代码和转换后代码中的每一个符号或表达式记录完整的行和列信息。对于大型项目，这可能导致映射文件的体积成倍增加，增加网络传输成本和解析成本。
   效率降低：处理和解析这种冗长的映射信息将消耗更多的计算资源和时间，尤其是在初次加载和解析 sourcemap 时，可能导致调试过程中的延迟。
   资源消耗：大型映射文件不仅增加了网络传输的负担，还会在客户端占用更多的内存和处理器资源，对于移动设备和性能较低的设备尤其不利。
   总的来说，Sourcemap 的分层结构和 VLQ 编码是为了在提供精确和详细的映射信息的同时，也优化了性能和资源使用，使得它们适合用于大型和复杂的 web 应用开发和调试过程。
