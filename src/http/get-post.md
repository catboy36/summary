## GET 和 POST 方法

GET 和 POST 都是 HTTP 协议中发送请求的方法

### GET

GET 方法请求一个指定资源的表示形式，使用 GET 的请求应该只被用于获取数据

### POST

POST 方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用

两者本质上都是 TCP 连接，并无差别

但是由于 HTTP 的规定和浏览器/服务器的限制，导致它们在应用过程中会体现出一些区别

### 区别

1. GET 在浏览器回退时是无害的，而 POST 会再次提交请求
2. GET 产生的 URL 地址可以被 Bookmark（书签），而 POST 不可以
3. GET 请求会被浏览器主动 cache，而 POST 不会，除非手动设置
4. GET 请求只能进行 url 编码，而 POST 支持多种编码方式
5. GET 请求参数会被完整保留在浏览器记录里，而 POST 中的参数不会被保留
6. GET 请求在 URL 中传送的参数是由长度限制的，而 POST 没有
7. 对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制
8. GET 比 POST 更不安全，因为参数之间暴露在 URL 上，所以不能用来传递敏感信息
9. GET 参数通过 URL 传递，POST 参数放在 Request body 中

#### 参数位置

都是同一个传输层协议，在传输上没有区别

GET /index.html?name=qiming.c&age=22 HTTP/1.1
Host: localhost

POST /index.html HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
name=qiming.c&age=22

以上只是约定，不属于HTTP规范，可以在POST的url写入参数，GET的请求体携带参数

#### 参数长度
HTTP协议没有Body和URL长度的限制，对URL限制的大多是浏览器和服务器的原因

限制的是整个URL长度，而不仅仅是参数值的长度

服务器处理长URL要消耗比较多的资源，为了性能和安全考虑，会给HRL长度加限制


#### 安全
POST比GET安全，因为数据在地址栏不可见

传输角度，都不安全，HTTP在网络上明文传输，只要网络节点上抓包就可以获取完整报文

只有使用HTTPS才能安全加密

#### 数据包

对于GET方式的请求，浏览器会把http header和data一并发送，服务器响应200（返回数据）

对于POST请求，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok

并不是所有浏览器都会在POST中发送两次包，firefox就只发一次

