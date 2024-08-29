# webpack 打包构建流程 - 初始化

1. 入口 `lib/index.js`

```js
const fn = lazyFunction(() => require('./webpack'));
module.exports = mergeExports(fn, {
  //...
});
```

2. 核心方法 `webpack`

调用`webpack`方法，执行内部`create`函数，根据`callback`是否定义分情况

- 如果`callback`存在，`create`方法执行得到`compiler, watch, watchOptions`, 判断是否需要`watch`
  - `watch`存在则调用`compiler.watch`，否则调用`compiler.run`
- 如果`callback`不存在，`create`方法执行得到`compiler, watch`, 如果`watch`存在则提示必须传入`callback`

```js
const webpack = (options, callback) => {
  const create = () => {};
  if (callback) {
    try {
      const { compiler, watch, watchOptions } = create();
      if (watch) {
        compiler.watch(watchOptions, callback);
      } else {
        compiler.run((err, stats) => {
          compiler.close(err2 => {
            callback(
              err || err2,
              /** @type {options extends WebpackOptions ? Stats : MultiStats} */
              (stats)
            );
          });
        });
      }
      return compiler;
    } catch (err) {
      process.nextTick(() => callback(/** @type {Error} */ (err)));
      return null;
    }
  } else {
    const { compiler, watch } = create();
    if (watch) {
      util.deprecate(
        () => {},
        "A 'callback' argument needs to be provided to the 'webpack(options, callback)' function when the 'watch' option is set. There is no way to handle the 'watch' option without a callback.",
        'DEP_WEBPACK_WATCH_WITHOUT_CALLBACK'
      )();
    }
    return compiler;
  }
};
```

3. `webpack`方法内执行的`create`方法

- 首先教研传入的 options 配置，确认都是合法且正确的
- 定义`compiler watch watchOptions`，初始化`watch`为`false`
- 更具`options`是不是数组调用不同方法，为`compiler watch watchOptions`赋值，返回出去

```js
const create = () => {
  if (!asArray(options).every(webpackOptionsSchemaCheck)) {
    getValidateSchema()(webpackOptionsSchema, options);
    util.deprecate(
      () => {},
      'webpack bug: Pre-compiled schema reports error while real schema is happy. This has performance drawbacks.',
      'DEP_WEBPACK_PRE_COMPILED_SCHEMA_INVALID'
    )();
  }
  /** @type {MultiCompiler|Compiler} */
  let compiler;
  /** @type {boolean | undefined} */
  let watch = false;
  /** @type {WatchOptions|WatchOptions[]} */
  let watchOptions;
  if (Array.isArray(options)) {
    /** @type {MultiCompiler} */
    compiler = createMultiCompiler(options, /** @type {MultiCompilerOptions} */ (options));
    watch = options.some(options => options.watch);
    watchOptions = options.map(options => options.watchOptions || {});
  } else {
    const webpackOptions = /** @type {WebpackOptions} */ (options);
    /** @type {Compiler} */
    compiler = createCompiler(webpackOptions);
    watch = webpackOptions.watch;
    watchOptions = webpackOptions.watchOptions || {};
  }
  return { compiler, watch, watchOptions };
};
```

4. 创建`compiler`

核心方法 `createCompiler createMultiCompiler`

- 对原始`options`做规范化处理教研，应用基础默认配置（context, stream, log）
- 实例化 `Compiler`
- 使用`NodeEnvironmentPlugin`为`compiler`挂载`node`环境的一些属性方法 触发 `beforeRun` 钩子
- 判断 `options.plugins` 是否为数组，如果是的话，遍历执行每个`plugin`(`plugin`应该是函数) 活着 为 compiler 挂载`plugin`（`plugin`不是函数）
- 为`options`合并默认配置
- 触发 `environment afterEnvironment` 钩子
- 为`compiler`应用`options`，且内部会应用多个`plugin`
- 触发 `initialize` 钩子 返回 `compiler`实例

```js
const createCompiler = (rawOptions, compilerIndex) => {
  const options = getNormalizedWebpackOptions(rawOptions);
  applyWebpackOptionsBaseDefaults(options);
  const compiler = new Compiler(/** @type {string} */ (options.context), options);
  new NodeEnvironmentPlugin({
    infrastructureLogging: options.infrastructureLogging,
  }).apply(compiler);
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === 'function') {
        /** @type {WebpackPluginFunction} */
        (plugin).call(compiler, compiler);
      } else if (plugin) {
        plugin.apply(compiler);
      }
    }
  }
  const resolvedDefaultOptions = applyWebpackOptionsDefaults(options, compilerIndex);
  if (resolvedDefaultOptions.platform) {
    compiler.platform = resolvedDefaultOptions.platform;
  }
  compiler.hooks.environment.call();
  compiler.hooks.afterEnvironment.call();
  new WebpackOptionsApply().process(options, compiler);
  compiler.hooks.initialize.call();
  return compiler;
};
```

```js
const createMultiCompiler = (childOptions, options) => {
  const compilers = childOptions.map((options, index) => createCompiler(options, index));
  const compiler = new MultiCompiler(compilers, options);
  for (const childCompiler of compilers) {
    if (childCompiler.options.dependencies) {
      compiler.setDependencies(childCompiler, childCompiler.options.dependencies);
    }
  }
  return compiler;
};
```

5. `compiler`实例

