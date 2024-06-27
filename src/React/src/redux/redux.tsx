// redux基础与使用
// redux用于数据状态管理
// 推荐react-redux
// react-redux将组件分成：
// 1. 容器组件：存在逻辑处理
// 2. UI组件：只负责显示和交互，内部不处理逻辑，状态外部控制
// redux将整个应用状态存储到store中， 组件可以dispatch(派发) action(行为)给store
// 其他组件通过订阅store中的状态state来更新自身视图

// Provider
{
  /* <Provider store = {store}>
 <App />
</Provider> */
}

// connection
//connect 将store上的getState和dispatch包装成组件的props
// import { connect } from "react-redux";
// connect(mapStateToProps, mapDispatchToProps)(MyComponent)

// mapStateToProps
// 把redux中的数据映射到react中的props中去
// const mapStateToProps = state => {
//   return {
//     // prop : state.xxx | state props
//     foo: state.bar,
//   };
// };
// 组件内部通过props获取store中的数据
// class Foo extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return (
//       // state.bar
//       <div>this.props.foo</div>
//     );
//   }
// }
// Foo = connect()(Foo);
// export default Foo;

// mapDispatchToProps
// 将redux中的dispatch映射到组件内部的props中
// const mapDispatchToProps = dispatch => {
//   // dispatch
//   return {
//     onClick: () => {
//       dispatch({
//         type: 'increatment',
//       });
//     },
//   };
// };

// class Foo extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return <button onClick={this.props.onClick}> increase</button>;
//   }
// }
// Foo = connect()(Foo);
// export default Foo;
