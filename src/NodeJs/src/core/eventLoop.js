// nodejs中的事件循环
// nodejs中事件循环是基于 libuv实现的
// libuv是一个多平台的专注于异步IO的库

// 流程
// timers阶段：这个阶段执行 timer(setTimeout, setInterval)回调
// 定时器检测阶段（timers）：本阶段执行 timer的回调，即 setTimeout,setInterval里的回调函数
// I/O事件回调阶段（I/O callbacks）：执行延迟到下一个循环迭代的 I/O调用，即上一轮循环中未被执行的一些 I/O回调
// 闲置阶段（idle prepare）：仅系统内部使用
// 轮询阶段（poll）检索新的 I/O事件，执行与 I/O相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和
// setImmediate调度的之外），其余情况 node将在适当的时候在此阻塞
// 检查阶段（check）：setImmediate回调函数在此执行
// 关闭事件回调阶段（close callback）：一些关闭的回调函数，如 socket.on('close, ...)

// 每个阶段对应一个队列，当事件寻环进入某个阶段时，将会在该阶段内执行回调，直到队列耗尽或者回调的最大数量已经执行
// 那么将进入下一个处理阶段

// process.next不属于事件循环的任何一个阶段，它属于该阶段和下阶段之间的过渡，即本阶段执行结束，进入下一阶段前，所要执行的回调
// 类似插队

// 微任务：
// nextTick队列： process.nextTick
// 其他队列：Promise的 then回调queue Microtask

// 宏任务
// timer queue: setTimeout setInterval
// poll queue: IO 事件
// check queue: setImmediate
// close queue: close事件

// 执行顺序
// nextTick microtask queue -> other microtask queue -> timer queue -> poll queue
// -> check queue -> close queue

// async function async1() {
//   console.log('async1 start');
//   await async2();
//   console.log('async1 end');
// }
// async function async2() {
//   console.log('async2');
// }
// console.log('script start');
// setTimeout(function () {
//   console.log('setTimeout0');
// }, 0);
// setTimeout(function () {
//   console.log('setTimeout2');
// }, 300);
// setImmediate(() => console.log('setImmediate'));
// process.nextTick(() => console.log('nextTick1'));
// async1();
// process.nextTick(() => console.log('nextTick2'));
// new Promise(function (resolve) {
//   console.log('promise1');
//   resolve();
//   console.log('promise2');
// }).then(function () {
//   console.log('promise3');
// });
// console.log('script end');

// script start
// async1 start
// async2
// promise1
// promise2
// script end
// nextTick 1
// nextTick 2
// async1 end
// promise3
// setTimeout0
// setImmediate
// setTimeout2

setTimeout(() => {
  console.log('setTimeout6666');
}, 0);
setImmediate(() => {
  console.log('setImmediate8888');
});

// setTimeout虽然设置为 0 毫秒，但是会被强制 1 毫秒，时间到了进入 timer阶段队列
// 如果同步代码执行时间较长，进入事件循环时候 1 毫秒已过，setTimeout先执行，如果 1 毫秒未到，setImmediate先执行
