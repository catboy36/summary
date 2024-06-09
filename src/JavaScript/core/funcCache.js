// 主要依靠闭包，柯里化，高阶函数实现
// 闭包：函数+函数体内可访问变量的总和
(function () {
  var a = 1;
  function add() {
    const b = 2;
    let sum = b + a;
    console.log(sum); // 3
  }
  add();
})();

// 柯里化：把接受多个参数的函数转化为接受单一参数的函数
var add = function (x, y) {
  return x + y;
};
add(3, 4); //7
//
var add2 = function (x) {
  //** **
  return function (y) {
    return x + y;
  };
};
add2(3)(4);

// 高阶函数
// 通过接收其他函数作为参数或返回其他函数的函数
const memosize = function (func, content) {
  let cache = Object.create(null);
  content = content || this;
  return (...key) => {
    if (!cache[key]) {
      cache[key] = func.apply(content, key);
    }
    return cache[key];
  };
};

// const add = (a, b) => a + b;
const calc = memosize(add);

calc(10, 20);
calc(10, 20);
// 适合缓存的情况：
// 对于昂贵的函数调用，执行复杂计算的函数
// 对于具有有限且高度重复输入范围的函数
// 对于具有重复输入值的递归函数
// 对于纯函数（相同的输入调用时返回相同输出的函数）

