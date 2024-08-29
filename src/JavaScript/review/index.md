# 嵌入元素
## 绘制图片
- canvas 画布 -js | 2D图形 | 重新绘制
  - 分辨率强相关
  - 不支持动态事件
  - 文本渲染
  - 图形保存
  - 支持动态

- svg -可缩放矢量图形 - js css | 矢量图形 | 支持独立单元事件
  - 不依赖分辨率，不失真
  - 动态js事件支持
  - 文本渲染，动态文本
  - 复杂度高内容数据大时，效率低

## 局部页面
iframe

优点： 
    - 独立加载内容
    - 可以使用并行加载
    - 实现在子域下的通信 postMessage

缺点：
    - iframe加载完成阻塞整个onload
    - SEO 不友好
    - 不易管理


# web存储
  localStorage - 没有绝对的时间限制，可以跨页面（单一域名）
  sessionStorage - 一个会话周期，针对一个session
  window - 生命周期，当前页面，执行主区域内

  .appcahce 离线缓存 （优雅降级）
  <html lang="en" manifest="index.manifest">
  cache.manifest
        CACHE:
        NETWORK:
        FALLBACK:

  window.applicationCache

  * 离线缓存有限制
  * 缓存manifest html同域


# meta标签
描述网页文档自身属性

1. 编码类型
<meta charset="UTF-8">

2. 关键词
<meta content="666" name="keywords">

3. 描述
<meta content="this is 666" name="description>

4. 重定向
<meta content="url=xxx" http-equiv="refresh">


5. 适配
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

6. SEO
<meta name="robots" content="index, follow">
 - all
 - none
 - index 仅文件可以检索
 - follow 仅链接可以检索
 - noindex 仅文件不可检索
 - nofollow


 # script标签资源加载方式

 <script></script>
 解析，阻塞，执行


 <script defer></script>
 解析，加载 + 解析（不阻塞）解析完成，再执行

 <script async></script>
  解析，加载 + 解析（不阻塞） 下载完成立即执行，阻塞

  # html
  ## 1 引入外部
    src - 资源
      暂停其他行为，进行下载和处理
    
    href - 超文本
      链接行为，并行加载