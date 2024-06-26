// 提高react渲染效率，避免不必要的render

// 类组件
// 父组件setState,render，子组件也会render

// shouldComponentUpdate
// 对比state和props，确定是否需要重新渲染，默认返回true代表需要，返回false即不重新渲染

// PureComponent
// 和shouldComponentUpdate原理一致，只做浅比较
// if (this._compositeType === CompositeTypes.PureClass) {
//     shouldUpdate = !shallowEqual(prevProps, nextProps) || ! shallowEqual(in
//    st.state, nextState);
//    }

// React.memo
// React.memo用来缓存组件的渲染，避免不必要的更新，也是高阶组件，与PureComponent类似，只用于函数组件

// import { memo } from 'react';
// function Button(props) {
//   // Component code
// }
// export default memo(Button);

// 如果需要比较深层次，可以传递比较函数作为第二个参数
// function arePropsEqual(prevProps, nextProps) {
//   // your code
//   return prevProps === nextProps;
// }
// export default memo(Button, arePropsEqual);

// 拆分组件，当状态修改时，组件粒度小了，会减少不必要的渲染
