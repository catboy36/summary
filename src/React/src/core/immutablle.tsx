// immutable
// 不可变的，在计算机中，指一旦创建，就不能再改变的数据
// 对immutable对象的任何修改或添加删除操作都会返回一个新的Immutable对象
// Immutable实现原理是Persistent Data Structure（持久化数据结构）
// 1. 用一种数据结构来保存数据
// 2. 当数据被修改时，会返回一个对象，但是新对象会尽可能的利用之前的数据结构而不会对内存造成浪费
// 结构共享：如果对象数中一个节点发生变化，只修改这个节点和受他影响的父节点，其它节点则进行共享

// Immutable.js
// 提供易用的数据结构：Collection，List，Map，Set，Record，Seq
// List有序索引
// Map无序索引
// Set没有重复值的集合

import Immutable, { Map, is } from "immutable";
// fromJS 讲一个js数据转换为immutable类型的数据
const obj = Immutable.fromJS({ a: "123", b: "234" });
// toJS 将一个immutable数据转换为js类型数据
// is 比较两个对象
const map1 = Map({ a: 1, b: 1, c: 1 });
const map2 = Map({ a: 1, b: 1, c: 1 });
map1 === map2; //false
Object.is(map1, map2); // false
is(map1, map2); // true
// get(key)对数据或对象取值
// getIn([])对嵌套对象或数组取值，传参为数组，表示位置
let abs = Immutable.fromJS({ a: { b: 2 } });
abs.getIn(["a", "b"]); // 2
abs.getIn(["a", "c"]); //
let arr = Immutable.fromJS([1, 2, 3, { a: 5 }]);
arr.getIn([3, "a"]); // 5
arr.getIn([3, "c"]);

let foo = Immutable.fromJS({ a: { b: 1 } });
let bar = foo.setIn(["a", "b"], 2); // setIn
console.log(foo.getIn(["a", "b"])); // getIn 1
console.log(foo === bar);


// react中的应用
// 使用immutable可以给React应用带来性能优化，主要体现在减少渲染次数
