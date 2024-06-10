// 单点登录
// Single Sign On SSO
// 在多个应用系统中，用户只需要一次登录就可以访问所有相互信任的应用系统
// SSO 一般都需要一个独立的认证中心，子系统登录均通过认证中心，子系统本身不参与登录操作

// 同域名下的单点登录
// cookie的domain属性设置为当前域的父域名，且父域的cookie会被子域所共享，path属性
// 默认为web应用的上下文路径（根路径），sessionID（或token）保存到父域中

// 不同域名下的单点登录
// 前端实现方案
// 获取登录成功后的token
var token = result.data.token;
// iframe iframe HTML
var iframe = document.createElement("iframe");
iframe.src = "http://app1.com/localstorage.html";
document.body.append(iframe);
// postMessage() token iframe
setTimeout(function () {
  iframe.contentWindow.postMessage(token, "http://app1.com");
}, 4000);
setTimeout(function () {
  iframe.remove();
}, 6000);

// iframe所加载的页面中绑定事件
window.addEventListener(
  "message",
  function (event) {
    localStorage.setItem("token", event.data);
  },
  false
);
