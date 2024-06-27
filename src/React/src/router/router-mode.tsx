// react-router模式
// 单页面应用特性：
// 改变url且不让浏览器向服务器发送请求
// 在不刷新页面的前提下，动态改变浏览器地址中的url地址

// 两种模式
// hash模式：在url后面加# --- HashRouter
// history模式：允许操作浏览器的曾经在标签页或框架里访问的会话历史记录 --- BrowserRouter

// 原理
// 路由描述了url与ui之间的映射关系，这种映射是单向的，即URL变化引起UI更新，无需刷新页面
// 以hash模式为例子：
// 改变hash值不会导致浏览器向服务器发送请求，浏览器不发送请求，页面也就不会刷新
// hash改变，触发全局winodw上的hashchange事件，利用hashchange事件监听url变化，进行dom操作模拟页面跳转
// react-router 基于这一特性实现路由跳转

// HashRouter
// 1. HashRouter包裹应用
// 2. window.addEventListener('hashchange', callback)监听hash值的变化，并传递给其嵌套的组件
// 3. 通过context将location数据往后代组件传递：
// import React, { Component } from 'react';
// import { Provider } from './context';
// // Api
// class HashRouter extends Component {
//   constructor() {
//     super();
//     this.state = {
//       location: {
//         pathname: window.location.hash.slice(1) || '/',
//       },
//     };
//   }
//   // url location
//   componentDidMount() {
//     window.location.hash = window.location.hash || '/';
//     window.addEventListener('hashchange', () => {
//       this.setState(
//         {
//           location: {
//             ...this.state.location,
//             pathname: window.location.hash.slice(1) || '/',
//           },
//         },
//         () => console.log(this.state.location)
//       );
//     });
//   }
//   render() {
//     let value = {
//       location: this.state.location,
//     };
//     return <Provider value={value}>{this.props.children}</Provider>;
//   }
// }
// export default HashRouter;


// BrowserRouter
// 1.为window构造onpushstate事件，绑定处理函数
// 2. 重写history.pushState，保证执行history.pushState就会触发onpushState
// 3. 执行history.pushState，页面不重新加载，但location.pathname发送改变后，触发window的onpushstate事件
// 4. onpushstate事件里监听pathname变化，渲染相应的组件
// 5. 前进后退改变url，页面不重新加载，location.pathname变化，触发window.onpopstate事件
// 6. window.onpopstate绑定事件处理函数，监听pathname变化，根据pathname值渲染相应的组件


// route组件
// 通过Router传过来的值，props传进来的path和context传来的pathname进行匹配，决定是否渲染
// import React, { Component } from 'react';
// import { Consumer } from './context';
// const { pathToRegexp } = require('path-to-regexp');
// class Route extends Component {
//   render() {
//     return (
//       <Consumer>
//         {state => {
//           console.log(state);
//           let { path, component: Component } = this.props;
//           let pathname = state.location.pathname;
//           let reg = pathToRegexp(path, [], { end: false });
//           // path pathname
//           if (pathname.match(reg)) {
//             return <Component></Component>;
//           }
//           return null;
//         }}
//       </Consumer>
//     );
//   }
// }
// export default Route;
