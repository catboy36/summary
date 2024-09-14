# 在 Webpack 4 中导入图像

file-loader、url-loader、raw-loader 等完成图像加载操作

1. file-loader：将图像引用转换为 url 语句并生成相应图片文件
   经过 file-loader 处理后，原始图片会被重命名并复制到产物文件夹，同时在代码中插入图片 URL 地址

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: ['file-loader'],
      },
    ],
  },
};
```

2. url-loader：有两种表现，对于小于阈值 limit 的图像直接转化为 base64 编码；大于阈值的图像则调用 file-loader 进行加载
   url-loader 同样适用于大多数图片格式，且能将许多细小的图片直接内嵌进产物中，减少页面运行时需要发出的网络请求数，在 HTTP 1.1 及之前版本中能带来正向的性能收益。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
            },
          },
        ],
      },
    ],
  },
};
```

3. raw-loader：不做任何转译，只是简单将文件内容复制到产物中，适用于 SVG 场景
   经过 raw-loader 处理后，SVG 资源会被直接复制成字符串形式：

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.svg$/i,
        use: ['raw-loader'],
      },
    ],
  },
};
```

4. 提示：除 raw-loader 外，我们还可以使用如下 Loader 加载 SVG 资源：

svg-inline-loader：能够自动删除 SVG 图片中与显式无关的各种原信息，达到压缩效果；
svg-url-loader：以 DataURL 方式导入 SVG 图片，相比于 Base64 更节省空间；
react-svg-loader：导入 SVG 图片并自动转化为 React 组件形态，效果类似 @svgr/webpack；
vue-svg-loader：导入 SVG 图片并自动转化为 Vue 组件形态。

# 在 Webpack 5 中导入图像

上述 file-loader、url-loader、raw-loader 都并不局限于处理图片，它们还可以被用于加载任意类型的多媒体或文本文件，使用频率极高，几乎已经成为标配组件！所以 Webpack5 直接内置了这些能力，开箱即可使用。

file-loader 对标到 type = "asset/resource"'：
url-loader 对标到 type = "asset" 或 type = "asset/inline"：
raw-loader 对标到 type = "asset/source"：

module.rules.type 并不只是为了取代 Loader 那么简单，更重要的目的是在 JavaScript Module 之外增加对其它资源 —— Asset Module 的原生支持，让 Webpack 有机会介入这些多媒体资源的解析、生成过程，从而有机会实现更标准、高效的资源处理模型

目前 module.rules.type 已经支持 JSON、WebAssemsbly、二进制、文本等资源类型

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.(png|jpg)$/,
-     use: ['file-loader']
+     type: 'asset/resource'
    }],
  },
};

```

```js
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.(png|jpg)$/,
-     use: [{
-       loader: 'url-loader',
-       options: {
-         limit: 1024
-       }
-     }]
+     type: "asset",
+     parser: {
+        dataUrlCondition: {
+          maxSize: 1024 // 1kb
+        }
+     }
    }],
  },
};

```

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.svg$/i,
-       use: ['raw-loader']
+       type: "asset/source"
      },
    ],
  },
};

```

# 图片相关优化

Web 页面中的图片做各种优化，提升页面性能，常见的优化方法包括：

1. 图像压缩：减少网络上需要传输的流量；
2. 雪碧图：减少 HTTP 请求次数；
3. 响应式图片：根据客户端设备情况下发适当分辨率的图片，有助于减少网络流量；
4. CDN：减少客户端到服务器之间的物理链路长度，提升传输效率；
   等等。

5. 图像压缩
   Webpack 生态中有不少优秀的图像压缩组件，包括：image-webpack-loader、imagemin-webpack-plugin、image-minimizer-webpack-plugin 等，以我的使用经验来看，image-webpack-loader 组件功能齐全且用法简单，更推荐使用

   image-webpack-loader 底层依赖于 imagemin 及一系列的图像优化工具：

mozjpeg：用于压缩 JPG(JPEG) 图片；
optipng：用于压缩 PNG 图片；
pngquant：同样用于压缩 PNG 图片；
svgo：用于压缩 SVG 图片；
gifsicle：用于压缩 Gif 图；
webp：用于将 JPG/PNG 图压缩并转化为 WebP 图片格式。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        // type 属性适用于 Webpack5，旧版本可使用 file-loader
        type: 'asset/resource',
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              // jpeg 压缩配置
              mozjpeg: {
                quality: 80,
              },
            },
          },
        ],
      },
    ],
  },
};
```

