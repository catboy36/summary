// 浅拷贝
// 基本类型拷贝值，引用类型拷贝内存地址（拷贝一层）
// Object.assign, Array.prototype.slice, Array.prototype.concat
// 拓展运算符...
function shallowClone(obj) {
  const newObj = {};
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}

// 深拷贝
// 开辟一个新的栈，两个对象完全相同，但是对应不同的地址，修改一个对象属性，不影响另一个
// JSON.stringify => JSON.parse(弊端是会忽略undefined,symbol,函数)
// _.cloneDeep, $.extend
const obj = {
  name: "A",
  name1: undefined,
  name3: function () {},
  name4: Symbol("A"),
};
const obj2 = JSON.parse(JSON.stringify(obj));
console.log(obj2); // {name: "A"}

function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj; // null undefined
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  //
  if (typeof obj !== "object") return obj;
  //
  if (hash.get(obj)) return hash.get(obj);
  let cloneObj = new obj.constructor();
  // constructor, constructor
  hash.set(obj, cloneObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      //
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
