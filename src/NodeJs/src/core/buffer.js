// Buffer是在内存开辟一片区域（初次初始化为 8kb），用来存放二进制数据
// 可以理解成一个数组，数组每一项，都可以保存 8 位二进制 00000000，即一个字节

const buffer = Buffer.from('why');

// Buffer.from()
const b1 = Buffer.from('10');
const b2 = Buffer.from('10', 'utf8');
const b3 = Buffer.from([10]);
const b4 = Buffer.from(b3);
const str = b1.toString();
console.log(b1, b2, b3, b4, str);

// Buffer.alloc()
const bAlloc1 = Buffer.alloc(10); // 创建大小为 10 字节的缓冲区
const bAlloc2 = Buffer.alloc(10, 1); // 长度 10 字节，全部填充 1
const str1 = bAlloc2.toString();

console.log(bAlloc1, bAlloc2, str1);

// Buffer应用常常和流的概念联系在一起
// I/O 操作，加密解密，zlib.js
// const fs = require('fs');
// const inputStream = fs.createReadStream('input.txt'); //
// const outputStream = fs.createWriteStream('output.txt'); //
// inputStream.pipe(outputStream);

// 加密解密

// zlib.js
// nodejs的核心库，利用缓冲区（Buffer）的功能来操作二进制数据流，提供了压缩或解压功能
