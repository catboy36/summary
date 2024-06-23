import React from "react";

// react事件绑定方式
// render方法使用bind绑定this
class ShowAlert extends React.Component {
  showAlert() {
    console.log("Hi");
  }
  render() {
    return <button onClick={this.showAlert.bind(this)}>show</button>;
  }
}
// render方法使用箭头函数绑定（通过es6上下文将this指向绑定给当前组件）--每次redner都生成新方法，影响性能
class App extends React.Component {
  handleClick(e: React.MouseEvent) {
    console.log("this > ", this, e);
  }
  render() {
    return <div onClick={(e) => this.handleClick(e)}>test</div>;
  }
}

// constructor中bind
// 避免render中重复绑定
interface IProps {}
class App1 extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log("this > ", this);
  }
  render() {
    return <div onClick={this.handleClick}>test</div>;
  }
}

// 定义阶段使用箭头函数绑定

class App2 extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }
  handleClick = () => {
    console.log("this > ", this);
  };
  render() {
    return <div onClick={this.handleClick}>test</div>;
  }
}

// 方式一二简单，三过于繁杂
// 方式一二每次render生成新的实例，性能不好，方式三四只生成一个方法实例

//方式四，定义时箭头函数绑定最优
