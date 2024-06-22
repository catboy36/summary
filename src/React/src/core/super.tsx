// super和super(props)区别
// super关键字实现调用父类，super代替的是父类的构造函数

// 类组件
interface IProps {
  number?: number;
}
// super传入props，确保this.props在构造函数执行完毕前已经赋值
// React 内部，先实例化，后给this.props赋值
// const instance = new YourComponent(props);
// instance.props = props;
class Button extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props); // props
    console.log(props); // {}
    console.log(this.props); // {}
    // ...
  }
}
