// 判断元素是否在可视区域

// offsetTop,scrollTop
function isInViewPortOfOne(el) {
  const viewPortHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  const offsetTop = el.offsetTop;
  const scrollTop = document.documentElement.scrollTop;
  const top = offsetTop - scrollTop;
  return offsetTop >= scrollTop && top <= viewPortHeight;
}
// getBoundingClientRect
function isInViewPortOfTwo(el) {
  const viewWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const viewHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  const { left, top, right, bottom } = el.getBoundingClientRect();
  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}
// intersctionObserver
// 不用进行事件监听，性能方面比getBoundingClientRect好很多
// 步骤：1.创建观察者
// threshold 表示重叠面积占被观察者的比例，0-1取值，1代表完全被包含
// root必须时目标元素的父级元素
const options = { threshold: 1.0, root: document.querySelector("#scrollArea") };

// callback在重叠比例超过threshold时会执行
const callback = function (entries, observer) {
  entries.forEach((entry) => {
    entry.time; // 触发时间
    entry.rootBounds; // 根元素的位置矩形，目前为视窗位置
    entry.boundingClientRect; // 被观察者的位置矩形
    entry.intersectionRect; // 重叠区域的位置矩形
    entry.intersectionRatio; // 重叠区域占被观察者面积的比例（被观察者不是矩形时也按照矩形计算）
    entry.target; // 被观察者
  });
};

const observer = new IntersectionObserver(callback, options);

// 传入被观察者
const target = document.querySelector(".target");
observer.observe(target);

// 例子
function getYellow(entries, observer) {
  entries.forEach((entry) => {
    $(entry.target).css("background-color", "yellow");
  });
}
const observer2 = new IntersectionObserver(getYellow, { threshold: 1.0 });
$targets.each((index, element) => {
  observer.observe(element);
});
