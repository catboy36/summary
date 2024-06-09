// new用于创建一个给定构造函数的实例对象
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayName = function () {
  console.log(this.name);
};

const p1 = new Person("aka", 28);
console.log(p1);
p1.sayName();

// new原理
// 1.创建一个新的对象obj
// 2. 将对象与构造函数通过原型链连接起来
// 3. 将构造函数中的this绑定到新建对象obj上
// 4. 根据构造函数返回类型判断，原始值忽略，返回的对象，正常处理

// new操作符实现
function myNew(Func, ...args) {
  const obj = {};
  obj.__proto__ = Func.prototype;
  const res = Func.apply(obj, args);
  return res instanceof Object ? res : obj;
}
