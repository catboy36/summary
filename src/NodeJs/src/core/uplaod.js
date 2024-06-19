// 文件上传
// content-type:multipart/form-data

// 文件上传
// 文件解析

const koaBody = require("koa-body");
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 2M
    },
  })
);

router.post("/uploadfile", async (ctx, next) => {
  //
  const file = ctx.request.files.file; //
  //
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, "public/upload/") + `/${file.name}`;
  //
  const upStream = fs.createWriteStream(filePath);
  //
  reader.pipe(upStream);
  return (ctx.body = "upload success!");
});

const multer = require("koa-multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
});
const fileRouter = new Router();
fileRouter.post("/upload", upload.single("file"), (ctx, next) => {
  console.log(ctx.req.file); //
});
app.use(fileRouter.routes());
