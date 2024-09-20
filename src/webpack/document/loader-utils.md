# 使用 schema-utils

Webpack，以及 Webpack 生态下的诸多 Loader、Plugin 基本上都会提供若干“配置项”，供用户调整组件的运行逻辑，这些组件内部通常都会使用 schema-utils 工具库校验用户传入的配置是否满足要求。

1. 安装依赖：

```js
yarn add -D schema-utils
```

2. 编写配置对象的 Schema 描述

```js
// options.json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "boolean"
    }
  },
  "required": ["name"],
  "additionalProperties": false
}

```

3. 在 Loader 中调用 schema-utils 校验配置对象

```js
import { validate } from "schema-utils";
import schema from "./options.json";

// 调用 schema-utils 完成校验
export default function loader(source) {
  const options = this.getOptions();
  validate(schema, options);

  return source;
}

// Webpack5 之后还可以借助 Loader Context 的 `getOptions` 接口完成校验
export default function loader(source) {
  const options = this.getOptions(schema);

  return source;
}

```

schema-utils 的校验能力很强，能够完美支撑起 Webpack 生态下非常复杂的参数校验需求，但官方文档非常语焉不详，翻阅源码后发现，它底层主要依赖于 ajv ，这是一个应用广泛、功能强大且性能优异的校验工具：

- ajv 在对象校验、JSON 序列化/反序列化方面的性能表现非常突出，许多知名开源框架 如：ESLint、fast-json-stringify、middy、swagger、tailwind 等底层都依赖于 ajv

1. ajv 数据描述格式基础知识：
   schema-utils 内部使用 ajv 的 JSON-Schema 模式实现参数校验，而 JSON-Schema 是一种以 JSON 格式描述数据结构的 公共规范，使用时至少需要提供 type 参数

```js
{
  "type": "number"
}

```

ajv 默认支持七种基本数据类型: number, interger, string, boolean, array, null, object

```js
{
  type: "object",
  properties: {
    foo: {type: "string"},
    bar: {
      type: "number",
      minimum: 2
    }
  }
}

```

patternProperties：同样用于定义对象属性的 Schema，但属性名支持正则表达式形式，例如：

```js
{
  type: "object",
  patternProperties: {
    "^fo.*$": {type: "string"},
    "^ba.*$": {type: "number"}
  }
}

```

additionalProperties：限定对象是否可以提供除 properties、patternProperties 之外的属性；
除此之外，Schema 节点还支持一些通用的规则字段，包括：

enum：枚举数组，属性值必须完全等于(Deep equal)这些值之一，例如：

```js
// JSON-Schema
{
  "type": "string",
  "enum": [
    "fanwenjie",
    "tecvan"
  ]
}

// 有效值：
"fanwenjie"/"tecvan"
// 无效值，如：
"foo bar"

```

const：静态数值，属性值必须完全等于 const 定义，单独看 const 似乎作用不大，但配合 $data 指令的 JSON-Pointer 能力，可以实现关联相等的效果

```js
// JSON-Schema
{
  type: "object",
  properties: {
    foo: {type: "string"},
    bar: {const: {$data: "1/foo"}}
  }
}

// bar 必须等于 foo，如：
{
  "foo": "fanwenjie",
  "bar": "fanwenjie"
}
// 否则无效：
{
  "foo": "fanwenjie",
  "bar": "tecvan"
}

```

2. 使用 ajv 复合条件指令
   除上述介绍的基本类型与基础校验规则外，ajv 还提供了若干复合校验指令：

not：数值必须不符合该条件，例如：{type: "number", not: {minimum: 3}} 时，传入数值必须小于 3；
anyof：数值必须满足 anyof 条件之一，这是一个非常实用的指令，例如在 css-loader 中：

```js
// css-loader/src/options.json
{
  "additionalProperties": false,
  "properties": {
    "url": {
      "description": "Enables/Disables 'url'/'image-set' functions handling (https://github.com/webpack-contrib/css-loader#url).",
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "instanceof": "Function"
        }
      ]
    },
    // more properties
  },
  "type": "object"
}

```

oneof：数值必须满足且只能满足 oneof 条件之一，例如：

```js
{
  type: "number",
  oneOf: [{maximum: 3}, {type: "integer"}]
}
// 下述数值符合要求：
1.1、2.1、4、5 等

// 下述数值不符合要求：
3.5、2、1 等

```

