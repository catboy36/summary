// react 16.8引入
// 引入hook原因：
// 难以重用和共享组件汇总的状态相关逻辑
// 逻辑复杂的组件难以开发维护
// 类组件this学习成本高，类组件在基于现有工具的优化上存在些许问题
// 由于业务变动，函数组件不得不改为类组件

// hooks:
// userState
// useEffect
// useRef
// useMemo
// useCallback
// useReducer

// useState
// 函数内部维护state
import React, { useEffect, useState } from 'react';
function Example() {
  // "count" state
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

// useEffect
// 在函数组件中进行一些带有副作用的操作
// 相当于 componentDidMount, componentDidUpdate,componentWillUnmount三个生命周期函数的组合
function Example1() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

// hooks解决的问题
// 更容易的解决状态相关的重用的问题
// 每调用useHook一次，都会生成一份独立的状态
// 通过自定义hook能更好的封装功能