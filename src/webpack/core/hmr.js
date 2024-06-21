// HMR Hot Moudle Replacement 模块热替换
// 应用程序运行过程中，替换，添加，删除模块，而无需重新刷新整个应用
const webpack = require('webpack');
module.exports = {
  // ...
  devServer: {
    // HMR
    hot: true,
    // hotOnly: true
  },
};

if (module.hot) {
  module.hot.accept('./util.js', () => {
    console.log('util.js更新了');
  });
}

// 实现原理
