// 发布订阅模式
class EventEmitter {
  constructor() {
    // key: 事件名
    // value: callback [] 回调数组
    this.events = {};
  }
  on(name, callback) {
    if (this.events[name]) {
      this.events[name].push(callback);
    } else {
      this.events[name] = [callback];
    }
  }
  off(name, callback) {
    if (!this.events[name]) return;
    if (!callback) {
      // 如果没有callback,就删掉整个事件
      this.events[name] = undefined;
    }
    this.events[name] = this.events[name].filter((item) => item !== callback);
  }
  emit(name, ...args) {
    if (!this.events[name]) return;
    this.events[name].forEach((cb) => cb(...args));
  }
}

// 观察者模式
class Observerd {
  constructor() {
    // 我要看看到底有多少人在观察俺
    this.observerList = [];
  }
  addObserver(observer) {
    // 添加一个观察俺的人
    this.observerList.push(observer);
  }
  notify() {
    // 我要闹点动静，所有观察者都会知道这个信息，具体怎么做就是他们自己的事情了
    this.observerList.forEach((observer) => observer.update());
  }
}

class Observer {
  constructor(doSome) {
    // 观察到小白鼠有动静之后，观察者做的事情
    this.doSome = doSome;
  }
  update() {
    console.log(this.doSome);
  }
}

const ob1 = new Observer(
  "我是ob1，我观察到小白鼠有反应了，太饿了，我得去吃个饭了"
);
const ob2 = new Observer("我是ob2，我观察到小白鼠有反应了，我要继续工作！");
const xiaoBaiShu = new Observerd();
xiaoBaiShu.addObserver(ob1);
xiaoBaiShu.addObserver(ob2);
xiaoBaiShu.notify(); // .... ....

// 洗牌函数
const shuffle = (arr) => {
  const res = [...arr];
  for (let i = 0; i < res, length - 1; i++) {
    const index = Math.floor(Math.random * i);
    [res[index], res[i + 1]] = [res[i + 1], res[index]];
  }
  return res;
};