图像压缩是一种非常耗时的操作，建议只在生产环境下开启

```js
module.exports = {
  // ...
  module: {
    rules: [{
      // ...
      use: [{
        loader: 'image-webpack-loader',
        options: {
+         disable: process.env.NODE_ENV === 'development'
          // ...
        }
      }]
    }],
  },
};

```

2. 雪碧图
   在 HTTP 2 之前，HTTP 请求-响应是一种性能低下的通讯模型，即使是为了请求一个非常少的数据，也可能需要完整经历：建立 TCP 连接 => 发送 HTTP 请求 => 服务端处理 => 返回响应数据整个过程，加之 HTTP 协议的队首阻塞、浏览器并发请求数限制等原因，迫使我们必须尽量减少 HTTP 请求数以提升网络通讯效率。

可以将许多细小的图片合并成一张大图 —— 从而将复数次请求合并为一次请求，之后配合 CSS 的 background-position 控制图片的可视区域，这种技术被称作“雪碧图”。

ebpack 中，我们可以使用 webpack-spritesmith 插件自动实现雪碧图效果

webpack-spritesmith 插件会将 src.cwd 目录内所有匹配 src.glob 规则的图片合并成一张大图并保存到 target.image 指定的文件路径，同时生成兼容 SASS/LESS/Stylus 预处理器的 mixins 代码

```js
yarn add -D webpack-spritesmith

module.exports = {
  // ...
  resolve: {
    modules: ['node_modules', 'assets'],
  },
  plugins: [
    new SpritesmithPlugin({
      // 需要
      src: {
        cwd: path.resolve(__dirname, 'src/icons'),
        glob: '*.png',
      },
      target: {
        image: path.resolve(__dirname, 'src/assets/sprite.png'),
        css: path.resolve(__dirname, 'src/assets/sprite.less'),
      },
    }),
  ],
};
```

HTTP2 实现 TCP 多路复用之后，雪碧图的优化效果已经微乎其微 —— 甚至是反优化，可以预见随 HTTP2 普及率的提升，未来雪碧图的必要性会越来越低

3. 响应式图片
   Webpack 中有不少能够自动生成响应式图片的组件，例如： resize-image-loader、html-loader-srcset、responsive-loader 等，以 responsive-loader 为例

实践中我们通常没必要对项目里所有图片都施加响应式特性，因此这里使用 resourceQuery 过滤出带 size/sizes 参数的图片引用

```js
yarn add -D responsive-loader sharp
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.(png|jpg)$/,
      oneOf: [{
        type: "javascript/auto",
        resourceQuery: /sizes?/,
        use: [{
          loader: "responsive-loader",
          options: {
            adapter: require("responsive-loader/sharp"),
          },
        }],
      }, {
        type: "asset/resource",
      }],
    }],
  }
};

```

引用参数 './webpack.jpg?sizes[]=300,sizes[]=600,sizes[]=1024'; 最终将生成宽度分别为 300、600、1024 三张图片，之后设置 img 标签的 srcset 属性即可实现图片响应式功能。

```js
// 引用图片，并设置响应式参数
import responsiveImage from './webpack.jpg?sizes[]=300,sizes[]=600,sizes[]=1024';

const Picture = function () {
  return (
    <img
      srcSet={responsiveImage.srcSet}
      src={responsiveImage.src}
      sizes="(min-width: 1024px) 1024px, 100vw"
      loading="lazy"
    />
  );
};
```

还能简单地通过 size 参数精确控制不同条件下的图像尺寸：

```js
.foo {
    background: url("./webpack.jpg?size=1024");
}

@media (max-width: 480px) {
    .foo {
        background: url("./webpack.jpg?size=300");
    }
}

```