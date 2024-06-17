// 泛型
// 泛型允许在编写代码时，使用一些以后才指定的类型，在实例化时作为参数指明这些类型
// 不预先定义好具体类型，而在使用时候再指定一定类型的一种特性

// 函数声明
function returnItem<T>(param: T): T {
  return param;
}

function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

const res = swap([6, 7]);

// 接口声明
interface IReturnItemFn<T> {
  (param: T): T;
}
const returnItemFn: IReturnItemFn<number> = (para) => para;

// 类声明
// 约束泛型
type Params = string | number;
class Stack<T extends Params> {
  private arr: T[] = [];
  public push(item: T) {
    this.arr.push(item);
  }
  public pop() {
    this.arr.pop();
  }
}

const stack = new Stack<number>();
const stack1 = new Stack<string>();

// 索引类型，约束类型
function getValue1<T extends object, u extends keyof T>(obj: T, key: u) {
  return obj[key];
}

// 多类型约束
interface FirstInterface {
  doSomething(): number;
}

interface SecondInterface {
  doSomethingElse(): string;
}

interface ChildInterface extends FirstInterface, SecondInterface {}

class Demo<T extends ChildInterface> {
  private genericProperty: T;
  constructor(genericProperty: T) {
    this.genericProperty = genericProperty;
  }
  useT() {
    this.genericProperty.doSomething();
    this.genericProperty.doSomethingElse();
  }
}
