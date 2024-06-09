// 强制转换---显示转换
Number(undefined);
Number(null);
Number(true);
Number(false);
Number("");
Number("123");
Number("false");
// Number(Symbol())
Number({
  a: 3,
  value: 6,
  toPrimitive: () => {
    return 666;
  },
});

parseInt("78da");

String(undefined);
String(true);
String(false);
String(0);
String(34);
String({ a: 8 });
String([1, 2, 34, 67, "ad"]);

Boolean(undefined); // false
Boolean(null); // false
Boolean(0); // false
Boolean(NaN); // false
Boolean(""); // false
Boolean({}); // true
Boolean([]); // true
Boolean(new Boolean(false)); // true

// 自动转换---隐式转换
// 比较运算，算术运算
// null转为数值时为0，undefined转为数值时，值为NaN