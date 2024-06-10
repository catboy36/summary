// 节流
// n秒内只运行一次，若在n秒内重复触发，只有第一次生效
function throttled1(fn, delay = 500) {
  let oldtime = Date.now();
  return function (...args) {
    let newtime = Date.now();
    if (newtime - oldtime >= delay) {
      fn.apply(null, args);
      oldtime = Date.now();
    }
  };
}

function throttled2(fn, delay = 500) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}

function throttled(fn, delay) {
  let timer = null;
  let startTime = Date.now();
  return function (...args) {
    const currentTime = Date.now();
    const remaining = delay - (currentTime - startTime);
    const context = this;
    clearTimeout(timer);
    if (remaining <= 0) {
      fn.apply(context, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(() => fn.apply(context, args), remaining);
    }
  };
}

// 防抖
// n秒后执行事件，若在n秒内重复触发，则重新计时
function debounce(fn, wait) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}
// 可以加入第三个参数，用于控制是否需要立即执行
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout); // timeout 不为null
    if (immediate) {
      let callNow = !timeout; // 第一次立即执行，以后只有事件执行后才会再次触发
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) {
        func.apply(context, args);
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}

// 相同：
// 都可以通过setTimeout实现，目的都是降低回调执行频率，节省计算资源

// 不同：
// 防抖关注一定时间连续触发事件，只执行最后一次，函数节流一段时间内只执行一次
// 防抖在一段连续操作结束后，处理回调，利用clearTimeout和setTimeout实现，节流在一段连续操作中，每段时间只执行一次，高频事件中使用提高性能
