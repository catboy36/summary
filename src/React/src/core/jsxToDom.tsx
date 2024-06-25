// react jsx转换为真实dom过程

// 过程
// react节点类别
// 原生标签节点，文本节点，函数组件，类组件

// react.creatElement(react17 后是react/jsx-runtime 中的jsx方法)
// function createElement(type, config, ...children) {
//   if (config) {
//     delete config.__self;
//     delete config.__source;
//   }
//   //  源码做了想象处理，比如过滤key，ref等
//   const props = {
//     ...config,
//     children: children.map(child => (typeof child === 'object' ? child : createTextNode(child))),
//   };
//   return {
//     type,
//     props,
//   };
// }
// function createTextNode(text) {
//   return {
//     type: TEXT,
//     props: {
//       children: [],
//       nodeValue: text,
//     },
//   };
// }
// export default {
//   createElement,
// };

// createElement根据传入的节点信息进行判断：
// 1. 如果是原生标签节点，type是字符串，如div,span
// 2. 如果是文本节点，type就没有（TEXT）
// 3. 如果是函数组件，type是函数名称
// 4. 如果是类组件，type是类名

// 虚拟dom通过render进行渲染dom:
// ReactDOM.render(element, container[, callback])
// 首次调用时，容器节点里所有dom元素都会被替换，后续的调用则会使用react的diff算法进行高效的更新
// 如果提供了可选的callback，回调会在组件被渲染或更新后被执行

// render大致实现如下：
function render(vnode: any, container: HTMLElement) {
  const node = createNode(vnode, container);
  container.appendChild(node);
}

function createNode(vnode: any, parentNode: HTMLElement): HTMLElement | Text | DocumentFragment | void {
  let node = null;
  const { type, props } = vnode;
  if (type === 'TEXT') {
    node = document.createTextNode('');
  } else if (typeof type === 'string') {
    node = document.createElement(type);
  } else if (typeof type === 'function') {
    node = type.isReactComponent ? updateClassComponent(vnode, parentNode) : updateFunctionComponent(vnode, parentNode);
  } else {
    node = document.createDocumentFragment();
  }
  reconcileChildren(props.children, node);
  updateNode(node, props);
  return node;
}

// 遍历vnode，然后把子vnode -> 真实dom节点，再插入父node中
function reconcileChildren(children, node) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (Array.isArray(child)) {
      for (let j = 0; j < child.length; j++) {
        render(child[j], node);
      }
    } else {
      render(child, node);
    }
  }
}

// 将props上的绑定方法和属性指派到创建的节点node上
function updateNode(node, nextVal) {
  Object.keys(nextVal)
    .filter(k => k !== 'children')
    .forEach(k => {
      if (k.slice(0, 2) === 'on') {
        let eventName = k.slice(2).toLocaleLowerCase();
        node.addEventListener(eventName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}

// 返回真实dom节点，执行函数
function updateFunctionComponent(vnode, parentNode) {
  const { type, props } = vnode;
  let vvnode = type(props);
  const node = createNode(vvnode, parentNode);
  return node;
}

// 返回真实dom节点，先实例化，再执行render函数
function updateClassComponent(vnode, parentNode) {
  const { type, props } = vnode;
  let cmp = new type(props);
  const vvnode = cmp.render();
  const node = createNode(vvnode, parentNode);
  return node;
}

export default {
  render,
};

// 渲染流程如下：
//1. 使用React.createElement或jsx编写React组件，所有jsx最后都转化成React.createElement()
// 2. createElement函数对key和ref等特殊的props进行处理，获取defaultProps对props进行默认赋值
// 并且对传入的孩子节点进行处理，最终构造成一个虚拟dom对象
// 3.ReactDom.render将生成好的虚拟DOM渲染到指定容器上，其中采用了批处理，事务等机制，且对特定浏览器进行性能优化，最终转换为真实DOM
