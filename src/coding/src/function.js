// Function.prototype.call

Function.prototype._call = function (ctx, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  const o = ctx == null ? globalThis : Object(ctx);
  const key = Symbol("key");
  o[key] = this;
  const res = o[key](...args);
  delete o[key];
  return res;
};
Function.prototype._apply = function (ctx, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  const o = ctx == null ? globalThis : Object(ctx);
  const key = Symbol("key");
  o[key] = this;
  const res = o[key](args);
  delete o[key];
  return res;
};

const obj = {
  name: "11",
  fun() {
    console.log(this.name);
  },
};

const obj2 = { name: "22" };
obj.fun(); // 11
obj.fun.call(obj2); // 22
obj.fun._call(obj2); // 22

Function.prototype.myCall = function (thisArg, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Error"); // 如果不是函数则抛出错误
  }

  thisArg = thisArg || window; // 如果没有提供 thisArg，默认为全局对象

  thisArg.fn = this; // 将当前函数赋值给接收者对象的fn属性
  const result = thisArg.fn(...args); // 调用函数并传入参数
  delete thisArg.fn; // 调用后删除fn属性
  return result; // 返回函数执行结果
};

// 示例
function greet(name) {
  console.log("Hello, " + name);
}

greet.myCall(null, "World"); // 输出: Hello, World

Function.prototype._bind = function (ctx, ...args) {
  // 获取函数体
  const _self = this;
  // 用一个新函数包裹，避免立即执行
  const bindFn = (...reset) => {
    return _self.call(ctx, ...args, ...reset);
  };
  return bindFn;
};
