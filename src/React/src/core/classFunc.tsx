// 类组件：ES6类的编写方式，必须继承React.Component/PureComponent
// 必须实现render方法

import { ReactElement } from "react";

// 函数组件
interface FnProps {
  name: string;
}
export function Welcome(props: FnProps): ReactElement {
  return <h1>Hello, {props.name}</h1>;
}

// 区别
// 编写方式
// 状态管理：
// 类组件：state/setState
// 函数组件：hooks

// 声明周期
// 类组件有生命周期
// 函数组件useEffect可以实现声明周期功能

// 调用方式
// 函数组件，调用执行即可
// function SayHi() {
//   return <p>Hello, React</p>;
// }
// // React 内部
// const result = SayHi(props);
// 类组件需要实例化，然后调用实例对象render方法

// class SayHi extends React.Component {
//   render() {
//     return <p>Hello, React</p>;
//   }
// }
// // React 内部
// const instance = new SayHi(props); // » SayHi {}
// const result = instance.render(); // » <p>Hello, React</p >

// 获取渲染的值
// 类组件，this会变，this.prop会变
// 函数组件，没有this，props不变
// function ProfilePage(props) {
//   const showMessage = () => {
//     alert("Followed " + props.user);
//   };
//   const handleClick = () => {
//     setTimeout(showMessage, 3000);
//   };
//   return <button onClick={handleClick}>Follow</button>;
// }

// class ProfilePage extends React.Component {
//   showMessage() {
//     alert("Followed " + this.props.user);
//   }
//   handleClick() {
//     setTimeout(this.showMessage.bind(this), 3000);
//   }
//   render() {
//     return <button onClick={this.handleClick.bind(this)}>Follow</button>;
//   }
// }
