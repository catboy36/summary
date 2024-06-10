// 上拉加载，下拉刷新

// 上拉加载的本质是页面触底，或快要触底
const clientHeight = document.documentElement.clientHeight;
const scrollHeight = document.body.scrollHeight;
const scrollTop = document.documentElement.scrollTop;

const distance = 50;
if (scrollTop + clientHeight >= scrollHeight - distance) {
  console.log("loading...");
}

// 下拉刷新
// 1.监听touchstart事件，记录初始位置的值，e.touched[0].pageY
// 2.监听touchmove事件，记录并计算当前滑动的位置与初始位置差值，大于0表示向下拉动
// 借助translateY使元素跟随手势向下滑动对应差值，也设置一个允许滑动最大距离
// 3.监听touchend事件，若此时元素滑动到最大值，触发callback，同时元素translateY重设为0，元素回到初始位置
var _element = document.getElementById("refreshContainer"),
  _refreshText = document.querySelector(".refreshText"),
  _startPos = 0, //
  _transitionHeight = 0; //

_element.addEventListener(
  "touchstart",
  function (e) {
    _startPos = e.touches[0].pageY; //
    _element.style.position = "relative";
    _element.style.transition = "transform 0s";
  },
  false
);

_element.addEventListener(
  "touchmove",
  function (e) {
    // e.touches[0].pageY
    _transitionHeight = e.touches[0].pageY - _startPos; //
    if (_transitionHeight > 0 && _transitionHeight < 60) {
      _refreshText.innerText = " ";
      _element.style.transform = "translateY(" + _transitionHeight + "px)";
      if (_transitionHeight > 55) {
        _refreshText.innerText = " ";
      }
    }
  },
  false
);

_element.addEventListener(
  "touchend",
  function (e) {
    _element.style.transition = "transform 0.5s ease 1s";
    _element.style.transform = "translateY(0px)";
    _refreshText.innerText = " ...";
    // todo...
  },
  false
);
