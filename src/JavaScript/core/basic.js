// 基本类型
const a = 'string';
const b = 345;
const c = true;
const d = undefined;
const e = null;
// 符号创建后是唯一的，不可变，用途确保对象属性唯一
const f = Symbol();
const g = NaN;

// 引用类型
// object,array,function
const person = { age: 1, name: 'xxx', gender: 'male' };
const arr = ['blue', 1, 3, 'red'];

function f1() {}
const f2 = function () {};
const f3 = () => {};
const f4 = new Function('a', 'b', 'console.log(a + b)');

// map,set,date,regExp
const map = new Map();
map.set('x', 1);
map.get('x');

const set = new Set();
set.add(6);
set.has(6);


export { a, b, c, d, e, f, g, person, arr, f1, f2, f3, f4 };
