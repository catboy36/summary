// Promise 异步编程解决方案
// 优点：链式操作减低了编码难度，代码可读性明显增强

// 状态：pending, fulfilled, rejected
// 一旦从 pending变为 fulfilled或 rejected，就不会再变了

const promise = new Promise(function (resolve, reject) {});

// then,catch,finally

// catch是.then(null, rejection)或.then(undefined, rejection);
// 用于指定错误发生时的回调函数

// finally方法用于指定不管Promise对象最后状态如何，都会执行的操作

// Promise构造函数方法all,race,allSettled,resolve,reject,try

// Promise.all 必须全部fulfilled才会fulfilled
const p1 = new Promise((resolve, reject) => {
  resolve("hello");
})
  .then((result) => result)
  .catch((e) => e);
const p2 = new Promise((resolve, reject) => {
  throw new Error(" ");
})
  .then((result) => result)
  // 自己定义了catch，则错误不会被外部Promise.all的catch捕获
  .catch((e) => e);
Promise.all([p1, p2])
  .then((result) => console.log(result))
  .catch((e) => console.log(e));

// Race 率先一个改变状态，整体就改变

// allSettled 等待所有实例返回结果，才结束，无论fulfilled还是rejected

// resolve
// 参数是Promise，原封不动的返回实例
// 参数是thenable对象，转化为Promise对象，立即执行then方法
// 参数不具有then方法，返回新的Promise对象，状态为resolved
// 没有参数时，直接返回一个resolved状态的Promise对象
Promise.resolve("foo");
// 等价于
new Promise((resolve) => resolve("foo"));

// reject
// 参数会原封不动的变成后续方法的参数
const p = Promise.reject("error");
// 等价于
// const p = new Promise((resolve, reject) => reject("error"));
p.then(null, function (s) {
  console.log(s);
});

// 参数原封不动传给后续
Promise.reject("error").catch((e) => {
  console.log(e === "error");
});
// true
