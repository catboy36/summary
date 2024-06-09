// 字符串操作
// 增（创建副本）
// + ,${}, concat
let str = "hello ";
let res = str.concat("world");
// 删（创建副本）
// slice(start, end),substr(start, length),substring(start, end)

//改（副本）
// trim, trimLeft, trimRight, repeat
// padStart, padEnd(填充，长度不够时
var a = "123";
a.padEnd(6, ".");
a.padStart(12, "$");
// toLowerCase, toUpperCase

// 查
// chatAt,indexOf,startWith,includes

// 字符串转换方法
// split 按照指定符号转化为数组

// match,search,replace
let text = "cat, bat, sat, fat";
let pattern = /.at/;
let matches = text.match(pattern);
console.log(matches[0]); // "cat"

let text2 = "cat, bat, sat, fat";
let pos = text2.search(/at/);
console.log(pos); // 1

let text3 = "cat, bat, sat, fat";
// let result = text3.replaceAll("at", "ond");
let result = text3.replace(/at/g, "ond");
console.log(result); // "cond, bat, sat, fat"
