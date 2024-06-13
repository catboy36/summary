// 装饰器
// 装饰者模式：不改变原类和使用继承的基础上，动态地扩展对象功能的设计

function strong(target) {
  target.AK = true;
}

@strong
class Solider {}

// 类装饰
@strong
class Solider {}

class Solider {}

Solider = strong(Solider) || Solider;

function test(data) {
  return (target) => {
    target.data = data;
  };
}

@test({ username: "xxx", age: 28 })
class MyClass {}

console.log(MyClass.data);

// 类属性装饰
// 如果一个方法有多个装饰器，从外到内进入，从内到外执行
function dec(id) {
  console.log("evaluated", id);
  return (target, property, descriptor) => console.log("executed", id);
}
class Example {
  @dec(1)
  @dec(2)
  method() {}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1


// 装饰器不能修饰函数，因为函数存在变量声明
