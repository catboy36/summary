// 性能优化
// 1.避免使用内联函数
// 使用内联函数，每次render都会创建一个新的函数实例

// 2. 使用react  Fragments避免额外的标记
// export default class NestedRoutingComponent extends React.Component {
//   render() {
//     return (
//       <>
//         <h1>This is the Header Component</h1>
//         <h2>Welcome To Demo Page</h2>
//       </>
//     );
//   }
// }

// 3. 使用immutable
// shouldComponentUpdate
// immutable通过is方法完成对比，无需通过深度比较的方式比较

// 4. 懒加载组件
// Suspense和lazy实现
// const johanComponent = React.lazy(
//   () =>
//     import(
//       /* webpackChunkName: "johanC
//     omponent" */ "./myAwesome.component"
//     )
// );
// export const johanAsyncComponent = (props) => (
//   <React.Suspense fallback={<Spinner />}>
//     <johanComponent {...props} />
//   </React.Suspense>
// );

// 5. 事件绑定方式
// constructor中bind事件和定义阶段使用箭头函数，都只生成一个方法实例，性能有所改善

// 6. 服务端渲染
// node服务，调用react的renderToString方法，将根组件渲染成字符串，在输出到响应中
// import { renderToString } from "react-dom/server";
// import MyPage from "./MyPage";
// app.get("/", (req, res) => {
//  res.write("<!DOCTYPE html><html><head><title>My Page</title></head><body
// >");
//  res.write("<div id='content'>");
//  res.write(renderToString(<MyPage/>));
//  res.write("</div></body></html>");
//  res.end();
// });
// 客户端调用render方法生成html
// import ReactDOM from 'react-dom';
// import MyPage from "./MyPage";
// ReactDOM.render(<MyPage />, document.getElementById('app'));
// 7. 组件拆分，合理使用hooks

// 优化分三个层面
// 代码层面，工程层面，框架机制层面
