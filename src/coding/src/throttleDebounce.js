// 节流
const throttle = (fn, delay = 300) => {
  let flag = false;
  return function (...args) {
    if (!flag) {
      flag = true;
      const timer = setTimeout(() => {
        flag = false;
        fn.apply(this, args);
        clearTimeout(timer);
      }, delay);
    }
  };
};

// 防抖
const debounce = (fn, delay = 300) => {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      clearTimeout(timer);
    }, delay);
  };
};
