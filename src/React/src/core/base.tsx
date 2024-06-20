import React, { useState } from "react";
import ReactDOM from "react-dom";

interface IProps {
  name?: string;
}

interface IState {
  age: number;
}

// react
class HelloMessage extends React.Component<IProps, IState> {
  state = {
    age: 18,
  };
  render() {
    return (
      <div>
        Hello {this.props.name} {this.state.age}
      </div>
    );
  }
}
ReactDOM.render(
  <HelloMessage name="Taylor" />,
  document.getElementById("hello-example")
);

// 特性：
// JSX语法
// 单向数据绑定
// 虚拟dom
// 声明式编程(关注要做什么，而不是如何做)
// Component

interface FnProps {
  name?: string;
}

export const Header: React.FC<FnProps> = (props) => {
  const [age, setAge] = useState<number>(8);
  return (
    <h1 onClick={() => setAge(12)}>
      {props.name} {age}
    </h1>
  );
};

// react优势： 高效灵活，声明式设计，简单使用，组件式开发，提高代码复用率，单向相应的数据流比双向绑定的更安全，速度更快
