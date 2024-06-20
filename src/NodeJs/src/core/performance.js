// 衡量性能指标
// CPU，内存，I/O，网络

// CPU
// CPU 负载： 在某个时间段内，占用以及等待 CPU的进程总数
// CPU使用率：CPU时间占用状况，等于 1 - 空闲 CPU时间 / CPU总时间

// Node 一般不会消耗很多CPU，如果 CPU 占用率高，则表明应用存在很多同步操作，导致异步任务回调被阻塞

// 内存是一个非常容易量化的指标
// 内存占用率是评判一个系统的内存瓶颈的常见指标
// 对于 node来说，内部内存堆栈使用状态也是一个可以量化的指标

// node中，一个进程的最大内存容量为 1.5GB。要减少内存泄露
const os = require('os');
// 获取当前 node内存堆栈情况
// rss：node进程占用的内存总量
// heapTotal: 表示堆内存的总量
// heapUsed：实际堆内存的使用量
// external: 外部程序的内存使用量，包含 node核心 C++程序的内存使用量
const { rss, heapUsed, heapTotal, external } = process.memoryUsage();
console.log(rss, heapUsed, heapTotal, external);

// 获取系统空闲内存
const sysFree = os.freemem();
// 获取系统总内存
const sysTotal = os.totalmem();

console.log({
  sys: 1 - sysFree / sysTotal,
  heap: heapUsed / heapTotal,
  node: rss / sysTotal,
});

// 磁盘 I/O
// 硬盘的 IO开销非常昂贵，硬盘 IO花费的 CPU周期是内存的 164000 倍
// 内存 IO 比磁盘 IO 快非常多，所以使用内存缓存数据是有效的优化方法。
// 常用工具 redis，memcached

// 访问频率高，生成代价比较高的数据才考虑是否缓存，即影响性能的瓶颈考虑去缓存
// 缓存还有缓存雪崩，缓存穿透的问题要解决
// 缓存雪崩：同一时间内，缓存中大量的 key同时过期，导致所有请求都直接访问后端数据库，数据库压力剧增

// 缓存穿透：查询不存在的数据，缓存中没有，每次都请求后端数据库，数据库压力剧增
// 为 key设置默认值，比如空对象或错误信息，避免请求穿透到数据库

// 监控
// 借助工具，比如 Easy-Monitor 2.0
// const easyMonitor = require('easy-monitor');
// easyMonitor(' ');

// 优化
// node性能优化方式：
// 1. 使用最新版本 nodejs
// 每个版本的性能提升主要来自：1.v8的版本更新 2. nodejs内部代码的更新优化

// 2. 正确使用流 stream
// node中，很多对象都实现了流，对于一个大文件可以通过流的形式发送，不需要将其完全读入内存
const http = require('http');
const fs = require('fs');
// bad
http.createServer(function (req, res) {
  fs.readFile(__dirname + '/data.txt', function (err, data) {
    res.end(data);
  });
});
// good
http.createServer(function (req, res) {
  const stream = fs.createReadStream(__dirname + '/data.txt');
  stream.pipe(res);
});

// 代码层面优化
// 合并查询，将多次查询合并一次，减少数据库查询次数
// bad
// for user_id in userIds
//  let account = user_account.findOne(user_id)
// // good
// const user_account_map = {} // 注意这个对象消耗大量内存
// user_account.find(user_id in user_ids).forEach(account){
//  user_account_map[account.user_id] = account
// }
// for user_id in userIds
//  var account = user_account_map[user_id]

// 内存管理优化
// 在 v8中，主要讲内存分为新生代和老生代两代
// 新生代：对象的存活时间较短，新生对象或只经过一次垃圾回收的对象
// 老生代：对象存活时间较长，经历过一次或多次垃圾回收的对象

// 若新生代内存空间不够，直接分配到老生代
// 减少内存占用，可以提高服务器性能，如果有内存泄露，也会导致大量对象存储到老生代中，服务器性能大大降低
// const buffer = fs.readFileSync(__dirname + '/source/index.htm');
// app.use(
//   mount('/', async ctx => {
//     ctx.status = 200;
//     ctx.type = 'html';
//     ctx.body = buffer;
//     leak.push(fs.readFileSync(__dirname + '/source/index.htm'));
//   })
// );
// const leak = [];
// leak的内存非常大，造成内存泄露，避免
// 节省内存最好的方式是使用池，将频繁用到，可复用的对象存储起来，减少创建和销毁操作
