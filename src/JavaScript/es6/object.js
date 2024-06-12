// 对象
// 属性简写
// 简写的对象方法不能做构造函数
const foo = 6;
const baz = {
  foo,
  method() {
    console.log('666');
  },
};

const obj = {
  f() {
    this.foo = 'bar';
  },
};
new obj.f(); // 报错

// 属性名表达式
// 不能于对象属性名简写一起用
let lastWord = 'last word';
const a = {
  'first word': 'hello',
  [lastWord]: 'world',
};

const keyA = { a: 1 };
const keyB = { b: 2 };
// Object {[object Object]: "valueB"}
const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB',
};

// super关键字
// this关键字总是指向函数所在的当前函数，super关键字指向当前对象的原型对象
const proto = {
  foo: 'hello',
};

const obj1 = {
  foo: 'world',
  find() {
    return super.foo;
  },
};
Object.setPrototypeOf(obj1, proto);
obj1.find();

// 扩展运算符应用
// 解构赋值必须是最后一个参数
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
// 解构赋值是浅拷贝(等同于使用 Object.assign()
let o = { a: { b: 1 } };
let { ...m } = o;
o.a.b = 2;
console.log(m.a.b);

// 属性遍历：
// for...in  不含 Symbol属性
// Object.keys() 不含 Symbol属性
// Object.getOwnPropertyNames() 不含 Symbol属性
// Object.getOwnPropertySymbols()
// Reflect.ownKeys() 所有 key，包含 Symbol

// 遍历顺序规则：
// 首先遍历所有数值键，按照数值升序排列；其次遍历所有字符串，按照加入时间升序排列；最后遍历所有 Symbol键，按照加入时间升序排

Reflect.ownKeys({
  [Symbol()]: 0,
  b: 1,
  10: 2,
  2: 3,
  a: 0,
});
//  ['2', '10', 'b', 'a', Symbol()]

// 对象新增的方法
// Object.is()
// 严格判断两个值是否相等，与===行为基本一致，区别如下：

+0 === -0; // true
NaN === NaN; // false

Object.is(+0, -0); // false
Object.is(NaN, NaN); // true

// Object.assign()
// 用于对象合并，并将源对象source所有可枚举属性赋值到目标对象 target
// 此方法是浅拷贝,同名属性会替换
const target = { a: 1, b: 1 };
const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };
Object.assign(target, source1, source2);

// Object.getOwnPropertyDescriptors()
// 返回指定对象所有自身属性（非继承）的描述对象
const obj2 = {
  foo: 123,
  get bar() {
    return 'abc';
  },
};
Object.getOwnPropertyDescriptors(obj2);

// Objecy.setPrototypeOf()
// 设置一个对象的原型
Object.setPrototypeOf({}, null);

// Object.getPrototypeOf()
// 获取一个对象的原型
Object.getPrototypeOf(obj2);

// Object.keys(), Object.values(), Object.entries()
var obj3 = { foo: 'bar', baz: 42 };
Object.keys(obj3);
Object.values(obj3);
Object.entries(obj3);

// Object.fromEntries()
// 用于将一个键值对数组转化为对象

Object.fromEntries([
  ['foo', 'baz'],
  ['a', 88],
]);
