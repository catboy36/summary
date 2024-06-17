// 枚举：一个被命名的整数型常数集合， 用于声明一组命名的常数
// 两种形式
enum Fruit {
  apple = 1,
  banana = 2,
}

// let d: Direction;

// 枚举值默认从 0 开始递增
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}
console.log(Direction.Up === 0); // true
console.log(Direction.Down === 1); // true
console.log(Direction.Left === 2); // true
console.log(Direction.Right === 3); // true

enum Direction1 {
  Up = 10,
  Down,
  Left,
  Right,
}

// 字符串枚举
// 如果设定了一个变量为字符串后，后续字段必须赋值，否则报错
enum Direction2 {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

// 异构枚举
// 将数字枚举和字符串枚举结合起来混合起来使用
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = 'YES',
}

// 本质
// enum Direction3 {
//   Up,
//   Down,
//   Left,
//   Right,
// }

// var Direction3;
// (function (Direction) {
//   Direction[(Direction['Up'] = 0)] = 'UP';
//   Direction[Direction["Down"] = 1] = "Down";
//   Direction[Direction["Left"] = 2] = "Left";
//   Direction[Direction["Right"] = 3] = "Right";
// })(Direction3 || {});

// 可通过正反映射拿到对应值
enum Direction4 {
  Up,
  Down,
  Left,
  Right,
}
console.log(Direction4.Up === 0); // true
console.log(Direction4[0]); // Up

// 多处定义的枚举是可以进行合并操作的var Direction;
// (function (Direction) {
//   Direction['Up'] = 'Up';
//   Direction['Down'] = 'Down';
//   Direction['Left'] = 'Left';
//   Direction['Right'] = 'Right';
// })(Direction || (Direction = {}));
// (function (Direction) {
//   Direction[(Direction['Center'] = 1)] = 'Center';
// })(Direction || (Direction = {}));
