// render方法原理，触发时机

import React, { useState } from 'react';

// 类组件
// render方法

// 函数组件
// 指的是函数本身

// render中书写jsx/tsx，最终编译为js代码
// React.createElement(type, attr, children)
// React.createElement(
//   'div',
//   {
//     className: 'cn',
//   },
//   React.createElement(Header, null, 'hello'),
//   React.createElement('div', null, 'start'),
//   'Right Reserve'
// );

// render触发时机
// 类组件调用setState修改状态
// 函数组件通过useState hook 修改状态
// 函数组件只有useState依赖数组内值变化时才重新执行渲染
// 类组件每次setState都会重新渲染，不管state变不变

// 父组件渲染，子组件也会渲染
export default function RenderApp() {
  const [name, setName] = useState('App');
  return (
    <div className="App">
      <Foo />
      <button onClick={() => setName('aaa')}>{name}</button>
    </div>
  );
}
function Foo() {
  console.log('Foo render');
  return (
    <div>
      <h1> Foo </h1>
    </div>
  );
}
export class RenderClassApp extends React.Component {
  state = { name: 'App' };
  render() {
    return (
      <div className="App">
        <Foo1 />
        <button onClick={() => this.setState({ name: 'App' })}>Change name</button>
      </div>
    );
  }
}

function Foo1() {
  console.log('Foo1 render');
  return (
    <div>
      <h1> Foo1 </h1>
    </div>
  );
}
