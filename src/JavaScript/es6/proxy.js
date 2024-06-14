// Proxy
// 用于定义基本操作的自定义行为
// 修改的是程序默认行为，形同编程语言层面上做修改，属于元编程（meta programming）

// 创建一个对象的代理，实现基本操作的拦截和自定义

// const proxy = new Proxy(target, handler)
// handler拦截属性
// get,set,has,deleteProperty,ownKeys,getOwnPropertyDescriptor,defineProperty
// preventExtensions, getPrototypeOf, isExtensible,setPrototypeOf, apply
// construct

// 如需在 Proxy内部调用对象的默认行为，建议使用 Reflect
// 特点：
// 只要 proxy 对象具有代理的方法，Reflect对象全部具有，静态方法的形式存在
// 修改某些 Object 方法的返回结果，让其变得更合理（定义不存在属性行为时不报错，而是返回false）
// 让 Object操作都变成函数式

// get()
// 如果一个属性不可配置，不可写，则 proxy 不能修改该属性
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    },
  };
  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}
let arr = createArray('a', 'b', 'c');
arr[-1];

// set()
// 如果目标对象自身某个属性不可写不可配置，set不起作用
// 严格模式下，set代理没有返回 true，会报错
let validator = {
  set: function (obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }
    // age
    obj[prop] = value;
  },
};
let person = new Proxy({}, validator);
person.age = 100;

// deleteProperty
// 拦截 delete操作，方法抛出错误或 返回false，当前属性就无法删除
var handler = {
  deleteProperty(target, key) {
    invariant(key, 'delete');
    Reflect.deleteProperty(target, key);
    return true;
  },
};
function invariant(key, action) {
  if (key[0] === '_') {
    throw new Error(`无法删除私有属性`);
  }
}
var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
delete proxy._prop;

// 取消代理
// Proxy.revocable(target, handler)

// 使用场景
// 拦截和监视外部对象的访问
// 降低函数或类的复杂度
// 在复杂操作前对操作进行校验或对所需资源进行管理



// 使用 proxy 实现观察者模式
// 函数自动观察数据对象，一旦有变化，函数自动执行

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queueObservers.forEach(observer => observer());
  return result;
}

// 一个队列存储观察者函数列表
const queueObservers = new Set();

// 往队列里添加观察者函数
const observe = fn => queueObservers.add(fn);

// 代理对象，修改 set操作，每次 set，循环执行观察者队列所有方法
const observable = obj => new Proxy(obj, { set });
