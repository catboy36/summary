// bind,call,apply作用都是改变函数执行上下文，改变运行时this指向

// 区别
// apply this, 参数数组形式，改变this后立即执行，临时改变一次
// 第一个参数为null undefined时候，this默认指向window
apply(null, [1, 2]);

// call this, 参数列表非数组
call(null, 1, 2);

// bind this, 参数列表形式
// this指向后不会立即执行，但是返回一个this指向永久改变的函数

// 手写bind
// 1. 修改this指向
// 2. 动态传递参数
// 3. 兼容new关键字

Function.prototype.myBind = function () {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  // 获取参数
  const args = [...arguments].slice(1);
  const fn = this;
  return function Fn() {
    // 根据调用方式不同，传入不同的绑定值
    return fn.apply(
      this instanceof Fn ? new fn(...arguments) : context,
      args.concat(...arguments)
    );
  };
};

