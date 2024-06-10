// ajax
// Async JavaScript and XML
// XMLHttpRequest

// 创建xhr对象
const xhr = new XMLHttpRequest();
// 与服务器连接
xhr.open("GET", "xxx?a=b", true, "username", "password");
// 给服务器发送数据
xhr.send(null);
// 监听onreadystatechange
xhr.onreadystatechange = (e) => {
  // 0 open方法还没有调用，1 send方法还没有调用
  // 2. send方法已经调用，响应头和响应状态已经返回
  // 3.响应体下载中，responseText中已经获取部分数据
  // 4. 请求过程完成
  if (xhr.readyState === 4) {
    if (xhr.status >= 200 && xhr.status <= 300) {
      console.log(xhr.responseText);
    } else if (xhr.status >= 400) {
      console.log("错误：", xhr.status);
    }
  }
};

// 封装ajax
// ajax
function ajax(options) {
  // XMLHttpRequest
  const xhr = new XMLHttpRequest();
  //
  options = options || {};
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  const params = options.data;
  //
  if (options.type === "GET") {
    xhr.open("GET", options.url + "?" + params, true);
    xhr.send(null);
  } else if (options.type === "POST") {
    xhr.open("POST", options.url, true);
    xhr.send(params);
  }
  //
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      let status = xhr.status;
      if (status >= 200 && status < 300) {
        options.success && options.success(xhr.responseText, xhr.responseXML);
      } else {
        options.fail && options.fail(status);
      }
    }
  };
}

ajax({
  type: "post",
  dataType: "json",
  data: {},
  url: "https://xxxx",
  success: function (text, xml) {
    //
    console.log(text);
  },
  fail: function (status) {
    ////
    console.log(status);
  },
});
