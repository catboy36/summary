// react diff原理
// diff算法就是更高效的通过对比新旧virtual dom来找出真正的dom变化之处

// 原理
// react中diff算法主要遵循三个层级的策略
// tree层级
// component层级
// element层级

// tree层级
// 1. dom节点跨层级的操作不优化，只会对相同层级的节点进行比较
// 2. 只有删除，创建操作，没有移动操作

// component层级
// 1. 如果是同一个类的组件，则会继续往下diff运算，如果不是一个类的组件，那么直接删除这个组件下的所有子节点，创建新的

// element层级
// 1. 对于比较同一层级的节点们，每个节点在对应的层级用唯一的key做标识
// 2. 三种节点操作，分别为INSERT_MARKUP（插入），MOVE_EXISTING（移动），REMOVE_NODE（删除）
// index: 新集合的遍历下标
// oldIndex: 当前节点在老集合中的下标
// maxIndex: 在新集合访问过的节点中，其在老集合的最大下标
// 如果当前节点在新集合中的位置比老集合中的位置靠前的话，是不影响后续节点操作的，这里这时候被动字节不用动

// 操作过程只比较oldIndex和maxIndex:
// 1. oldIndex > maxIndex, 将oldIndex赋值给maxIndex
// 2. oldIndex === maxIndex，不操作
// 3. oldIndex < maxIndex,将当前节点移动到index位置

// 注意事项
// 对于简单列表渲染，不加key比加key性能好，毕竟dom节点移动操作比较昂贵
