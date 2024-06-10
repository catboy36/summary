// 全局作用域(定义在全局，var声明的是 window的属性，let和 const不是)
var a = 3;

// 函数作用域
var func = function () {
  var a = 4;
  console.log('a2>>>', a);
};

// 块级作用域
if (true) {
  const a = 5;
  console.log('a3>>>', a);
}

console.log('a1>>>', a);

// 词法作用域
// 又叫做静态作用域，变量创建时确定，而非执行时确定
var a = 2;
function foo() {
  console.log(a);
}
function bar() {
  var a = 3;
  foo();
}
bar(); // 2

// 作用域链

// this作用域相关
// 重要：运行时绑定，决定 this指向
// this被确定后，不能修改

// this 默认绑定
// this new绑定
function fn() {
  this.x = 6;
  return null;
}
let obj = new fn();
console.log(obj.x);
// this 显式绑定 apply,call,bind
