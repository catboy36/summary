// fileSystem 该模块提供本地文件读写能力，基本上是 POSIX文件操作命令的简单包装
// 对所有文件系统操作提供异步和同步（sync后缀）两种操作方式
const fs = require('fs');
// 文件相关

// 权限位 mode
// 文件所有者，文件所属组，其它用户进行权限分配，分为读，写，执行，具备权限为 4,2,1，不具备权限为 0
// drwxr-xr-x 1 PandaShen 197121 0 Jun 28 14:41 core （d为文件夹，-为文件，后九位依次读写执行权限）

// 标识符
// 文件描述符号 fd

// 方法
// 文件读取
// 第一个参数为读取文件的路径或文件描述符
// 第二个参数为 options，默认为 null，其中有编码和标识位，标识符flag默认为（r)，也可直接传人编码s
// let buf = fs.readFileSync('1.txt');
// let data = fs.readFileSync('1.txt', 'utf8');

// 异步的
// fs.readFile('1.txt', 'utf8', (err, data) => {
//   if (!err) {
//     console.log(data); // Hello
//   }
// });

// 文件写入
fs.writeFileSync('2.txt', 'Hello world');
let data1 = fs.readFileSync('2.txt', 'utf8');
console.log(data1); // Hello world

fs.writeFile('1.txt', '666 node', err => {
  if (!err) {
    fs.readFile('1.txt', 'utf8', (err, data) => {
      console.log(data);
    });
  }
});

// 文件追加写入
// appendFileSync
fs.appendFileSync('3.txt', ' word');
let data2 = fs.readFileSync('3.txt', 'utf8');

fs.appendFile('3.txt', ' world34', err => {
  if (!err) {
    fs.readFile('3.txt', 'utf8', (err, data) => {
      console.log(data); // Hello world
    });
  }
});

// 文件拷贝
fs.copyFileSync('3.txt', '4.txt');
let data3 = fs.readFileSync('4.txt', 'utf8');
console.log(data3);

fs.copyFile('3.txt', '4.txt', () => {
  fs.readFile('4.txt', 'utf8', (err, data) => {
    console.log(data); // Hello world
  });
});

// 创建目录
// fs.mkdirSync('src/test');

// fs.mkdir('a/b/c', err => {
//   if (!err) console.log(' ');
// });
