// 模块化
// 代码抽象，代码封装，代码复用，依赖管理

// AMD
// Asynchronous ModuleDefinition 异步模块定义，异步方式加载模块，定义回调函数，模块价值完成后执行
// require.js 代表库

// CommonJS
// 服务端
// 所有代码运行在模块作用域，不污染全局，模块同步加载，只有加载完成，才能执行后续操作
// 模块首次执行后会缓存，再次加载只返回缓存结果，如想再次执行，可清除缓存
// require返回的值是被输出值的拷贝，模块内部变化也不影响这个值
// a.js
// module.exports = { foo, bar };
// b.js
// const { foo, bar } = require('./a.js');

// CommonJS和 AMD模块，都只能在运行时确定模块依赖关系，输入输出变量

// ES6模块，编译时确定模块依赖管辖，以及输入输出变量
// 编译时加载，使得静态分析成为可能，ts就是依靠静态分析实现功能

// export
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
// 建议下方写法，清晰直观
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;
export { firstName, lastName, year };

export function multiply(x, y) {
  return x * y;
}

function v1() {}
function v2() {}

export { v1 as streamV1, v2 as streamV2, v2 as streamLatestVersion };

export default function () {}

// import
// 输入变量都是只读的，不允许修改，对象允许修改属性
// 多次重复 import同一个模块，只会执行一次
// 对于默认导出，import可以为其指定任意名字
// import { lastName as surname } from './profile.js';

// 动态加载
import('/modules/myModule.mjs').then(module => {
  // Do something with the module.
});

// 复合写法
export { foo, bar } from 'my_module';
