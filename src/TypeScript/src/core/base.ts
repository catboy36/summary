// TypeScript是 JavaScript的超集，支持 ES6语法，支持面向对象编程，如类，接口，继承，泛型
// 是一种静态类型检查语言，提供类型注解，在代码编译阶段就可以检查出数据类型的错误
const hello: string = 'hello';

// TypeScript特性
// 类型批注和编译时类型检查：在编译时批注变量类型
// 类型推断：t中没有批注变量类型会自动推断变量类型
// 类型擦出：在编译过程中批注的内容和接口会在运行时利用工具擦除
// 接口：ts中用接口来定义对象的类型
// 枚举：用于取值被限定在一定范围内的场景
// Mixin: 可以接受任意类型的值
// 泛型编程：写代码时使用一些以后才指定的类型
// 名字空间：名字只在该区域内有效，其它区域可重复使用该名字而不冲突
// 元祖：元祖合并了不同类型的对象，相当于一个可以装不同类型数据的数组

// 类型批注
const str: string = 'string';
const number: number = 4;
const empty: null = null;
const noDef: undefined = undefined;

// 接口
// 简单来说就是用来面熟对象的类型
interface Person {
  name: string;
  age: number;
}

let mike: Person = {
  name: 'mike',
  age: 30,
};

// ts属性类型
// boolean,number,string,null,undefined, array
// tuple, enum, void, never, object, any

let flag: boolean = true;
flag = false;

let num: number = 4;
num = 5;

let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;

let str1: string = 'this is a string';
str1 = `test`;

let na: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${na}`;

let arr: string[] = ['12', '35'];
arr = ['46', '47'];

let arr1: Array<number> = [3, 4, 5];

//元祖，类型不相同，数量有限
let tupleArr: [number, string, boolean];
tupleArr = [2, '3', true];

// enum
enum Color {
  Red = 1,
  Green = 2,
  Blue = 3,
}
let c: Color = Color.Green;

// any
// 配置了 --strictNullChecks标记，null和 undefined只能赋给 void 和它们各自
let n: any = 3;
n = '44';
n = true;

let n2: number | undefined | never;

// void
// 标识方法没有返回值
function sayHello(): void {
  console.log('hello');
}

// never
// never类型一般用于指定那些总是会抛出异常，无限循环
function error(message: string): never {
  throw new Error(message);
}

// object
let obj: object;
obj = { name: 'Wang', age: 25 };
