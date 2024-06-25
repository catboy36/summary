// Real DOM 文档对象模型
// virtual dom 本质上是以javascript对象形式存在的对dom的描述
// 创建虚拟dom目的是为了更好的将虚拟节点渲染到页面视图中，虚拟dom对象的节点与真实dom的属性一一对应
// jsx可以在js中通过XML的方式去直接声明界面dom结构
// jsx是一种语法糖，会被babel编译转化为js代码

// h1
// const vDom = <h1>Hello World</h1>;
// // <div id="root"></div>
// const root = document.getElementById("root");
// // h1 root
// ReactDOM.render(vDom, root);

// react17之前，手动引入React的原因，17之后，编辑器react/jsx-runtime包自动一如jsx函数并调用，不需手动引入React

// const vDom = React.createElement(
//     'h1'
//     { className: 'hClass', id: 'hId' },
//     'hello world'
//    )

// 由编译器引入（禁止自己引入！） react17
// import { jsx as _jsx } from 'react/jsx-runtime';

// function App() {
//   return _jsx('h1', { children: 'Hello world' });
// }

// 真实dom和虚拟dom区别
// 虚拟dom不会排版重绘，真实dom会频繁重排与重绘
// 虚拟dom的总损耗是 虚拟dom增删改 + 真实dom差异增删改 + 排版重绘，真实dom总损耗是 真实dom完全增删改 + 排版与重绘

// 优缺点
// 真实dom：
// 优点：易用
// 缺点：效率低，解析慢，内存占用过高，性能差，频繁操作dom，大量的重绘和回流

// 虚拟dom:
// 优点：简单方便，性能好（VDOM有效避免真实dom频繁更新，减少重绘回流），跨平台（VDOM，跨平台能力，一套代码多端运行）
// 缺点： 一些性能要求极高的应用中，VDOM无法进行针对性的极致优化
// 首次渲染大量dom时，由于多了一层虚拟dom的计算，速度比正常稍慢
