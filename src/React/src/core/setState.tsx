// react中setState执行机制
// state为组件内部数据状态
// 修改状态调用setState，达到更新组件内部数据的作用
// 直接修改state值，state状态确实改变，但是不触发页面渲染更新

// import React, { Component } from 'react';
// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       message: 'Hello World',
//     };
//   }
//   render() {
//     return (
//       <div>
//         <h2>{this.state.message}</h2>
//         <button onClick={e => this.changeText()}> </button>
//       </div>
//     );
//   }
//   changeText() {
//     this.setState({
//       message: 'JS ',
//     });
//   }
// }

// setState源码定义
// Component.prototype.setState = function (partialState, callback) {
//   invariant(
//     typeof partialState === 'object' || typeof partialState === 'function' || partialState == null,
//     'setState(...): takes an object of state variables to update or a ' +
//       'function which returns an object of state variables.'
//   );
//   this.updater.enqueueSetState(this, partialState, callback, 'setState');
// };

// setState更新类型
// 异步更新（第二个参数回调中获取更新后的内容）
// changeText() {
//     this.setState({
//     message: " "
//     }, () => {
//     console.log(this.state.message); //
//     });
//    }

// 同步更新
// setTimeout中，dom事件（原生事件）中 setState同步更新

// 在组件生命周期或react合成事件中，setState是异步
// setTimeout或者dom事件中，setState是同步

// 批量更新
// handleClick = () => {
//   this.setState({
//     count: this.state.count + 1,
//   });
//   console.log(this.state.count); // 1
//   this.setState({
//     count: this.state.count + 1,
//   });
//   console.log(this.state.count); // 1
//   this.setState({
//     count: this.state.count + 1,
//   });
//   console.log(this.state.count); // 1
// };
// 等同于
// Object.assign(
//     previousState,
//     {index: state.count+ 1},
//     {index: state.count+ 1},
//     ...
//    )

// 如果下一个state依赖前一个state，推荐setState一个参数传入一个function
// onClick = () => {
//   this.setState((prevState, props) => {
//     return { count: prevState.count + 1 };
//   });
//   this.setState((prevState, props) => {
//     return { count: prevState.count + 1 };
//   });
// };

// setTimeout和原生dom事件中，由于是同步操作，不会进行覆盖现象
