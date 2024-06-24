// react组件间过渡动画
// 组件的入场和离场

// react-transition-group
// 三个主要组件
// CSSTransition 前端开发中，结合CSS完成过渡动画效果
// SwitchTransition 两个组件显示和隐藏切换时，使用该组件
// TransitionGroup 将多个动画组件包裹在其中，一般用于列表中元素的动画

// CSSTransition
// in设为true，子组件添加xxx-enter,xxx-enter-active类名，结束后，移除，添加-enter-done的类名
// in设为false，子组件添加xxx-exit,xxx-exit-active类名，结束后，移除，添加-enter-done的类名
// export default class App2 extends React.PureComponent {
//   state = { show: true };
//   onToggle = () => this.setState({ show: !this.state.show });
//   render() {
//     const { show } = this.state;
//     return (
//       <div className={'container'}>
//         <div className={'square-wrapper'}>
//           <CSSTransition in={show} timeout={500} classNames={'fade'} unmountOnExit={true}>
//             <div className={'square'} />
//           </CSSTransition>
//         </div>
//         <Button onClick={this.onToggle}>toggle</Button>
//       </div>
//     );
//   }
// }

// .fade-enter {
//     opacity: 0;
//     transform: translateX(100%);
//    }
//    .fade-enter-active {
//     opacity: 1;
//     transform: translateX(0);
//     transition: all 500ms;
//    }
//    .fade-exit {
//     opacity: 1;
//     transform: translateX(0);
//    }
//    .fade-exit-active {
//     opacity: 0;
//     transform: translateX(-100%);
//     transition: all 500ms;
//    }

// SwitchTransition
// 完成两个组件之间切换的炫酷动画
// mode属性
// in-out: 表示新组件先进入，旧组件再移除
// out-in: 表示旧组件先移除，新组件再进入
// SwitchTransition里面要有CSSTransition,不能直接包裹想要切换的组件
// 内部的CSSTransition组件不受in控制，而改为key属性
// import { SwitchTransition, CSSTransition } from 'react-transition-group';
// export default class SwitchAnimation extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isOn: true,
//     };
//   }
//   render() {
//     const { isOn } = this.state;
//     return (
//       <SwitchTransition mode="out-in">
//         <CSSTransition classNames="btn" timeout={500} key={isOn ? 'on' : 'off'}>
//           {<button onClick={this.btnClick.bind(this)}>{isOn ? 'on' : 'off'}</button>}
//         </CSSTransition>
//       </SwitchTransition>
//     );
//   }
//   btnClick() {
//     this.setState({ isOn: !this.state.isOn });
//   }
// }

// .btn-enter {
//     transform: translate(100%, 0);
//     opacity: 0;
//    }
//    .btn-enter-active {
//     transform: translate(0, 0);
//     opacity: 1;
//     transition: all 500ms;
//    }
//    .btn-exit {
//     transform: translate(0, 0);
//     opacity: 1;
//    }
//    .btn-exit-active {
//     transform: translate(-100%, 0);
//     opacity: 0;
//     transition: all 500ms;
//    }

// TransitionGroup
// 当有一组动画时，可以将这些CSSTransition放到一个TransitionGroup中完成动画，依然CSSTransition使用key属性
// TransitionGroup在感知children发生变化时，先保存移除的节点，当动画结束后菜真正移除

// 处理方式如下：
// 插入的节点，先渲染dom，然后再做动画
// 删除的节点，先做动画，然后再删除dom
// import React, { PureComponent } from 'react'
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
// export default class GroupAnimation extends PureComponent {
//  constructor(props) {
//  super(props);
//  this.state = {
//  friends: []
//  }
//  }
//  render() {
//  return (
//  <div>
//  <TransitionGroup>
//  {
//  this.state.friends.map((item, index) => {
//  return (
//  <CSSTransition classNames="friend" timeout={300} key={inde
// x}>
//  <div>{item}</div>
//  </CSSTransition>
//  )
//  })
//  }
//  </TransitionGroup>
//  <button onClick={e => this.addFriend()}>+friend</button>
//  </div>
//  )
//  }
//  addFriend() {
//  this.setState({
//  friends: [...this.state.friends, "coderwhy"]
//  })
//  }
// }

// .friend-enter {
//     transform: translate(100%, 0);
//     opacity: 0;
//    }
//    .friend-enter-active {
//     transform: translate(0, 0);
//     opacity: 1;
//     transition: all 500ms;
//    }
//    .friend-exit {
//     transform: translate(0, 0);
//     opacity: 1;
//    }
//    .friend-exit-active {
//     transform: translate(-100%, 0);
//     opacity: 0;
//     transition: all 500ms;
//    }
