// react自己实现，合成事件机制
// react模拟原生dom事件所有能力的一个事件对象，浏览器原生事件的跨浏览器包装器

// 获取原生对象
// e.nativeEvent

// 与原生事件区别
// 1. 命名方式不同（react事件驼峰）
// 2. 事件处理函数书写不同
// 原生事件
{
  /* <button onclick="handleClick()"> </button> */
}

// React 事件
//  const button = <button onClick={handleClick}> </button>

// 挂载在react最外层入口，之前是document上

// 执行顺序
// react所有事件挂在最外层入口，之前是document上
// 当真实dom原生触发事件，会冒泡到外层，再处理react事件
// 所以先执行原生事件，然后处理react事件，最后执行真正挂在document上挂载的事件

// 想要阻止不同时间段的冒泡，对应使用不同方法：
// 阻止合成事件间的冒泡，e.stopPropagination()
// 阻止合成事件与最外层上事件间的冒泡，e.nativeEvent.stopImmediatePropagination()(如果多个事件监听器被附加到相同元素的相同事件类型上，当此事件触发时，它们会按其被添加的顺序被调用。如果在其中一个事件监听器中执行 stopImmediatePropagation() ，那么剩下的事件监听器都不会被调用。)
// 阻止合成事件与除最外层上原生事件的冒泡，使用e.target避免
// document.body.addEventListener('click', e => { 
//     if (e.target && e.target.matches('div.code')) { 
//     return; 
//     } 
//     this.setState({ active: false, }); });
//    }
import React from "react";
interface IProps {}
class EventExample extends React.Component<IProps> {
  parentRef: React.RefObject<HTMLDivElement>;
  childRef: React.RefObject<HTMLDivElement>;
  constructor(props: IProps) {
    super(props);
    this.parentRef = React.createRef();
    this.childRef = React.createRef();
  }
  componentDidMount() {
    console.log("React componentDidMount ");
    this.parentRef.current?.addEventListener("click", () => {
      console.log(" 原生父元素DOM事件监听 ");
    });
    this.childRef.current?.addEventListener("click", () => {
      console.log(" 原生子元素DOM事件监听  ");
    });
    document.addEventListener("click", (e) => {
      console.log(" 原生document DOM事件监听 ");
    });
  }
  parentClickFun = () => {
    console.log("React 父元素事件监听");
  };
  childClickFun = () => {
    console.log("React 子元素事件监听");
  };
  render() {
    return (
      <div ref={this.parentRef} onClick={this.parentClickFun}>
        <div ref={this.childRef} onClick={this.childClickFun}>
          分析执行顺序
        </div>
      </div>
    );
  }
}
export default EventExample;

// react上注册的事件最终绑定在组件最外层（之前是document）
// 自身实现一套事件冒泡机制
// 通过队列形式，从触发组件向父组件回溯，然后调用他们jsx中定义的callback
// react有一套自己的合成事件syntheticEvent
