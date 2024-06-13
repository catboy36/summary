// Set 集合，不会重复，没有顺序，无关联

// Map 字典，每个元素key: value

// Set
const set = new Set();

set.add(3).add(4).add(3);
set.delete(3);
set.has(3);
set.clear();

set.size;

// 遍历
// keys, values, entries, forEach(fn, thisObj)
var arr = [...new Set([3, 4, 3, 4, 5])];

// Map
const map = new Map();
map.set("userName", "lhy");
map.get("userName");
map.has("userName");
map.delete("userName");
map.clear();

// 遍历
// keys, values, entries, forEach(fn, thisObj)

map.size;

// WeakMap
// 与Map区别：没有遍历操作api，没有clear方法, 只接受对象,Symbol作为键名
// key不需要了，键名和键值会自动消失，不用手动删除引用
const w1 = new WeakMap();

const wm = new WeakMap();
let key = {};
let obj = { foo: 1 };
wm.set(key, obj);
obj = null;
wm.get(key);
// Object {foo: 1}

// WeakSet
// 与set区别：没有遍历操作api，没有clear方法, 只接受对象,Symbol作为键名
// 存储的都是弱引用，不需要的时候自动清除
