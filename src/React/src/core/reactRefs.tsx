// react refs
// refs 弹性文件系统 Resilinet File System ReFS
// react中的refs提供了一种方式，运行我们访问dom节点或在render方法中创建react元素
// 本质为ReactDOM.render()返回的组件实例，如果是渲染组件则返回的是组件实例，如果是渲染dom则返回的是
// 具体的dom节点

// 创建ref形式有三种：
// 传入字符串，使用时通过this.refs.传入的字符串的格式获取对应的元素
// 传入对象，对象是通过React.createRef()方式创建出来的，使用时获取到创建的对象中存在current属性就是对应元素
// 传入函数，该函数会在dom被挂载时进行回调，这个函数会传入一个元素对象，可以自己保存，使用时，直接拿到之前保存的元素对象即可
// 传入hook，hook通过userRef方式创建，使用时通过current属性就是对应元素
// class MyComponent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.myRef = React.createRef();
//   }
//   render() {
//     return <div ref={(element) => (this.myref = element)} />;
//   }
// }

// 避免过度使用ref
// 适用场景：
// 1.对dom元素的焦点控制，内容选择，控制
// 2. 对dom元素的内容设置及媒体播放
// 3. 对dom元素的操作和对组件实例的操作
// 4. 集成第三方dom库
