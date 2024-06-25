// Fiber架构
// JS引擎和页面渲染引擎两个线程互斥，其中一个线程执行时，另一个线程只能挂起等待

// 是什么
// 1.为每个任务增加优先级，优先级高的任务可以中断低优先级的任务，然后再重新，注意是重新执行优先级低的任务
// 2.增加了异步任务，调用requestIdleCallback api,浏览器空闲时执行
// 3. dom diff树变成了链表，一个dom对应两个fiber（一个链表），两个队列，都是为了找到被中断的任务，重新执行
// 架构角度：fiber是对react核心算法（调和过程）的重写
// 编码角度：fiber是react内部定义的一种数据结构，是fiber树结构的节点单位，也是react16新架构下的虚拟dom

// 一个fiber就是一个js对象，包含元素信息，元素的更新队列，类型

type Fiber = {
  // fiber WorkTag fiber FunctionComponent ClassComponent
  tag: WorkTag;
  // ReactElement key
  key: null | string;
  // ReactElement.type `createElement`
  elementType: any;
  // The resolved function/class/ associated with this fiber.
  //
  type: any;
  // FiberNode element
  stateNode: any;
  // Fiber `parent`
  return: Fiber | null;
  //
  child: Fiber | null;
  // return
  sibling: Fiber | null;
  index: number;
  ref: null | (((handle: mixed) => void) & { _stringRef: ?string }) | RefObject;
  // props
  pendingProps: any;
  // props
  memoizedProps: any;
  // Fiber Update
  updateQueue: UpdateQueue<any> | null;
  // state
  memoizedState: any;
  // Fiber context
  firstContextDependency: ContextDependency<mixed> | null;
  mode: TypeOfMode;
  // Effect
  // Side Effect
  effectTag: SideEffectTag;
  // side effect
  nextEffect: Fiber | null;
  // side effect
  firstEffect: Fiber | null;
  // side effect
  lastEffect: Fiber | null;
  // 后续版本改为lanes
  expirationTime: ExpirationTime;
  //
  childExpirationTime: ExpirationTime;
  // fiber版本池，记录fiber更新过程，便于恢复
  alternate: Fiber | null;
};

// fiber把渲染过程拆分为多个子任务，每次做一小部分，昨晚看是否还有剩余时间，如果有继续下一个任务；如果没有
// ，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候继续执行即可中断与恢复，恢复后也可以复用之前的中间状态
// ，并给不同任务赋予不同的优先级，其中每个任务更新单元为react element对应的fiber节点

// 实现上述方式的是 window.requestIdleCallback()方法
// 其将在浏览器空闲时段内调用的函数排队，使开发者能够在主事件循环上执行后台和低优先级工作，而不用影响延迟关键事件，如动画和输入响应

// 合作式调度

// 每一个fiber节点对应一个React Element，保存了该组件的类型（函数组件/类组件/原生组件等等），对应的dom节点信息等
// 作为动态工作单元来说，每个fiber节点保存了本次更新中该组件改变的状态，要执行的工作
// 每个fiber节点有个对应的react element，多个fiber节点根据如下属性构建一棵树


// // 指向父级Fiber节点
// this.return = null
// // 指向子Fiber节点
// this.child = null
// // 指向右边第一个兄弟Fiber节点
// this.sibling = null