```js
class Compiler {
    constructor(){
        this.hooks = Object.freeze({
            //..
        })
    }
  //
  run() => {}

  watch() => {}

  emitAsset() => {}

  compile() => {}
}
```

# webpack 打包构建流程 -

1. `run`方法

- 核心调用内部`run`方法
- 依次触发 `beforeRun run` 钩子
- `compile`方法进行编译

```js
	run(callback) {
		if (this.running) {
			return callback(new ConcurrentCompilationError());
		}

		const finalCallback = (err, stats) => {
			if (logger) logger.time("beginIdle");
			this.idle = true;
			this.cache.beginIdle();
			this.idle = true;
			if (logger) logger.timeEnd("beginIdle");
			this.running = false;
			if (err) {
				this.hooks.failed.call(err);
			}
			if (callback !== undefined) callback(err, stats);
			this.hooks.afterDone.call(/** @type {Stats} */ (stats));
		};

		const startTime = Date.now();

		this.running = true;

		const onCompiled = (err, _compilation) => {
            // ...
		};

		const run = () => {
			this.hooks.beforeRun.callAsync(this, err => {
				if (err) return finalCallback(err);

				this.hooks.run.callAsync(this, err => {
					if (err) return finalCallback(err);

					this.readRecords(err => {
						if (err) return finalCallback(err);

						this.compile(onCompiled);
					});
				});
			});
		};

		if (this.idle) {
			this.cache.endIdle(err => {
				if (err) return finalCallback(err);

				this.idle = false;
				run();
			});
		} else {
			run();
		}
	}
```

2. `compile`方法

- 依次触发 `beforeCompile compile make finishMake afterCompile` 钩子
- `beforeCompile`时创建`compilation` 用来做本次编译的编译对象, 其为真正进行编译工作的对象
- 最后执行传入的 `callback`

```js
compile(callback) {
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

			this.hooks.compile.call(params);

			const compilation = this.newCompilation(params);

			const logger = compilation.getLogger("webpack.Compiler");

			logger.time("make hook");
			this.hooks.make.callAsync(compilation, err => {
				logger.timeEnd("make hook");
				if (err) return callback(err);

				logger.time("finish make hook");
				this.hooks.finishMake.callAsync(compilation, err => {
					logger.timeEnd("finish make hook");
					if (err) return callback(err);

					process.nextTick(() => {
						logger.time("finish compilation");
						compilation.finish(err => {
							logger.timeEnd("finish compilation");
							if (err) return callback(err);

							logger.time("seal compilation");
							compilation.seal(err => {
								logger.timeEnd("seal compilation");
								if (err) return callback(err);

								logger.time("afterCompile hook");
								this.hooks.afterCompile.callAsync(compilation, err => {
									logger.timeEnd("afterCompile hook");
									if (err) return callback(err);

									return callback(null, compilation);
								});
							});
						});
					});
				});
			});
		});
	}
```

3. `compile`方法的回调

```js
const finalCallback = (err, stats) => {
  if (logger) logger.time('beginIdle');
  this.idle = true;
  this.cache.beginIdle();
  this.idle = true;
  if (logger) logger.timeEnd('beginIdle');
  this.running = false;
  if (err) {
    this.hooks.failed.call(err);
  }
  if (callback !== undefined) callback(err, stats);
  this.hooks.afterDone.call(/** @type {Stats} */ (stats));
};
const onCompiled = (err, _compilation) => {
  if (err) return finalCallback(err);

  const compilation = /** @type {Compilation} */ (_compilation);

  if (this.hooks.shouldEmit.call(compilation) === false) {
    compilation.startTime = startTime;
    compilation.endTime = Date.now();
    const stats = new Stats(compilation);
    this.hooks.done.callAsync(stats, err => {
      if (err) return finalCallback(err);
      return finalCallback(null, stats);
    });
    return;
  }

  process.nextTick(() => {
    logger = compilation.getLogger('webpack.Compiler');
    logger.time('emitAssets');
    this.emitAssets(compilation, err => {
      /** @type {Logger} */
      (logger).timeEnd('emitAssets');
      if (err) return finalCallback(err);

      if (compilation.hooks.needAdditionalPass.call()) {
        compilation.needAdditionalPass = true;

        compilation.startTime = startTime;
        compilation.endTime = Date.now();
        /** @type {Logger} */
        (logger).time('done hook');
        const stats = new Stats(compilation);
        this.hooks.done.callAsync(stats, err => {
          /** @type {Logger} */
          (logger).timeEnd('done hook');
          if (err) return finalCallback(err);

          this.hooks.additionalPass.callAsync(err => {
            if (err) return finalCallback(err);
            this.compile(onCompiled);
          });
        });
        return;
      }

      /** @type {Logger} */
      (logger).time('emitRecords');
      this.emitRecords(err => {
        /** @type {Logger} */
        (logger).timeEnd('emitRecords');
        if (err) return finalCallback(err);

        compilation.startTime = startTime;
        compilation.endTime = Date.now();
        /** @type {Logger} */
        (logger).time('done hook');
        const stats = new Stats(compilation);
        this.hooks.done.callAsync(stats, err => {
          /** @type {Logger} */
          (logger).timeEnd('done hook');
          if (err) return finalCallback(err);
          this.cache.storeBuildDependencies(compilation.buildDependencies, err => {
            if (err) return finalCallback(err);
            return finalCallback(null, stats);
          });
        });
      });
    });
  });
};
```
