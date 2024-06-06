import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";
import { a, arr, b, c, d, e, f, f1, f2, f3, f4, g, person } from "./core/basic";

// 基本类型
console.log(typeof a);
console.log(typeof b);
console.log(typeof c);
console.log(typeof d);
console.log(typeof e);
console.log(typeof f);
console.log(typeof g);
console.log(typeof person);
console.log(typeof arr);
console.log(typeof f1);
console.log(typeof f2);
console.log(typeof f3);
console.log(typeof f4);
f4(3, 4);
//dom
console.log(document.documentElement);

// == ===
console.log(`'' == '0'`, "" == "0");
console.log(`0 == ''`, 0 == "");
console.log(`'' == '0'`, 0 == "0");

console.log(`false == 'false'`, false == "false");
console.log(`false == 0`, false == "0");

console.log(`false == undefined`, false == undefined);
console.log(`false == null`, false == null);
console.log(`null == undefined`, null == undefined);

console.log(` \t\r\n == 0`, " \t\r\n" == 0);

// typeof instanceof
// instanceof原理
function myInstancof(a, b) {
  if (typeof a !== "object" || a === null) {
    return false;
  }
  let proto = Object.getPrototypeOf(a);
  while (true) {
    if (proto === null) {
      return false;
    }
    if (proto === b.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
}
myInstancof(new Number(3), Number);

// Object.prototype.toString()
Object.prototype.toString({});

function getType(obj) {
  if (typeof obj !== "object") {
    return typeof obj;
  }
  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object (\S+)\]$/, "$1");
}
getType(new Date());
