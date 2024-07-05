// 工厂模式
// 创建对象的一种最常用设计模式，不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，这个函数被视为工厂

// 简单工厂模式
// 工厂方法模式
// 抽象工厂模式

// 简单工厂模式
// 也叫做静态工厂模式，用一个工厂对象创建同一类对象类的实例
function Factory(career) {
  function User(career, work) {
    this.career = career;
    this.work = work;
  }
  let work;
  switch (career) {
    case 'coder':
      work = [' ', ' Bug'];
      return new User(career, work);
      break;
    case 'hr':
      work = [' ', ' '];
      return new User(career, work);
      break;
    case 'driver':
      work = [' '];
      return new User(career, work);
      break;
    case 'boss':
      work = [' ', ' ', ' '];
      return new User(career, work);
      break;
  }
}
let coder = new Factory('coder');
console.log(coder);
let boss = new Factory('boss');
console.log(boss);

// 工厂方法模式
// 和简单工厂模式差不多，但是把具体的产品放在工厂函数的prototype中
// 这样一来，扩展产品种类就不必修改工厂函数了，核心类就变成抽象类，也可以随时重写某种具体的产品
// 用this判断是否属于工厂，这个工厂只能做可以做的事情
function Factory(career) {
  if (this instanceof Factory) {
    var a = new this[career]();
    return a;
  } else {
    return new Factory(career);
  }
}
//
Factory.prototype = {
  coder: function () {
    this.careerName = ' ';
    this.work = [' ', ' Bug'];
  },
  hr: function () {
    this.careerName = 'HR';
    this.work = [' ', ' '];
  },
  driver: function () {
    this.careerName = ' ';
    this.work = [' '];
  },
  boss: function () {
    this.careerName = ' ';
    this.work = [' ', ' ', ' '];
  },
};
let coder1 = new Factory('coder');
console.log(coder1);
let hr = new Factory('hr');
console.log(hr);

// 抽象工厂模式
// 抽象工厂模式不直接生成实例，而是对产品类蔟的创建
// 生产工厂的

// js没有抽象类，模拟，分四部分：
// 用于创建抽象类的函数，抽象类，具体类，实例化具体类
// 参数中传入子类，父类，方法内实现子类对父类的继承
let CareerAbstractFactory = function (subType, superType) {
  // 判断抽象工厂中是否有该抽象类
  if (typeof CareerAbstractFactory[superType] === 'function') {
    // 缓存类
    function F() {}
    // 继承父类属性方法
    F.prototype = new CareerAbstractFactory[superType]();
    // 将子类的constructor指向父类
    subType.constructor = superType;
    // 子类原型继承父类
    subType.prototype = new F();
  } else {
    throw new Error('抽象类不存在');
  }
};


// 工厂模式适用场景
// 1. 不想让某个子系统与较大的那个对象之间形成强耦合，运行时从许多子系统中进行挑选，工厂模式比较理想
// 2. 将new操作简单封装，遇到new的时候就应该考虑是否用工厂模式
// 3. 需要依赖具体环境创建不同实例，这些实例都有相同行为，这时可以用工厂模式，简化实例创建过程，同时也可以减少每种对象所需的代码量，有利于消除对象间的耦合，提供更大的灵活性
