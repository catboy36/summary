// react中捕获错误
// react16引入错误边界概念
// 错误边界是react组件，可以捕获发生在其子组件树任何位置的JS错误，并打印这些错误
// 同时展示降级UI，并不会渲染那些发生崩溃的子组件树
// 错误边界在渲染期间，生命周期方法和整个组件树的构造函数中捕获错误
// 使用了 static getDerivedStateFromError()
// 使用了 componentDidCatch()

// 抛出错误后，使用static getDerivedStateFromError()渲染备用ui，使用componentDidCatch()打印错误信息

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }
//   static getDerivedStateFromError(error) {
//     // state UI
//     return { hasError: true };
//   }
//   componentDidCatch(error, errorInfo) {
//     //
//     logErrorToMyService(error, errorInfo);
//   }
//   render() {
//     if (this.state.hasError) {
//       // UI
//       return <h1>Something went wrong.</h1>;
//     }
//     return this.props.children;
//   }
// }

// <ErrorBoundary>
//  <MyWidget />
// </ErrorBoundary>

// 错误边界无法捕获的异常
// 事件处理，异步代码，服务端渲染，自身抛出的错误
// 使用try...catch...
// 监听error事件处理

