// 参数
// 默认参数
// 函数的形参是默认声明的，不能使用 let或 const再次声明
// 参数默认值应该是函数的尾参数，如果不是尾参数设置默认值，这个参数没法省略
function log(x, y = 'world') {
  console.log(x, y);
}

function foo({ x, y = 5 } = {}) {
  console.log(x, y);
}

function f(x = 1, y) {
  console.log(x, y);
}

f(undefined, 3);

// 属性
// length属性
// length返回没有指定默认值的参数个数，rest也不计入
// 如果设置了默认值的参数不是尾参数，则 length属性不计入之后的参数
(function (a, b, c = 5) {}).length; // 2
(function (...args) {}).length; // 0
(function (a = 0, b, c) {}).length;
(function (a, b = 1, c) {}).length;

// name属性
// 返回该函数的函数名称

var f = function () {};
f.name; // f

const bar = function baz() {};
bar.name; // baz

new Function().name; // anonymous

new Function().name; // anonymous

function foo() {}
foo.bind({}).name; // "bound foo"

(function () {}).bind({ name: '3123' }).name; // "bound "

// 作用域
// 一旦设置了参数默认值，函数声明初始化时，参数会形成一个单独作用域
// 初始化结束，这个作用域就会消失，这种语法行为，在不设置参数默认值时，是不会出现的

let x = 1;
// x没有定义，指向全局变量 x
function f(y = x) {
  // 等同于 let y = x
  let x = 2;
  console.log(y);
}
f(); // 1

// 严格模式
// 只要函数参数使用了默认值，解构赋值，扩展运算符，那么函数内部就不能显式设定为严格模式

// 报错
// function doSomething(a, b = 3) {
//     'use strict';
// }

// const doSomething = function ({a, b}) {
//     'use strict';
//     // code
//    };

// const doSomething = (...a) => {
//     'use strict';
//     // code
//    };

// 箭头函数
var fn = v => v;
// 不传参或者多个参数，需要括号
var fn = () => 5;
var add = (a, b) => a + b;
var add = (a, b) => {
  return a + b;
};
let getTempItem = id => ({ id: id, name: 'Temp' });

// 注意：
// 在JavaScript中，箭头函数没有自己的this，箭头函数中的this会继承外层非箭头函数的this值。如果外层都是箭头函数，则会继续向上查找，直到找到一个非箭头函数的this
// 不可以做构造函数
// 不可以使用 argumens对象，可以用 rest代替
// 不可以使用 yield命令，箭头函数不能做 Generator函数
var a = 48;
var obj = {
  a: 66,
  getA: () => {
    return this.a;
  },
};

const getA = obj.getA;
obj.getA(); // 48
getA(); // 48

var a1 = 48;
var obj1 = {
  a1: 66,
  getA1: function () {
    return this.a1;
  },
};

const getA1 = obj1.getA1;
obj1.getA1(); // 66
getA1(); // 48
