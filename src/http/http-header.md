## HTTP 请求头

HTTP 头字段，是指在 HTTP 的请求和相应消息中的消息头部

它们定义了一个超文本传输协议事务中的操作参数

HTTP 头部字段可以根据需要定义，因此可以有非标准头部字段

```
GET /home.html HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20
100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,_/_;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/testpage.html
Connection: keep-alive
Upgrade-Insecure-Requests: 1
If-Modified-Since: Mon, 18 Jul 2016 02:36:04 GMT
If-None-Match: "c561c68d0ba92bbeb8b0fff2a9199f722e3a621a"
Cache-Control: max-age=0
```

### 使用场景

#### 协商缓存

协商缓存是利用`Last-Modified If-Modified-Since` 和 `Etag If-None-Match`这两对请求头响应头来管理的

`Last-Modified`表示本地文件最后修改日期，浏览器会在请求头上加上`If-Modified-Since`（上次返回的`Last-Modified`的值），询问服务器在该日期后资源是否有更新，有更新的话就会将新的资源发送回来

`Etag`就像一个指纹，资源变化都会导致`Etag`变化，跟最后修改时间没有关系，`Etag`可以保证每一个资源是唯一的

`If-None-Match`的 header 会将上次返回的`Etag`发送给服务器，询问该资源的`Etag`是否有更新，有变动就会发送新的资源回来

#### 强制缓存

不需要发送请求到服务端，根据请求头`expires`和`cache-control`判断是否命中强缓存

#### 会话状态

`cookie`，类型为小型文本文件，指某些网站为了辨别用户身份而储存在用户本地终端上的数据，通过响应头`set-cookie`决定

一般不超过 4KB

由一个名称（name），一个值（value）和其它几个用于控制 Cookie 有效期，安全性，使用范围的可选属性组成

`Cookie`主要用于以下三个方面：
会话状态管理，个性化设置，浏览器行为跟踪
