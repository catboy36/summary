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

