// Node.js是一个服务器端的，非阻塞式I/O的，世界驱动的Javascript运行环境
// 优点：
// 处理高并发场景性能更佳
// 适合I/O密集型应用，只的是应用在运行极限时，CPU占用率仍然比较低，大部分时间是在做I/O
// 硬盘内存读写操作

// 单线程，缺点：
// 不适合CPU密集型应用
// 只支持单核CPU,不能充分利用CPU
// 可靠性低，一旦代码某个环节奔溃，整个系统奔溃
// require('./core/global');

// const { name, age, gender } = require('./core/global');

// console.log(name, age, gender);

require('./core/performance');