allof：数值必须满足 allof 指定的所有条件，例如

```js
{
  type: "number",
  allOf: [{maximum: 3}, {type: "integer"}]
}
// 下述数值符合要求：
1、2、3 等

// 下述数值不符合要求：
1.1、4、5 等

```

if/then/else：这是一个稍显复杂的三元组复合条件，大致逻辑为：若传入的数值满足 if 条件，则必须同时满足 then 条件；若不满足 if 则必须同时满足 else，其中 else 可选。例如：

```js
{
  type: "object",
  if: {properties: {foo: {minimum: 10}}},
  then: {required: ["bar"]},
  else: {required: ["baz"]}
}

```

# 使用 loader-utils

在 Webpack5 之前，loader-utils 是一个非常重要的 Loader 开发辅助工具，为开发者提供了诸如 getOptions/getCurrentRequest/parseQuery 等核心接口，这些接口被诸多 Loader 广泛使用，到 Webpack5 之后干脆将这部分能力迁移到 Loader Context，致使 loader-utils 被大幅裁减简化。

被裁减后的 loader-utils 仅保留了四个接口：

urlToRequest：用于将模块路径转换为文件路径的工具函数；
isUrlRequest：用于判定字符串是否为模块请求路径；
getHashDigest：用于计算内容 Hash 值；
interpolateName：用于拼接文件名的模板工具；

翻阅大量 Loader 源码后发现，前三个接口使用率极低，实用性不大，因此本文直接跳过，仅侧重介绍 interpolateName 接口。

1. 使用 interpolateName 拼接文件名

Webpack 支持以类似 [path]/[name]-[hash].js 方式设定 output.filename 即输出文件的命名，这一层规则通常不需要关注，但在编写类似 webpack-contrib/file-loader 这种自行输出产物文件的 Loader 时，需要由开发者自行处理产物路径逻辑。

此时可以使用 loader-utils 提供的 interpolateName 方法在 Loader 中以类似 Webpack 的 output.filename 规则拼接资源路径及名称

```js
// file-loader/src/index.js
import { interpolateName } from 'loader-utils';

export default function loader(content) {
  const context = options.context || this.rootContext;
  const name = options.name || '[contenthash].[ext]';

  // 拼接最终输出的名称
  const url = interpolateName(this, name, {
    context,
    content,
    regExp: options.regExp,
  });

  let outputPath = url;
  // ...

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;
  // ...

  if (typeof options.emitFile === 'undefined' || options.emitFile) {
    // ...

    // 提交、写出文件
    this.emitFile(outputPath, content, null, assetInfo);
  }
  // ...

  const esModule = typeof options.esModule !== 'undefined' ? options.esModule : true;

  // 返回模块化内容
  return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`;
}

export const raw = true;
```

根据 Loader 配置，调用 interpolateName 方法拼接目标文件的完整路径；
调用上下文 this.emitFile 接口，写出文件；
返回 module.exports = ${publicPath} ，其它模块可以引用到该文件路径。

interpolateName 功能稍弱于 Webpack 的 Template String 规则，仅支持如下占位符：

[ext]：原始资源文件的扩展名，如 .js；
[name]：原始文件名；
[path]：原始文件相对 context 参数的路径；
[hash]：原始文件的内容 Hash 值，与 output.file 类似同样支持 [hash:length] 指定 Hash 字符串的长度；
[contenthash]：作用、用法都与上述 [hash] 一模一样。

# 总结

Loader 主要负责将资源内容转译为 Webpack 能够理解、处理的标准 JavaScript 形式，所以通常需要做 Loader 内通过 return/this.callback 方式返回翻译结果；
Loader Context 提供了许多实用接口，我们可以借助这些接口读取上下文信息，或改变 Webpack 运行状态(相当于产生 Side Effect，例如通过 emitFile 接口)；
假若我们开发的 Loader 需要对外提供配置选项，建议使用 schema-utils 校验配置参数是否合法；
假若 Loader 需要生成额外的资源文件，建议使用 loader-utils 拼接产物路径；
执行时，Webpack 会按照 use 定义的顺序从前到后执行 Pitch Loader，从后到前执行 Normal Loader，我们可以将一些预处理逻辑放在 Pitch 中(如 vue-loader)；
等等。
