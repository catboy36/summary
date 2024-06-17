// 类是面向对象程序设计（OOP）实现信息封装的基础

// class包含：字段，构造函数，方法

class Car {
  // 字段
  engine: string;

  // 构造函数
  constructor(engine: string) {
    this.engine = engine;
  }

  // 方法
  disp(): void {
    console.log('发动机为：', this.engine);
  }
}

// 继承
class Animal {
  move(distanceInMeters: number = 0): void {
    console.log(`Animal move ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark(): void {
    console.log('Woof! Woof!');
  }
}

const dog = new Dog();
dog.bark();
dog.move(10);

class PrinterClass {
  doPrint(): void {
    console.log(' doPrint() ');
  }
}
class StringPrinter extends PrinterClass {
  doPrint(): void {
    super.doPrint(); //
    console.log('子类的 doPrint() ');
  }
}

// 修饰符
// public(可以自由的访问类程序里定义的成员)
// private（只能够在该类的内部进行访问）
// protected（除了在该类内部可以访问，还可以在子类中仍然可以访问）

// public
class Father {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const father = new Father('Liu');
// father.name;

class Son1 extends Father {
  constructor(name: string) {
    super(name);
  }

  say() {
    // console.log(this.name);
  }
}

// prtected
class Father2 {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const father2 = new Father('Liu');
// father.name;

class Son2 extends Father2 {
  constructor(name: string) {
    super(name);
  }

  say() {
    console.log(this.name);
  }
}

// 只读修饰符合
// readonly

// 静态属性
// static 属性存在于类本身上面而不是实例上
class Square {
  static width = '100px';
}

Square.width;

// 抽象类
// abstract
// 作为其它派生类的基类使用，一般不会直接被实例化
// 不同于接口，抽象类可以包含成员的实现细节
abstract class Animal1 {
  abstract makeSound(): void;
  move(): void {
    console.log('roaming the earch...');
  }
}

class Cat extends Animal {
  makeSound() {
    console.log('miao miao');
  }
}
const cat = new Cat();
cat.makeSound(); // miao miao
cat.move(); // roaming the earch...
