# babel 的plugin和loader原理

1. babel是一个流行的js编译器
2. babel核心
    - @babel/core
    - @babel/parser
    - @babel/traverse
    - @babel/generator
    - types polyfill template
3. babel-preset-env 工具集


# webpack打包原理过程
 1. Compiler
 2. Compilation
 3. Module
 4. Chunk
 5. bundle

 1. splitChunk 怎么做
 2. tree shaking
 3. dll
 4. css 提取
 5. Terser 压缩
 6. mode，entry, output, module(loader), resolve, external, plugin

webpack构建流程：
核心概念： 
 1. Compiler
 2. Compilation
 3. Module
 4. Chunk
 5. bundle

 1. 初始化，读取配置信息，统计入口文件，解析loader和plugin等信息
 2. 编译阶段，webpack编译代码，部分依赖babel，ts转js，less,sass,stylus转css
 3. 输出阶段: 生成输出文件，包含文件名，输出路径，资源信息

 ### 初始化阶段
 1. 初始化参数
 2. 创建compiler实例
 3. 调用compiler.run，开始编译
 4. 确定入口，根据entry找出所有入口文件，addEntry

 ### 编译构建阶段
 1. 编译模块， 通过entry对应的dependence创建module对象,调用对应loader,babel将一些内容转换为目标内容
 2. 完成模块编译，得到一个moduleGraph

 Module -> Chunk -> bundle

 ### 生成阶段
 1. 输出资源，组装chunk, chunkGroup,再将chunk转换为单独文件加入到输出列表，说明这里是修改资源内容的最后机会（afterChunks）
 2. 写入文件系统（build）emitAssets 确定好输出内容后，根据配置输出到文件中 / webpack-dev-server（中间服务器）生成json和bundle文件给客户端 
 

 loader本质是对象，plugin本质是对象



### peerDependencies

monorepo package.json

相当于指定当前的开发环境

主包有其指定的满足要求的包，不再多次下载，没有则下载

### pnpm优势
performance npm

速度快，节省磁盘空间

hard link 硬链接  多个文件名指向同一个索引 允许一个文件有多个有效的路径名称

pnpm ~/ .pnpm-store

建立 非扁平化的node_modules .pnpm里文件做硬链接 ，与其同级的包文件软链接（比如下载vue，其为软链接，真正链接的是.pnpm下的vue）


### serverless

不用关心部署
1. FaaS function as a service 函数即服务
2. BaaS backend as service 后端即服务


### 前端安全措施
1. 数据传输加密
2. 输入验证和过滤
3. 访问控制权限管理
4. 安全编码
5. 扫描漏洞，安全测试