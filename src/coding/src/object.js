// new

const _new = function (constructor) {
  const obj = {};
  obj.__proto__ = constructor.prototype;
  const res = constructor.call(obj);
  return typeof res === obj && res != null ? res : obj;
};

function myNew(Func, ...args) {
  const obj = {};
  obj.__proto__ = Func.prototype;
  const res = Func.apply(obj, args);
  return res instanceof Object ? res : obj;
}

// 寄生组合式继承
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function () {
  return this.name;
};

function Son(name, age) {
  // 这里其实就等于 this.name = name
  Parent.call(this, name);
  this.age = age;
}

Son.prototype.getAge = function () {
  return this.age;
};
Son.prototype.__proto__ = Object.create(Parent.prototype);

const son1 = new Son("shao", 20);

console.log(son1.getName()); // shao
console.log(son1.getAge()); // 20
