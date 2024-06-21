// webpack构建流程
// webpack的允许流程是一个串行的过程，将各个插件串联起来

// 三大步骤
// 初始化流程：从配置文件和shell语句中读取与合并参数，并初始化需要使用的插件和配置插件等执行环境所需要的参数
// 编译构建流程：从entry出发，针对每个module串行调用对应的loader去翻译文件内容，再找到该module依赖的module，递归的进行编译处理
// 输出流程：对编译后的module组合成chunks，把chunk转换成文件，输出到文件系统

// 初始化文件
// 从配置文件和shell语句中读取合并参数，得出最终的参数
// 默认webpack.config.js，主要作用是用于激活webpack的加载项和插件

var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
module.exports = {
  // chunk
  entry: './path/to/my/entry/file.js',
  // ( )
  resolve: {
    alias: {
      react: pathToReact,
    },
  },
  //
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  // loader css loader es6 loader
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
    noParse: [pathToReact],
  },
  // webpack webpack
  plugins: [new webpack.HotModuleReplacementPlugin()],
};

// webpack将webpack.config.js中各个配置项拷贝到options对象中，并加载用户配置的plugins
// 完成上述步骤后，开始初始化Compiler编译对象，该对象掌控者webpack生命周期，不执行具体任务
// 只是进行一些调度工作
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncHook(['params']),
      afterCompile: new AsyncSeriesHook(['compilation']),
      make: new AsyncParallelHook(['compilation']),
      entryOption: new SyncBailHook(['context', 'entry']),
      //
    };
    // ...
  }
}
function webpack(options) {
  var compiler = new Compiler();
  // ...
  return compiler;
}

// 编译构建流程
// 根据entry找出所有文件的入口
// 初始化完成后会调用compiler的run真正启动webpack编译构建流程，主要流程如下：
// compile 开始编译
// make 从入口点分析模块及其依赖，创建这些模块对象
// build-module 构建模块
// seal 封装构建结果
// emit 把各个chunk输出到结果文件

// compile 编译
// 执行run方法后，首先触发compile，主要是构建一个compilation对象
// 该对象是编译的主要执行者，会依次下述流程：
// 执行模块创建，依赖收集，分块，打包等主要任务对象

// make 编译模块
// 从entry开始读区，执行_addModuleChain()

// _addModuleChain(context, dependency, onModule, callback) {
//     //...
//     //
//     const Dep = /** @type {DepConstructor} */ (dependency.constructor);
//     const moduleFactory = this.dependencyFactories.get(Dep);

//     // NormalModuleFactory create NormalModule
//     moduleFactory.create({
//     dependencies: [dependency]
//     //...
//     }, (err, module) => {
//     //...
//     const afterBuild = () => {
//     this.processModuleDependencies(module, err => {
//     if (err) return callback(err);
//     callback(null, module);
//     });
//     };

//     this.buildModule(module, false, null, null, err => {
//     //...
//     afterBuild();
//     })
//     })
//    }
// build-module 完成模块编译
// 调用配置的loaders，将模块转成标准js模块
// 用loader对一个模块转换完成后，使用acorn解析转换后的内容，输出对应的抽象语法树（AST）
// 便于webpack后面对代码分析

// 从配置的入口模块开始，分析其AST，当遇到require等导入其他模块语句时，便将其加入到依赖的模块列表
// 同时对新找出的依赖模块递归分析，最终搞清所有模块依赖关系

// 输出流程
// seal 输出资源
// seal方法主要是生成chunks，对chunks进行一系列优化操作，并生成要输出的代码
// webpack中的chunk，可以理解为配置在entry中的模块，或是动态引入的模块
// 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk，再把每个chunk转换成一个单独文件加入到输出列表

// emit 输出完成
// 确定好输出内容后，按照配置确定输出的路径和文件名

// output: {
//     path: path.resolve(__dirname, 'build'),
//     filename: '[name].js'
//    }

// 从compiler开始生成文件前，钩子emit会被执行，这是修改最终文件的最后一个机会，从而webpack打包过程结束
