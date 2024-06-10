// 函数式编程
// 主要编程范式：命令式编程，声明式编程，函数式编程

// 纯函数
// 给定的输入返回相同的输出，所有数据都是不可变的，纯函数无状态

// 高阶函数
// 以函数作为输入或者输出的函数
const forEach = function (arr, fn) {
  for (let i = 0; i < arr.length; i++) {
    fn(arr[i]);
  }
};
let arr = [1, 2, 3];
forEach(arr, (item) => {
  console.log(item);
});

// 柯里化
// 把一个多参数函数转换为一个嵌套的一元函数的过程
const curry = function (fn) {
  return function curriedFn(...args) {
    if (args.length < fn.length) {
      return function () {
        return curriedFn(...args.concat([...arguments]));
      };
    }
    return fn(...args);
  };
};
const fn = (x, y, z, a) => x + y + z + a;
const myfn = curry(fn);
console.log(myfn(1)(2)(3)(1));
// 柯里化的意义：让纯函数更纯，每次接收一个参数，松散解耦，惰性执行

// 组合和管道
// 组合函数：多个函数组合成一个
// 组合函数从右往左
const compose =
  (...fns) =>
  (val) =>
    fns.reverse().reduce((acc, fn) => fn(acc), val);

// 管道函数从左到右
const pipe =
  (...fns) =>
  (val) =>
    fns.reduce((acc, fn) => fn(acc), val);

// 缺点：过度包装，性能差，资源占用高（js为了实现对象状态不可变，往往要创建新对象）
// 递归陷阱:函数式编程，为了实现迭代，往往使用递归操作
