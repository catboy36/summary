// 生成器

function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

const he = helloWorldGenerator();
he[Symbol.iterator]() === he;

// yield关键字可以暂停 generator函数返回的遍历器对象状态
he.next();
he.next();
he.next();
he.next();

// next方法可以带一个参数，该参数被当做上一个 yield表达式的返回值
function* foo(x) {
  let y = 2 * (yield x + 1);
  let z = yield y / 3;
  console.log('xyz>>>', x, y, z);
  return x + y + z;
}

const f = foo(5);

function* foo1() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}
for (let v of foo1()) {
  console.log(v);
}
// 1,2,3,4,5

function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);
  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}
let jane = { first: 'Jane', last: 'Doe' };
for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
//
