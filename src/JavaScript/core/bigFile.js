// 大文件断点续传

// 分片上传
// 将所要上传的文件，按照一定大小，将整个文件分割成多个数据块进行分片上传
// 上传完后再由服务端所有上传的文件进行整合成原始文件

// 断点续传
// 下载或上传时，将下载或上传任务人为的划分为几个部分
// 每一部分采用一个线程上传或下载，碰到网络故障，可以从已经上传或下载的部分开始继续上传下载未完成的部分，没必要从头开始，节省时间，提高速度
// 实现方式
// 1. 服务器端返回，告知从哪开始
// 2. 浏览器自行处理
// 使用场景
// 大文件加速上传，网络环境较差（失败重传失败的part）,流式上传（上传文件
// 大小不确定时开始上传，视频监控行业应用常见）

// 读取文件
// XMLHttpRequest的abort方法可以暂停切边上传
const input = document.querySelector("input");
input.addEventListener("change", function () {
  const file = this.files[0];
  const md5code = md5(file);
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.addEventListener("load", (e) => {
    // 比如每10M一个切割，实际情况要循环切割
    const slice = e.target.result.slice(0, 10 * 1024 * 1024);
    const formdata = new FormData();
    formdata.append("0", slice);
    //
    formdata.append("filename", md5code + "." + fileType);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
      //xhr.responseText
    });
    xhr.open("POST", "");
    xhr.send(formdata);
    xhr.addEventListener("progress", updateProgress);
    xhr.upload.addEventListener("progress", updateProgress);
  });
});
function updateProgress(event) {
  if (event.lengthComputable) {
    //
  }
}
