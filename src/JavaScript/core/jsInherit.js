// javaScript继承实现
// 优点：子类具有父类的各种属性方法，不需要再次编写相同代码
// 子类继承父类时，可以重新定义某些属性方法，覆盖父类

// 实现方式
// 1. 原型链继承
// 2. 构造函数继承（call）
// 3. 组合继承
// 4. 原型式继承
// 5. 寄生式继承
// 6. 寄生组合式继承

// 1. 原型链继承
// 实例使用的同一个原型对象
function Parent() {
  this.name = 'parent1';
  this.play = [1, 2, 3];
}
function Child() {
  this.type = 'child2';
}
Child.prototype = new Parent();
var s1 = new Child();
var s2 = new Child();
s1.play.push(4);
console.log(s1.play, s2.play);

// 构造函数继承
// 父类原型对象中一旦存在父类之前自定义的方法，那么子类将无法继承这些方法
// 只能继承父类实例属性方法，不能继承原型属性方法
function Parent1() {
  this.name = 'parent1';
}

Parent1.prototype.getName = function () {
  return this.name;
};

function Child1() {
  Parent1.call(this);
  this.type = 'child';
}

let cld = new Child1();
console.log(cld);
console.log(cld.getName()); // 报错

// 组合继承
// 结合原型链继承和构造函数继承
// 父类构造函数执行 2 次，造成多一次的性能开销
function Parent3() {
  this.name = 'p3';
  this.play = [1, 2, 3];
}

Parent3.prototype.getName = function () {
  return this.name;
};

function Child3() {
  // 第二次调用 Parent3
  Parent3.call(this);
  this.type = 'child3';
}

// 第一调用 Parent3
Child3.prototype = new Parent3();
// 手动挂载构造器，指向自己的构造函数
Child3.prototype.constructor = Child3;

var s3 = new Child3();
var s4 = new Child3();
s3.play.push(4);
console.log(s3.play, s4.play);
console.log(s3.getName());
console.log(s4.getName());

// 原型式继承
// 借助 Object.create方法实现普通对象的继承
// Object.create实现浅拷贝，多个实例的引用类型属性指向相同内存
let parent4 = {
  name: 'parent4',
  friends: ['p1', 'p2', 'p3'],
  getName: function () {
    return this.name;
  },
};
let person4 = Object.create(parent4);
person4.name = 'tom';
person4.friends.push('jerry');
let person5 = Object.create(parent4);
person5.friends.push('lucy');
console.log(person4.name); // tom
console.log(person4.name === person4.getName()); // true
console.log(person5.name); // parent4
console.log(person4.friends); // ["p1", "p2", "p3","jerry","lucy"]
console.log(person5.friends);

// 寄生式继承
// 在原型式继承基础上优化，添加一些方法
let parent5 = {
  name: 'parent5',
  friends: ['p1', 'p2', 'p3'],
  getName: function () {
    return this.name;
  },
};
function clone(original) {
  let clone = Object.create(original);
  clone.getFriends = function () {
    return this.friends;
  };
  return clone;
}
let person6 = clone(parent5);
console.log(person6.getName()); // parent5
console.log(person6.getFriends());

// 寄生组合式继承
function Parent6() {
  this.name = 'p6';
  this.player = [1, 2, 3];
}

Parent6.prototype.getName = function () {
  return this.name;
};

function Child6() {
  Parent6.call(this);
  this.friends = 'child5';
}

Child6.prototype.getFriends = function () {
  return this.friends;
};

function clone(parent, child) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

clone(Parent6, Child6);

let person7 = new Child6();
console.log(person7);
console.log(person7.getName());
console.log(person7.getFriends());

// ES6继承
// 语法糖，原理也是寄生组合式继承
class Person {
  constructor(name) {
    this.name = name;
  }
  //
  // Person.prototype.getName = function() { }
  // getName() {...}
  getName = function () {
    console.log('Person:', this.name);
  };
}
class Gamer extends Person {
  constructor(name, age) {
    // “this” super()
    super(name);
    this.age = age;
  }
}
const asuna = new Gamer('Asuna', 20);
asuna.getName();
