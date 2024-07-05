// 单例模式
// 创建型模式，提供了一种创建对象的最佳方式，这种模式涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建
// 应用程序运行期间，单例模式只会在全局作用域下创建一次实例对象，让所有需要调用的地方都共享这一单例对象

// 全局变量一般不被认为是单例模式：
// 1. 全局命名污染 2. 不易维护，容易被重写覆盖

// 实现
// 可以用一个变量来标志当前的类已经创建过对象，如果下次获取当前类的实例时，直接返回之前创建的对象即可
//
function Singleton(name) {
  this.name = name;
  this.instance = null;
}
// getName()
Singleton.prototype.getName = function () {
  console.log(this.name);
};
//
Singleton.getInstance = function (name) {
  if (!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance;
};
// 1
const a = Singleton.getInstance('a');
// 2
const b = Singleton.getInstance('b');
//
console.log(a === b);

// 闭包形式
// function CreateSingleton(name) {
//   this.name = name;
//   this.getName();
// }
// //
// CreateSingleton.prototype.getName = function () {
//   console.log(this.name);
// };
// //
// const Singleton = (function () {
//   var instance;
//   return function (name) {
//     if (!instance) {
//       instance = new CreateSingleton(name);
//     }
//     return instance;
//   };
// })();
// // 1
// const a = new Singleton('a');
// // 2
// const b = new Singleton('b');
// console.log(a === b); // true


// vuex，redux全局状态管理库也用单例模式思想
// jquery,lodash,moment