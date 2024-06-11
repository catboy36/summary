// 扩展运算符 ...
// 扩展运算符实现的是浅拷贝，修改了引用指向的值，会同步反映到新数组
// 用于数组赋值，只能放在最后

// 可以将字符串转为数组(定义了 Iterator接口的对象)
[..."hello"];

// 构造函数方法
// Array.from()
// 将类数组对象和可遍历（iterable）对象转化为数组
let arrayLike = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
};

let arr = Array.from(arrayLike);

// 可接受第二个参数，对每个元素处理，返回处理后的数组
Array.from([1, 2, 3], (x) => x * x);

// Array.of()
// 用于将一组值转化为数组
// 没有参数时候，返回空数组
Array.of(1, 4, 5); // [1, 4, 5]

// 实例对象新增方法
// copyWithin
// 将指定位置的成员复制到其他位置（会覆盖），返回当前数组

let arr3 = [1, 2, 3, 4, 5].copyWithin(0, 3);

// find, findIndex
// 第二个参数用来绑定this对象
function f(v) {
  return v > this.age;
}
let person = { name: "John", age: 20 };
[10, 12, 26, 15].find(f, person);

// fill
[1, 2, 3].fill(6, 1, 2);

// entries(), keys(), values()

// includes(), 方法第二个参数表示搜索开始位置
[1, 2, 3].includes(1, 1);

// flat(), flatMap()
// 扁平化数组，返回新数组

// flatMap 第二个参数用来绑定this
[1, 2, 3].flatMap((x) => [x, x * 2]);

// 数组的空位
// ES6明确将空位转为undefined

// sort排序稳定性
// sort默认设置为稳定的排序算法
const arr4 = ["peach", "straw", "apple", "spork"];
const stableSorting = (s1, s2) => {
  if (s1[0] < s2[0]) return -1;
  return 1;
};
arr4.sort(stableSorting);
