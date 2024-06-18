// 流，数据传输手段，是端到端信息交换的一种方式，有顺序，逐块读取数据，处理内容
// 用于顺序读取输入或写入输出
// SourceBuffer.pipe(dest)

// 分类
// 可写流，可读流，双工流，转换流
// 可写流：可以写入数据，fs.createWriteStream()
// 可读流：可以写入数据，fs.createReadStream()
// 双工流：既可读又可写 net.Socket
// 转换流：数据写入和读取时修改或转换数据的流

// 双工流
const { Duplex } = require("stream");
const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  },
});

const { Transform } = require("stream");
const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});

// stream的应用场景就是处理IO，http请求和文件操作都是IO
// 将IO操作分段，让数据流起来
// 场景
// get请求返回文件给客户端
const http = require("http");
const server = http.createServer(function (req, res) {
  const method = req.method;
  if (method === "GET") {
    const fileName = path.reslove(__dirname, "data.txt");
    let stream = fs.createReadStream(fileName);
    stream.pipe(res);
  }
});

server.listen(8000);

// 文件操作
const fs = require("fs");
const path = require("path");

const fileName1 = path.resolve(__dirname, "data.txt");
const fileName2 = path.resolve(__dirname, "data-bak.txt");
fs.writeFileSync(fileName1, "67890");
fs.writeFileSync(fileName2, "");

const readStream = fs.createReadStream(fileName1);

const writeStream = fs.createWriteStream(fileName2);

readStream.pipe(writeStream);

readStream.on("end", function () {
  console.log("拷贝完成");
});

// 打包工具底层操作
// 打包和构建过程肯定是文件频繁操作的过程，离不开stream
