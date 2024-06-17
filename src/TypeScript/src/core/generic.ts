// 泛型
// 泛型允许在编写代码时，使用一些以后才指定的类型，在实例化时作为参数指明这些类型
// 不预先定义好具体类型，而在使用时候再指定一定类型的一种特性

// 函数声明
function returnItem<T>(param: T): T {
  return param;
}

function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

// 接口声明
interface IReturnItemFn<T> {
  (param: T): T;
}
const returnItemFn: IReturnItemFn<number> = para => para;
