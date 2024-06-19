// JWT JSON Web Token 本质就是一个字符串书写规范，作用是在用户和服务器之间传递安全可靠的信息

// Token分三部分，头部header 载荷 payload 签名signature，并以.进行拼接
// 其中头部和载荷是以JSON格式存放数据，只是进行了编码

// header
// 每个jwt都会有头部，主要声明使用的算法，声明算法的字段为alg，还有个
// typ字段，默认JWT即可
// HS256算法示例
// { "alg": "HS256", "typ": "JWT" }
// 对上述内容Base64编码
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

// payload
// 消息体，会放实际内容，就是token的数据声明，例如用户的id和name，默认情况下也会携带
// 令牌的签发时间iat,还可以设置过期时间
// {
//     "sub": "1234567890",
//     "name": "John Doe",
//     "iat": 1516239022
//    }
// base64编码
// eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ

// signature
// 签名是对头部和载荷内容进行签名，一般设置一个secretKey，对前面两个结果进行HMACSHA25算法
// Signature = HMACSHA256(base64Url(header)+.+base64Url(payload),secretKey)

// 一旦前两部分数据被篡改，只要服务器加密要是没有泄露，那签名肯定和之前签名不一致

// 实现
// token使用分两部分
// 1. 生成token:登录成功，颁发token
// 2. 验证token:访问某些资源或接口时，验证token

// 借助第三方库jsonwebtoken
const crypto = require("crypto"),
  jwt = require("jsonwebtoken");
// TODO:
//
let userList = [];
class UserController {
  //
  static async login(ctx) {
    const data = ctx.request.body;
    if (!data.name || !data.password) {
      return (ctx.body = {
        code: "000002",
        message: " ",
      });
    }
    const result = userList.find(
      (item) =>
        item.name === data.name &&
        item.password ===
          crypto.createHash("md5").update(data.password).digest("hex")
    );
    if (result) {
      // token
      const token = jwt.sign(
        {
          name: result.name,
        },
        "test_token", // secret
        { expiresIn: 60 * 60 } // 60 * 60 s
      );
      return (ctx.body = {
        code: "0",
        message: " ",
        data: {
          token,
        },
      });
    } else {
      return (ctx.body = {
        code: "000002",
        message: " ",
      });
    }
  }
}
module.exports = UserController;

// 前端请求带上token
// axios.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   config.headers.common["Authorization"] = "Bearer " + token; //
//   Authorization;
//   return config;
// });

// 校验token
// koa-jwt
// 放在路由前面
app.use(
  koajwt({
    secret: "test_token",
  }).unless({
    //
    path: [/\/api\/register/, /\/api\/login/],
  })
);

// 获取token
// router.get('/api/userInfo',async (ctx,next) =>{
//     const authorization = ctx.header.authorization // jwt
//     const token = authorization.replace('Beraer ','')
//     const result = jwt.verify(token,'test_token')
//     ctx.body = result

// 非对称加密：利用私钥发布令牌，公钥验证令牌，加密算法可选rs256

// 优点
// 1.json具有通用性，跨语言
// 组成简单，字节占用少，便于传输
// 服务端无需保存会话信息，很容易水平扩展
// 一处生成，多出使用，在分布式系统中，解决单点登录问题
// 可以防护CSRF攻击

// 缺点
// payload部分仅仅是进行简单编码，只能存逻辑必需的非敏感信息
// 保护好加密密钥，泄露后果不堪设想
// 为避免token被劫持，最好使用https
