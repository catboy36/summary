// {
//     "compilerOptions": {
//     "target": "ES5",
//     "experimentalDecorators": true
//     }
//    }

// 类装饰
// 代码可读性变强，装饰器相当于一个注释
// 在不改变原有代码的情况下，对原有功能进行扩展
function addAge(constructor: Function) {
  constructor.prototype.age = 18;
}

@addAge
class Person {
  name: string;
  age!: number;
  constructor() {
    this.name = "huihui";
  }
}

let person = new Person();
console.log(person.age);

// 方法属性装饰器
// target 对象原型
// propertyKey 方法名称
// descriptor 方法的属性描述符
function method(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log(target);
  console.log("prop " + propertyKey);
  console.log("desc " + JSON.stringify(descriptor) + "\n\n");
  descriptor.writable = false;
}

function property(target: any, propertyKey: string) {
  console.log("target", target);
  console.log("propertyKey", propertyKey);
}

class Person1 {
  @property
  name: string;
  constructor() {
    this.name = "huihui";
  }
  @method
  say() {
    return "instance method";
  }
  @method
  static run() {
    return "static method";
  }
}

const xmz = new Person1();
// say
// xmz.say = function () {
//   return "edit";
// };

// 参数装饰
// target 当前对象的原型
// propertyKey 方法的名称
// index 参数数组中的位置
function logParameter(target: Object, propertyName: string, index: number) {
  console.log(target);
  console.log(propertyName);
  console.log(index);
}

class Employee {
  greet(@logParameter message: string): string {
    return `hello ${message}`;
  }
}
const emp = new Employee();
emp.greet("hello");

// 访问器装饰器
function modification(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log(target);
  console.log("prop " + propertyKey);
  console.log("desc " + JSON.stringify(descriptor) + "\n\n");
}
class Person2 {
  _name: string;
  constructor() {
    this._name = "huihui";
  }
  @modification
  get name() {
    return this._name;
  }
}

// 装饰器工厂
function addAge1(age: number) {
  return function (constructor: Function) {
    constructor.prototype.age = age;
  };
}
@addAge1(10)
class Person3 {
  name: string;
  age!: number;
  constructor() {
    this.name = "huihui";
  }
}
let person3 = new Person3();

// 执行顺序
// 当多个装饰器应用在一个声明上，将由上至下依次对装饰器表达式求值，求职结果被当作函数，
// 由下至上依次调用
function f() {
  console.log("f(): evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("f(): called");
  };
}
function g() {
  console.log("g(): evaluated");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("g(): called");
  };
}
class C {
  @f()
  @g()
  method() {}
}
