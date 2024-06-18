// process对象是一个全局变量，提供有关当前nodejs进程的信息并对其进行控制，作为一个全局变量
// Javascript是一个单线程语言，所以通过node xxx启动一个文件后，只有一条主线程

// console.log(process.env)
// console.log(process.nextTick) EventLoop
// console.log(process.pid) 当前进程的id
// console.log(process.ppid) 当前进程对应的父进程
// console.log(process.cwd()) 当前进程工作目录
// console.log(process.platform) 当前进程运行的操作系统
// console.log(process.uptime()) 当前进程已经运行的时间

// 捕获异常
process.on("uncaughtException", () => {});
// 进程退出监听
process.on("exit", () => {});

// 标准流
// console.log(process.stdout) 标准输出
// console.log(process.stdin) 标准输入
// console.log(process.stderr) 标准错误输出

// console.log(process.title = 'ddd') 指定进程名称
// console.log(process.title)

// 获取命令行参数
// 数组：0 Node路径， 1 被执行js文件路径 2-n 真实传入命令的参数
console.log(process.argv);
const args = process.argv.slice(2);

// process
// 定义出一个动作，并且让这个动作在下个事件轮询的时间点上执行
function foo() {
  console.error("foo");
}
process.nextTick(foo);
console.error("bar");

// 两者区别：process.nextTick()会在这一次event loop的call stack清空后
//（下一次event loop开始前）再调用callback

// setTimeOut()并不知道什么时候call stack清空，所以何时调用callback函数不确定

setTimeout(foo, 0);
console.log('bar');