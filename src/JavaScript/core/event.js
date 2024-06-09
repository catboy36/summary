// 事件与事件流
// 事件捕获阶段，处于目标阶段，事件冒泡阶段

// 事件模型
// 原始事件模型（DOM0级）
// html代码直接绑定，js代码绑定（on）
// 绑定速度快，不支持捕获，同一类型事件只能绑定一次，设置为null删除
// btn.onclick = null;

// 标准事件模型（DOM2级）
// addEventListener(eventType, handler, useCapture)
// removeEventListener(eventType, handler, useCapture)
// 同一类型事件可以绑定多个，useCapture决定是否捕获阶段执行

// IE事件模型（基本不用）
// 事件处理阶段，事件冒泡阶段
// attachEvent(eventType, handler)
// detachEvent(eventType, handler)

// 事件代理
// 冒泡阶段
// 减少也没所需内存，提升整体性能，动态绑定，减少重复工作
// focus，blur没有冒泡机制，不能代理
// mousemove,mouseout需要不断通过位置计算定位，性能消耗高，不适合代理

// 闭包
// 一个函数和对其周围状态（词法环境）的引用捆绑在一起（函数被引用包围），这样的组合就是闭包
// 闭包作为函数内部与外部连接在一起的一座桥梁

// 使用场景：创建私有变量，延长变量的生命周期

// 柯里化函数
// 频繁调用具有相同参数函数的同时，又能轻松的重用
//
function getArea(width, height) {
  return width * height;
}
// 10
const area1 = getArea(10, 20);
const area2 = getArea(10, 30);
const area3 = getArea(10, 40);
//
function getArea(width) {
  return (height) => {
    return width * height;
  };
}
const getTenWidthArea = getArea(10);
// 10
const area4 = getTenWidthArea(20);
//
const getTwentyWidthArea = getArea(20);
