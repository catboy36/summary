// Node采用事件驱动机制，EventEmitter就是Node实现事件驱动的基础
// 在EventEmitter基础上，Node几乎所有模块都继承了这个类，这些模块拥有自己的事件
// 可以绑定/触发监听器，实现异步操作

// events模块只提供了一个EventEmitter类，实现了Node异步事件驱动架构的基本模式
// 观察者模式

const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

function cb() {
  console.log("trigger event");
}

// myEmitter.on("event", cb);
myEmitter.once("event", cb);
myEmitter.emit("event");
myEmitter.removeListener("event", cb);

class MyEventEmitter {
  constructor() {
    this.events = {};
  }
  on(type, handler) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(handler);
  }
  addListener(type, handler) {
    this.on(type, handler);
  }
  prependListener(type, handler) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].unshift(handler);
  }
  removeListener(type, handler) {
    if (!this.events[type]) {
      return;
    }
    this.events[type] = this.events[type].filter((item) => item !== handler);
  }
  off(type, handler) {
    this.removeListener(type, handler);
  }
  emit(type, ...args) {
    this.events[type].forEach((item) => {
      Reflect.apply(item, this, args);
    });
  }
  once(type, handler) {
    this.on(type, this._onceWrap(type, handler, this));
  }
  _onceWrap(type, handler, target) {
    const state = { fired: false, handler, type, target };
    const wrapFn = this._onceWrapper.bind(state);
    state.wrapFn = wrapFn;
    return wrapFn;
  }
  _onceWrapper(...args) {
    if (!this.fired) {
      this.fired = true;
      Reflect.apply(this.handler, this.target, args);
      this.target.off(this.type, this.wrapFn);
    }
  }
}

const ee = new MyEventEmitter();
// 
ee.once('wakeUp', (name) => { console.log(`${name} 1`); });
ee.on('eat', (name) => { console.log(`${name} 2`) });
ee.on('eat', (name) => { console.log(`${name} 3`) });
const meetingFn = (name) => { console.log(`${name} 4`) };
ee.on('work', meetingFn);
ee.on('work', (name) => { console.log(`${name} 5`) });
ee.emit('wakeUp', 'xx');
ee.emit('wakeUp', 'xx'); // 
ee.emit('eat', 'xx');
ee.emit('work', 'xx');
ee.off('work', meetingFn); // 
ee.emit('work', 'xx');