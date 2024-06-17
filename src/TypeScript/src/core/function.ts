// 函数

const add = (a: number, b: number): number => a + b;

// 没有提供函数实现的情况下，有两种声明函数类型的方式：
type longHand = {
  (a: number): number;
  (c: string): string;
};

type ShortHand = (a: number) => number;

// 当存在函数重载时，只能使用方式一

// 可选参数
const add1 = (a: number, b?: number) => a + (b ? b : 0);

// 剩余参数
const add2 = (a: number, ...rest: number[]) => rest.reduce((a, b) => a + b, a);

// 函数重载
// 允许创建数项名称相同，单输入输出类型或参数个数不同的子程序
//
function add3(arg1: string, arg2: string): string;
function add3(arg1: number, arg2: number): number;
// 逻辑依然需要编写，需要使用| ?操作符
function add3(arg1: string | number, arg2: string | number) {
  // arg1 + arg2
  if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    return arg1 + arg2;
  } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
    return arg1 + arg2;
  }
}

// 和 js函数区别：参数类型，返回类型，可选参数，函数重载
