// dom的顶级对象是document
// 创建节点
const domEl = document.createElement("div");
const textEl = document.createTextNode("this is a text node");
const fragment = document.createDocumentFragment();

const dataAttribute = document.createAttribute("custom");

// 获取节点
document.querySelector(".test");
document.querySelectorAll(".test");
document.getElementById("divID");
document.getElementsByClassName("class");

// innnerHTML,innerText（不返回隐藏元素的文本）,textContent(返回所有文本)
// appendChild, insertBefore,setAttribute,removeChild