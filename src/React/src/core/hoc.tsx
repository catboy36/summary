// 高阶函数（Higher-order function）
// 至少满足一个条件：接收一个或多个函数作为输入，输出一个函数

import React from 'react';

// React HOC:（本质装饰者模式）
// 接收一个或多个组件作为参数，返回一个组件
// const EnhancedComponent = highOrderComponent(WrappedComponent);

// import React, { Component } from 'react';
// export default (WrappedComponent) => {
//  return class EnhancedComponent extends Component {
//  // do something
//  render() {
//  return <WrappedComponent />;
//  }
//  }

// 把通用的逻辑放在高阶组件中，对组件实现一致的处理，从而实现代码复用
// HOC主要功能就是封装并分离组件通用逻辑，让通用逻辑在组件间更好地复用

// 使用HOC时，遵循一些约定：
// props保持一致
// 不能载函数式组件上使用ref
// 不改变原始WrappedComponent
// 透传不相关props属性给被包裹的组件WrappedComponent
// 不要在render方法中使用高阶组件
// 使用compose组合高阶组件
// 包装显示名字便于调试

// 高阶组件可以传递所有props，但是不能传递ref
// 如果向一个高阶组件传递ref引用，那么ref指向的是最外层容器组件实例，而不是被包裹的组件，如果需要传递refs：
// function withLogging(WrappedComponent) {
//   class Enhance extends WrappedComponent {
//     componentWillReceiveProps() {
//       console.log('Current props', this.props);
//       console.log('Next props', nextProps);
//     }
//     render() {
//       const { forwardedRef, ...rest } = this.props;
//       // forwardedRef ref
//       return <WrappedComponent {...rest} ref={forwardedRef} />;
//     }
//   }
//   // React.forwardRef props ref
//   // ref React.forwardRef
//   function forwardRef(props, ref) {
//     return <Enhance {...props} forwardRef={ref} />;
//   }
//   return React.forwardRef(forwardRef);
// }
// const EnhancedComponent = withLogging(SomeComponent);

// HOC获取缓存数据
// import { Component } from 'react';
// interface IProps {}
// interface IState {}
// function withPersistentData(WrappedComponent: React.ComponentElement<IProps, IState>) {
//   return class extends Component {
//     constructor(props: IProps) {
//       super(props);
//       this.state = {
//         data: '',
//       };
//     }
//     componentWillMount() {
//       let data = localStorage.getItem('data');
//       this.setState({ data });
//     }

//     render() {
//       // {...this.props} WrappedComponent;
//       return <WrappedComponent data={this.state.data} {...this.props} />;
//     }
//   };
// }
// class MyComponent2 extends Component {
//   render() {
//     return <div>{this.props.data}</div>;
//   }
// }
// const MyComponentWithPersistentData = withPersistentData(MyComponent2);

// 性能监控HOC
// class Home extends React.Component {
//   render() {
//     return <h1>Hello World.</h1>;
//   }
// }
// function withTiming(WrappedComponent) {
//   return class extends WrappedComponent {
//     constructor(props) {
//       super(props);
//       this.start = 0;
//       this.end = 0;
//     }
//     componentWillMount() {
//       super.componentWillMount && super.componentWillMount();
//       this.start = Date.now();
//     }
//     componentDidMount() {
//       super.componentDidMount && super.componentDidMount();
//       this.end = Date.now();
//       console.log(`${WrappedComponent.name} ${this.end - this.start} ms`);
//     }
//     render() {
//       return super.render();
//     }
//   };
// }
// export default withTiming(Home);
