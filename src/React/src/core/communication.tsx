// react组件间通信
// 组件间通信即指组件通过某种方式来传递信息以达到某个目的
// 用于react单向数据流，主要思想是组件不会改变接收的数据，只会监听数据变化，当数据发生变化时，接收新值，不修改已有的值

import { Component } from 'react';
import * as React from 'React';

// 父组件向子组件传递
// react单项数据流，父组件向子组件传递是最常见的方式
// props
interface IProps {
  email: string;
}
function EmailInput(props: IProps) {
  return (
    <label>
      Email: <input value={props.email} />
    </label>
  );
}
const element = <EmailInput email="123124132@163.com" />;

// 子组件向父组件传递
// 思路：父组件向子组件传递一个函数，然后通过这个函数的回调，拿到子组件传来的数据
interface IState {
  price: number;
}
interface IProps1 {
  getPrice: (e: number) => void;
}
class Parents extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      price: 0,
    };
  }
  getItemPrice(e: number) {
    this.setState({
      price: e,
    });
  }
  render() {
    return (
      <div>
        <div>price: {this.state.price}</div>
        {/* */}
        <Child getPrice={this.getItemPrice.bind(this)} />
      </div>
    );
  }
}

class Child extends Component<IProps1> {
  clickGoods(e: number) {
    this.props.getPrice(e);
  }
  render() {
    return (
      <div>
        <button onClick={this.clickGoods.bind(this, 100)}>goods1</button>
        <button onClick={this.clickGoods.bind(this, 1000)}>goods2</button>
      </div>
    );
  }
}

// 兄弟组件之间通信
// 父组件作为中间层来实现数据互通，通过父组件传递
interface MyProps {}
interface MyState {
  count: number;
}
class Parent extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = { count: 0 };
  }
  setCount = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return (
      <div>
        {/* <SiblingA count={this.state.count} />
        <SiblingB onClick={this.setCount} /> */}
      </div>
    );
  }
}

// 父组件向后代组件传递
// 使用context
// 创建成功后，其下存在Provider组件用于创建数据源，Consumer组件用于接收数据
// Provider组件通过value属性用于给后代组件传递数据
// const PriceContext = React.createContext('price')
// <PriceContext.Provider value={100}>
// </PriceContext.Provider>
// 通过Consumer组件或contextType属性接受Provide传递的数据
// class MyClass extends React.Component {
//   static contextType = PriceContext;
//   render() {
//     let price = this.context;
//     /* */
//   }
// }
// Consumer组件
{
  /* <PriceContext.Consumer> */
}
{
  /*  这里是一个函数 */
}
{
  /* {price => <div>price {price}</div>} */
}
{
  /* </PriceContext.Consumer>; */
}

// 非关系组件传递
// 全局资源管理，如redux
