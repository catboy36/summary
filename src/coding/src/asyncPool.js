/**
 *
 * @param {*} poolLimit 限制的并发数
 * @param {*} array 任务数组
 * @param {*} iteratorFn 迭代函数，对于数组每一项执行，返回一个Promise或异步函数
 */
async function asyncPool(poolLimit, array, iteratorFn) {
  // 存储所有的异步任务
  const ret = [];
  // 存储正在执行的异步任务
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

const timeout = (i) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log(i);
      resolve(i);
    }, i)
  );
// 当然,limit <= 0 的时候 我们可以理解为只允许一个请求存在
asyncPool(2, [1000, 5000, 3000, 2000], timeout).then((res) => {
  console.log(res);
});
