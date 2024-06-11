// 尾递归
// 函数尾部调用自身
// 尾递归只需要保存一个调用栈/，复杂度O(1)
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

function factorial2(n, start = 1, total = 1) {
  if (n <= 2) {
    return total;
  }
  return factorial2(n - 1, total, total + start);
}
