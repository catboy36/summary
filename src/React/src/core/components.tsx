// react构建组件方式
// 类，函数

import React from "react";

// 构建方式
// 函数式创建
// React.createClass方法创建
// 继承React.Component创建

// 函数式创建
interface IProps {
  name: string;
}
function HelloComponent(props: IProps): React.ReactElement {
  return <div>Hello {props.name}</div>;
}

// React.createClass方法创建
// 不推荐使用了
function HelloComponent1(props: IProps): React.ReactElement {
  return React.createElement("div", null, "Hello ", props.name);
}

// 继承React.Component创建

// 建议函数式加hooks创建组件，react推崇的，函数式编程
// 能用无状态就用无状态
