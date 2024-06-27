// redux中间件
// 中间件是介于应用系统和系统软件之间的一类软件，它使用系统软件提供的基础服务功能，衔接网络上应用系统的各个部分或不同的应用
// 能够达到资源共享，功能共享的目的

// redux中，中间件就是放在dispatch过程，在分发action进行拦截处理
// 本质是一个函数，对store.dispatch方法就行了改造，在发出action和执行reducer这两步之间，添加了其他功能

// 常用中间件
// 中间件都需要通过applyMiddlewares进行注册，作用是将所有中间件组成一个数组，依次执行
// redux-thunk: 用于异步操作
// redux-logger: 用于日志记录
// const store = createStore(reducer, applyMiddleware(thunk, logger));
// import { configureStore } from '@reduxjs/toolkit';

// export default configureStore({
//   reducer: {},
//   middleware
// });

// redux-thunk
// 会判断传入的数据类型，如果是一个函数，将会给函数传入参数（dispatch,getState）
// dispatch用于之后再次派发action
// getState用于获取之前的一些状态

// dispatch可以写成下述形式：
// const getHomeMultidataAction = () => {
//   return dispatch => {
//     axios.get('http://xxx.xx.xx.xx/test').then(res => {
//       const data = res.data.data;
//       dispatch(changeBannersAction(data.banner.list));
//       dispatch(changeRecommendsAction(data.recommend.list));
//     });
//   };
// };

// redux-logger
// 日志

// import { applyMiddleware, createStore } from 'redux';
// import createLogger from 'redux-logger';
// const logger = createLogger();
// const store = createStore(reducer, applyMiddleware(logger));

// 实现原理
// applyMiddlewares源码
// export default function applyMiddleware(...middlewares) {
//   return createStore => (reducer, preloadedState, enhancer) => {
//     var store = createStore(reducer, preloadedState, enhancer);
//     var dispatch = store.dispatch;
//     var chain = [];
//     var middlewareAPI = {
//       getState: store.getState,
//       dispatch: action => dispatch(action),
//     };
//     chain = middlewares.map(middleware => middleware(middlewareAPI));
//     dispatch = compose(...chain)(store.dispatch);
//     return { ...store, dispatch };
//   };
// }

// 所有中间件被放进一个数组chain中，然后嵌套执行，最后执行store.dispatch
// 中间件内部middlewareAPI可以拿到getState和dispatch两个方法
// redux-thunk内部会将dispatch进行一个判断，然后执行对应操作，原理如下：
// function patchThunk(store) {
//   let next = store.dispatch;
//   function dispatchAndThunk(action) {
//     if (typeof action === 'function') {
//       action(store.dispatch, store.getState);
//     } else {
//       next(action);
//     }
//   }
//   store.dispatch = dispatchAndThunk;
// }

// 实现一个日志输出的原理：
// let next = store.dispatch;
// function dispatchAndLog(action) {
//   console.log('dispatching:', addAction(10));
//   next(addAction(5));
//   console.log(' 新的state:', store.getState());
// }
// store.dispatch = dispatchAndLog;
