// 代理模式
// 为一个对象提供一个代用品或占位符，以便控制对它的访问
// 代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要时，提供一个替身对象来控制这个对象的访问，客户实际上访问的是替身对象

// const proxy = new Proxy(target, handler);
// 按照功能来划分，js代理模式常用有：缓存代理，虚拟代理

// 缓存代理
// 缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果

// 虚拟代理
// 虚拟代理把一些开销很大的对象，延迟到真正需要他的时候才去创建
// 常见图片预加载：
let MyImage = (function () {
  let imgNode = document.createElement("img");
  document.body.appendChild(imgNode);
  // Image
  let img = new Image();
  img.onload = function () {
    // src
    imgNode.src = img.src;
  };
  return {
    setSrc: function (src) {
      // loading
      imgNode.src =
        "https://img.zcool.cn/community/01deed576019060000018c1bd2352d.gif";
      // Image src
      img.src = src;
    },
  };
})();
MyImage.setSrc("https://xxx.jpg");

// 开启代理
// img setSrc
let myImage = (function () {
  let imgNode = document.createElement("img");
  document.body.appendChild(imgNode);
  return {
    //setSrc img src
    setSrc: function (src) {
      imgNode.src = src;
    },
  };
})();
//
let proxyImage = (function () {
  // Image
  let img = new Image();
  img.onload = function () {
    // src
    myImage.setSrc(this.src);
  };
  return {
    setSrc: function (src) {
      // loading
      myImage.setSrc(
        "https://img.zcool.cn/community/01deed576019060000018c1bd2352d.gif"
      );
      img.src = src;
    },
  };
})();

// 代理对象和本体接口的一致性

// 使用代理模式代理对象的访问方式，一般称为拦截器
