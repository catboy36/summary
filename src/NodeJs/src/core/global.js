// 全局对象
// NodeJS中 var声明的变量不属于全局变量，只在当前模块生效
// global全局对象，任何全局变量，函数，对象都是该对象的一个属性

// 真正的全局变量

// Class:Buffer
// 可以处理二进制以及非 Unicode编码的数据
// Buffer类实例化中存储了原始数据，Buffer类似于一个整数数组，在 V8堆原始存储空间给它分配了内存
// 一旦创建了 Buffer实例，则无法改变大小

// process
// 进程对象，提供有关当前进程的信息和控制
// console.log(process.versions)

// console
// 用来打印 stdout和 stderr

// console.log

// console.clear

// console.trace 打印函数的调用栈
function test() {
  demo();
}
function demo() {
  foo();
}
function foo() {
  console.trace();
}
// test();

// console.clear()

// clearInterval, setInterval

// clearTimeout, setTimeout

// setImmediate, clearImmediate
// 它将回调函数推迟到下一个I/O事件循环之前。这意味着它会在本次事件循环结束后，下一次事件循环的开始时执行。
setImmediate(() => {
  console.log('666');
});

// global
// 全局命名空间对象，process,console,setTimeout等都是 global的属性
// console.log(global.console)

// 模块级别的全局变量
// 只是每个模块都有，在命令交互中是不可以使用的
// __dirname
// 获取当前文件所在的路径，不包括文件名
console.log(__dirname);

// __filename
// 获取当前文件所在路径和文件名称，包括后面的文件名称
console.log(__filename);

// exports
// module.exports 用于指定一个模块的所导出内容，可以通过 require访问内容

exports.name = 'LHY';
exports.age = 31;
exports.gender = 'male';
// module.exports = {x: 1, y: 2}

// require
// 用于引入模块，JSON，或本地文件，可以从 node_modules引入模块
// 可以使用相对路径引入本地模块或 json文件，路径和根据__dirname定义的目录名或当前工作目录进行处理
