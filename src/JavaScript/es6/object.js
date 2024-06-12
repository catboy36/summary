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
