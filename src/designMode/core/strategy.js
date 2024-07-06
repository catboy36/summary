// 策略模式
// 定义一系列算法，把他们一个个封装起来，目的就是将算法的使用与算法的实现分离开

// 基于策略模式的程序至少两部分组成
// 策略类，封装算法具体实现，负责具体的计算过程
// 环境类context，接收客户的请求，随后把请求委托给某个策略类

var obj = {
  A: function (salary) {
    return salary * 4;
  },
  B: function (salary) {
    return salary * 3;
  },
  C: function (salary) {
    return salary * 2;
  },
};
var calculateBouns = function (level, salary) {
  return obj[level](salary);
};
console.log(calculateBouns("A", 10000));


// 表单校验
var strategy = {
  isNotEmpty: function (value, errorMsg) {
    if (value === "") {
      return errorMsg;
    }
  },
  //
  minLength: function (value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg;
    }
  },
  //
  mobileFormat: function (value, errorMsg) {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  },
};

var Validator = function () {
  this.cache = []; //
};
Validator.prototype.add = function (dom, rule, errorMsg) {
  var str = rule.split(":");
  this.cache.push(function () {
    // str minLength:6
    var strategy = str.shift();
    str.unshift(dom.value); // input value
    str.push(errorMsg); // errorMsg
    return strategys[strategy].apply(dom, str);
  });
};
Validator.prototype.start = function () {
  for (var i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
    var msg = validatorFunc(); //
    if (msg) {
      return msg;
    }
  }
};


// 策略模式优点
// 1. 利用组合委托等技术和思想，有效避免很多if语句
// 2. 符合开放封闭原则，使代码更容易理解和扩展
// 3. 代码可复用

// 只要业务规则指向目标一致，且可以被替换使用，就可以用策略模式封装它们
