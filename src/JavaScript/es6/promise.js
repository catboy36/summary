// Promise 异步编程解决方案
// 优点：链式操作减低了编码难度，代码可读性明显增强

// 状态：pending, fulfilled, rejected
// 一旦从 pending变为 fulfilled或 rejected，就不会再变了

const promise = new Promise(function (resolve, reject) {});

// then,catch,finally
