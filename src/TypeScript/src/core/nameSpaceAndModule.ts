// 模块
export const a = 1;
export type Person = {
  name: String;
};

// 命名空间
// 解决重名问题
// 定义标识符的可见范围，一个标识符可在多个命名空间中定义，在不同命名空间中的
// 含义是互不相干的

// 命名空间本质是一个对象，作用是将一些列相关全局变量组织到一个对象的属性
namespace SomeNameSpaceName {
  export interface ISomeInterfaceName {}
  export class SomeClassName {}
}
namespace SomeNameSpaceName1 {
  export interface ISomeInterfaceName {}
  export class SomeClassName {}
}

SomeNameSpaceName.SomeClassName;
SomeNameSpaceName1.SomeClassName;

namespace Letter {
  export let a = 1;
  export let b = 2;
  export let c = 3;
  // ...
  export let z = 26;
}

console.log(Letter.z);

// 编译结果如下
// var Letter;
// (function (Letter) {
//   Letter.a = 1;
//   Letter.b = 2;
//   Letter.c = 3;
//   // ...
//   Letter.z = 26;
// })(Letter || (Letter = {}));

// 正常的ts项目开发过程中不建议使用命名空间，通常在d.ts文件标记js库类型的时候
// 使用命名空间，作用是给编译器编写代码时候参考用
