// react生命周期

// 1. 创建阶段
// constructor
// super关键字获取来自父组件的props，通常操作初始化state或在this上挂载方法

// getDerivedStateFromProps
// 静态方法，不能访问到组件的实例
// 执行时机：组件创建和更新阶段，不论props变化还是state变化，都调用
// 每次render前调用，两个参数props,prevProps，可以比较加限制条件，防止无用的state更新
// 该方法需要返回一个新对象作为新的state或者null表示state不需要更新

// render
// 类组件必须实现该方法，用于渲染dom结构，可以访问state和props属性
// 不要在render里setState，会触发死循环

// componentDidMount
// 组件挂载到真实dom节点后执行，在render方法后执行，此方法多用于执行一些数据获取，事件监听等操作

// 2. 更新阶段
// getDerivedStateFromProps

// shouldComponentUpdate
// 告知组件本身基于当前props和state是否需要重新渲染，默认返回true
// 执行时机：到新的props或者state时都会调用，返回true或false告知组件是否更新
// 一般情况，不建议在该周期方法中深层比较，影响性能效率
// 也不能调用setState，导致死循环调用更新

// render

// getSnapshotBeforeUpdate
// 该函数在render后执行，执行时dom元素还没被更新
// 该方法返回一个snapshot值，作为componentDidUpdate第三个参数
// 此方法目的在于获取组件更新前的一些消息，比如组件滚动位置，可以在组件更新后根据这些信息恢复一些ui视觉上的状态
// getSnapshotBeforeUpdate(prevProps, prevState) {
//     console.log('#enter getSnapshotBeforeUpdate');
//     return 'foo';
//    }
//    componentDidUpdate(prevProps, prevState, snapshot) {
//     console.log('#enter componentDidUpdate snapshot = ', snapshot);
//    }

// componentDidUpdate
// 执行时机：组件更新结束后触发
// 该方法中，可以根据前后的props和state变化做相应的操作，如获取数据，修改dom等

// 3. 卸载阶段
// componentWillUnmount
// 用于组件卸载前，清理一些注册的监听事件，取消订阅网络请求等
// 一旦一个组件实例被卸载，其不会再次被挂载，而只能重新创建

// 新生命周期渐少三个方法
// componentWillMount，componentWillReciveProps,componentWillUpdate
// 三个方法仍然存在，只是在前者加上了UNSAFE_前缀
// 新增两个方法
// getDerivedStateFromProps,getSnapshotBeforeUpdate
