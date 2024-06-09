// 操作方法
// 增删改查
// 增
// push,unshift,splice,concat
// 删
// pop,shift,splice,slice
// 改
// splice
// 查
// indexOf，includes,find

// 排序
// sort,reverse
// function compare(value1, value2) {
//   if (value1 < value2) {
//     return -1;
//   } else if (value1 > value2) {
//     return 1;
//   } else {
//     return 0;
//   }
// }
function compare(a, b) {
  return a - b;
}
let values = [0, 1, 5, 10, 15];
values.sort(compare);
console.log(values);

// 转换方法
// join

// 迭代方法
// some,svery, forEach, filter,map
