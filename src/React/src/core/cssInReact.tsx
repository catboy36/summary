// css应该局部不污染全局
// 可以编写动态css
// 支持所有css特性
// 简洁，符合一贯css风格特点

// 方式

// 1. 在组件内直接使用
// 使用驼峰
// 优点：1.内联样式，样式间不冲突
// 2. 可以动态获取当前state中的状态
// 缺点和注意：1.驼峰2.某些样式没有提示3.大量内联样式，代码混乱4.某些样式无法编写（伪类伪元素）

// 2. 组件中引入css文件
// 注意：样式全局生效，会互相影响，给命名空间

// 3. 组件中引入module.css文件
// 将css当作模块引入，样式只用于当前，不会影响当前组件的后代
// 需要webpack配置文件modules:true
// 解决局部作用域问题
// 缺陷：引用的类名不能使用连接符（.xxx-xx），js不识别
// 所有className都必须使用{style.className}来编写
// 不方便动态来修改某些样式，依然要使用内联样式方式编写

// 4. css in js
// CSS-in-js是一种模式，其中css由js生成而不是在外部文件中定义
// 第三方库
// styled-components
// export const SelfLink = styled.div`
//   height: 50px;
//   border: 1px solid red;
//   color: yellow;
// `;
// export const SelfButton = styled.div`
//   height: 150px;
//   width: 150px;
//   color: ${(props) => props.color};
//   background-image: url(${(props) => props.src});
//   background-size: 150px 150px;
// `;

// import React, { Component } from "react";
// import { SelfLink, SelfButton } from "./style";
// class Test extends Component {
//  constructor(props, context) {
//  super(props);
//  } 
//  render() {
//  return (
//  <div>
//  <SelfLink title="People's Republic of China">app.js</SelfLink>
//  <SelfButton color="palevioletred" style={{ color: "pink" }} src={fist}>
//  SelfButton
//  </SelfButton>
//  </div>
//  );
//  }
// }
// export default Test;