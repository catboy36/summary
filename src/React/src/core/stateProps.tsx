import React from "react";

// state和props
interface IProps {
  number?: number;
}

interface IState {
  count: number;
}

class Button extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  updateCount() {
    this.setState((prevState, props) => {
      return { count: prevState.count + 1 + (this.props.number || 0) };
    });
  }
  render() {
    return (
      <button onClick={() => this.updateCount()}>
        Clicked {this.state.count} times
      </button>
    );
  }
}

// setState接收第二个参数，在setState调用完成且开始重新渲染时被调用，可以用来监听渲染是否完成
// this.setState(
//   {
//     name: "JS ",
//   },
//   () => console.log("setState finished")
// );


// props
// 单向数据流，主要作用时父组件向子组件传递数据


// 区别
// 相同：两者都是js对象，都用于保存信息，props和state都能触发重新渲染
// 不同： props是外部组件传递给组件的，state是组件内组件自己管理的，一般constructor初始化
// props在组件内部不可修改，state在组件内部可修改
// state是多变的，可以修改

