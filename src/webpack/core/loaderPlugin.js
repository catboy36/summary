// loader和plugin区别
// loader是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译，压缩等，最终一起打包到指定的文件夹中
// plugin赋予了webpack各种灵活的功能，例如打包优化，资源管理，环境变量注入等，目的是解决loader无法实现的其它事

// 运行时机区别：
// loader运行在打包文件之前，plugin在整个编译周期起作用

// webpack运行的生命周期中会广播许多事情，Plugin可以监听这些事件，在合适的时机通过webpack提供的api改变输出结果
// 对于loader，实质是一个转换器，将A文件进行编译形成B文件，操作的是文件，单纯文件转换过程

// 编写loader
// loader本质：函数，this作为上下文会被webpack填充，本能将loader设置为箭头函数
// 函数接收一个参数，为webpack传递loader的文件源内容
// 函数中this是由webpack提供的对象，能够获取当前loader所需要的各种信息
// 函数中有异步操作或同步操作，异步操作通过this。callback返回，返回值要求为string或Buffer

// 导出一个函数，source为webpack传递给loader的文件源内容
module.exports = function (source) {
  const content = doSomeThing2JsString(source);

  // 如果loader配置了options对象，那么this.query将指向options
  const options = this.query;

  // 可以用作解析其它模块路径的上下文
  console.log("this.context");

  /*
    * this.callback 参数
    * error： Error | null 当loader出错时向外抛出一个 error
    * content String | Buffer，经过loader编译后需要导出的内容 
    * sourceMap：为方便调试生成的编译后内容的source map
    * ast 本次编译生成的AST静态语法书，之后执行的 loader可以直接使用这个AST,进而省去重复生成
    AST 的过程
    */
  this.callback(null, content); //
  return content; //
};

// 一般在编写loader过程中，保持功能单一，避免做太多事

// 编写plugin
// webpack基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件通过监听这些事件，可以在特定的阶段执行自己的插件任务
// 两个核心对象
// compiler：包含了webpack环境的所有配置信息，包括options,loader和plugin,和webpack整个生命周期相关的钩子
// compilation:作为plugin内置事件回调函数的参数，包含了当前的模块资源，编译生成资源，变化的文件，以及被跟踪依赖的状态信息，当检测到一个文件变化，一次新的compilation将被创建

// 插件必须是一个函数或者是一个包含apply方法的对象，这样才能访问compiler实例
// 传给每个插件的compiler和compilation对象都是用一个引用，不建议修改
// 异步的事件需要在插件处理完任务时调用回调函数通知webpack进入下一个流程，不然会卡住
class MyPlugin {
  // Webpack会调用MyPlugin实例的apply方法给插件实例传入compiler对象
  apply(compiler) {
    // 找到合适的事件钩子，实现自己的插件功能
    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      // compilation: 当前打包构建流程的上下文
      console.log(compilation);

      // do something...
    });
  }
}
