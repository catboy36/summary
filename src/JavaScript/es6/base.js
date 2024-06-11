// var,let,const
// var
// 全局声明的式全局对象的属性
// 函数内声明不带 var，该变量是全局的
var a = 30;
console.log(window.a);

// let
// 使用 let声明变量前，该变量是不可用的，常说的 暂时性死区
// 相同作用域下，不可以重复声明

// const
// const保证变量指向的内存地址保存的数据不得改动

// 区别
// 1. var声明变量提升，let，const没有
// 2. var不存在暂时性死区，let,const存在
// 3. var不存在块级作用域，let,const存在
// 4. var允许重复声明，let,const不允许
// 5. var,let可以修改声明的变量，const不能修改（声明的引用类型可以修改属性）

// 能使用 const尽量用 const，其它情况用 let，尽量避免使用 var
