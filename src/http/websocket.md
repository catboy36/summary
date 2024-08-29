## websocket
websocket是一种网络传输协议，位于OSI模型的应用层，可在单个TCP连接上进行全双工通信，能更好的节省服务器资源和带宽，并达到实时通讯

客户端和服务器只需要完成一次握手，两者之间就可以创建持久性的连接，并进行双向数据传输

### 特点

#### 全双工
通信运行数据在两个方向上同时传输，它在能力上相当于两个单工通信方式的结合

#### 二进制帧
采用了二进制帧结构，语法，语义与HTTP完全不兼容，相比HTTP2，websocket更侧重与实时通信，而HTTP2更侧重于提高传输效率，所以两者帧结构也有很大区别

不像HTTP2那样定义流，也就不存在多路复用，优先级的等特性

自身就是全双工，也不需要服务器推送

#### 协议名
引入ws和wss分别代表明文和密文websocket协议，且默认端口使用80或443，几乎和http一致

#### 握手
websocket也要有个握手过程，然后才能正式收发数据

客户端

```javascript
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dadadafuqeidhq
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```
1. Connection: 必须设置Upgrade,表示客户端希望连接升级
2. Upgrade： 必须设置WebSocket，表示希望升级到WebSocket协议
3. Sec-WebSocket-Key： 客户端发送的一个base64编码密文，用于简单的认证秘钥。服务端必须返回一个对应加密的 Sec-WebSocket-Accept应答，否则客户端会抛出错误，关闭连接
4. Sec-WebSocket-Version：表示支持的WebSocket版本

服务端：

```javascript
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: djfhlahfoiqfnoiqhf
```
1. HTTP/1.1 101 Switching Protocols: 表示服务端接受WebSocket协议的客户端连接

2. Sec-WebSocket-Accept： 验证客户端请求报文，同样也是为了防止误连接，做法是把请求头里Sec-WebSocket-key的值，加上一个专用的UUID，再摘要计算

#### 优点
1. 较少的控制开销：数据包头部协议较小
2. 更强的实时性
3. 保持连接状态
4. 更好的二进制支持
5. 支持拓展
6. 更好的压缩效果：Websocke在适当扩展支持下，可以沿用之前内容的上下文，在传递类似的数据时，可以显著提高压缩率

#### 应用场景
1. 弹幕
2. 媒体聊天
3. 协调编辑
4. 基于位置更新
5. 体育实况更新
6. 股票基金报价实时更新


