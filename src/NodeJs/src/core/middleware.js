// 中间件
// 是介于应用系统和系统软件之间的一类软件，使用系统软件所提供的基础服务，衔接网络上应用系统的各个部分或不同
// 应用，能够达到资源共享，功能共享的目的

// nodejs中，中间件主要指封装 http请求细节处理的方法

// express,koa中，中间件本质为一个回调函数，参数包含请求对象，相应对象和执行下一个中间件的函数

// koa是基于 nodejs的 web框架，本身功能不多，可以通过中间件扩展实现
// 添加不同的中间件，实现不同的需求，从而构建一个 koa应用

// koa中间件裁员洋葱模型，每次执行下一个中间件传人两个参数
// ctx：封装了请求和响应变量，next:进入下一个要执行的中间件的函数
// async
// app.use(async (ctx, next) => {
//   const start = Date.now();
//   await next();
//   const ms = Date.now() - start;
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// });
// //
// app.use((ctx, next) => {
//   const start = Date.now();
//   return next().then(() => {
//     const ms = Date.now() - start;
//     console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
//   });
// });

// koa中间件很多，如 koa-bodyparser,koa-static
// 单个中间件应该足够简单，指责单一，中间件的代码编写应该高效，必要时候通过缓存重新获取数据
