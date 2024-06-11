// 浮点数精度丢失
// js存储双精度浮点数，长度 8 字节，即 64byte
// 计算机存储双精度浮点数需要先把十进制数转换为二进制的科学计数法刑事，然后以
// 符号位 + （指数位 + 指数偏移量的二进制） + 小数部分 存储二进制科学计数法

// 因为存储时有位数限制（64 位），且某些十进制浮点数转换为二进制时会出现无限循环，会造成二进制的舍入操作（0舍1入）
// 当再转换为十进制时就造成计算误差

/**
 * 精确加法
 */
function add(num1, num2) {
  const digits1 = num1?.toString?.().split?.('.')?.[1]?.length;
  const digits2 = num2?.toString?.().split?.('.')?.[1]?.length;
  const base = Math.pow(10, Math.max(digits1, digits2));
  return (num1 * base + num2 * base) / base;
}
