// 基本
function Obj1() {
  this.a = 3;
  this.b = 4;
}
const obj = Object.create(Obj1);
// 每个对象的__proto__都是指向他们构造函数的的原型对象prototype的
obj.__proto__ === Obj1;
const obj2 = new Obj1();
obj2.__proto__ === Obj1.prototype;

// Object
// 所有构造器都是函数对象，函数对象是由 Function构造产生的
Object.__proto__ === Function.prototype;
Function.__proto__ === Function.prototype;
Function.prototype.__proto__ === Object.prototype;
Object.prototype.__proto__ === null;

// 