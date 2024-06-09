// 本地存储
// cookie,localStorage,sessionStorage,indexedDB

// cookie 4KB
// 为了解决http无状态导致的问题
// 每次请求都回被发送，如果不使用https并对其加密，信息易被盗窃，安全风险
document.cookie =
  "someCookieName=true; max-age=60000000; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

// localStorage
// 持久化本地存储，除非主动删除数据，否则数据永远不会过期
// 存储的信息在同一域中共享
// 本页面增删改localStorage时，本页面不触发storage事件，别的页面触发storage事件
// 大小：5M(和浏览器厂商有关系)
// localStorage本质是对字符串读取，内容过多会消耗内存空间，导致页面变卡
// 受同源策略限制
// setItem,getItem,key,removeItem,clear

// 缺陷：无法设置过期时间，只能存字符串，不能存对象

// sessionStorage
// 和localStorage区别在于，一旦页面（会话）关闭，sessionStorage将会删除数据

// indexedDB
// 前端数据库，Godb.js库降低操作难度

// cookie,localStorage,sessionStorage区别
// 存储大小，有效时间，数据与服务器之间交互方式（cookie的数据自动传递给服务器，服务器也可以写cookie到客户端，另外两个是本地保存）

// 存储大量数据，在线文档（富文本）保存编辑的历史情况，推荐indexedDB
// 跟踪用户行为，cookie
// 长期保存在本地的数据（令牌），localStorage
// 敏感账号一次性登录，sessionStrage

