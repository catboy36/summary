// 事件循环
// 实现单线程非阻塞的方法就是事件循环
// 同步任务
// 异步任务
console.log(1);
setTimeout(() => {
  console.log(2);
}, 0);
new Promise((resolve, reject) => {
  console.log("new Promise");
  resolve();
}).then(() => {
  console.log("then");
});
console.log(3);

// 异步任务分为微任务和宏任务
// 微任务
// 一个需要异步执行的函数，执行时机是在主函数执行结束之后，当前宏任务结束之前
// Promise.then,MutationObserver,Proxy，process.nextTick(node)

// 宏任务
// 宏任务时间粒度比较大，执行的时间间隔是不能精确控制的，对一些高实时性的需求不太符合
// script(外层同步代码),setTimeout/setInterval,UI rendering,postMessage,MessageChannel,setImmediate(node),I/O(node)

// async await
// await后面是一个Promise对象，返回该对象的结果，如果不是Promise对象，就直接返回对应的值
function f() {
  return Promise.resolve("TEST");
}
// asyncF is equivalent to f!
async function asyncF() {
  return "TEST";
}
// 不管await后面跟着什么，都回阻塞后面代码
async function fn1() {
  console.log(1);
  await fn2();
  console.log(2); //
}
async function fn2() {
  console.log("fn2");
}
fn1();
console.log(3);

async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
setTimeout(function () {
  console.log("settimeout");
});
async1();
new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");
// script start -> async1 start -> async2 -> promise1 -> script end
// -> async1 end -> promise2 -> settimeout
