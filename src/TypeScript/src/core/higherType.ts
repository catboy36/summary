// ts高阶类型
// 交叉类型，联合类型，类型别名
// 类型索引，类型约束，映射类型，条件类型

// 交叉类型
// &
function extend<T, U>(first: T, second: U): T & U {
  let res: T & U = { ...first, ...second };
  return res;
}

// 联合类型
// ｜
function formatCommandline(command: string[] | string) {
  let line = '';
  if (typeof command === 'string') {
    line = command.trim();
  } else {
    line = command.join(' ').trim();
  }
}

// 类型别名
// 给类型起个新名字
type some = boolean | string | number;
const m: some = true;
const p: some = '32';
const q: some = 46;

type Container<T> = { value: T };

type Tree<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
};

// 类型索引
interface Button {
  type: string;
  text: string;
}

// keyof类似于 Object.keys
type ButtonKeys = keyof Button;

const v: ButtonKeys = 'type';
const v1: ButtonKeys = 'text';

// 类型约束
type BaseType = string | number | boolean;

function copy<T extends BaseType>(arg: T): T {
  return arg;
}

function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 映射类型
// in

type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Obj {
  a: string;
  b: string;
}

type ReadOnlyObj = ReadOnly<Obj>;

// 条件类型
// 三元表达式
// T extends U ? X : Y
