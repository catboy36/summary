// 分页功能设计，前后端交互
const start = (page - 1) * pageSize;
const sql = `SELECT * FROM record limit ${pageSize} OFFSET ${start};`;
const sql1 = `SELECT COUNT(*) FROM record`;

// 后端逻辑
// 1. 获取用户参数页码数 page和每页显示的数目 pageSize，其中 page是必须传递的参数，pageSize为可选，默认 10
// 2. sql语句，利用 limit和 OFFSET关键字分页查询
// 3. 查询数据库，返回总数据量，总页数，当前页，当前页数据给前端

router.all('/api', function (req, res, next) {
  var param = '';
  // 获取参数
  if (req.method == 'POST') {
    param = req.body;
  } else {
    param = req.query || req.params;
  }
  if (param.page == '' || param.page == null || param.page == undefined) {
    res.end(JSON.stringify({ msg: ' page', status: '102' }));
    return;
  }
  const pageSize = param.pageSize || 10;
  const start = (param.page - 1) * pageSize;
  const sql = `SELECT * FROM record limit ${pageSize} OFFSET ${start};`;
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sql, function (err, results) {
      connection.release();
      if (err) {
        throw err;
      } else {
        //
        var allCount = results[0][0]['COUNT(*)'];
        var allPage = parseInt(allCount) / 20;
        var pageStr = allPage.toString();
        //
        if (pageStr.indexOf('.') > 0) {
          allPage = parseInt(pageStr.split('.')[0]) + 1;
        }
        var list = results[1];
        res.end(
          JSON.stringify({
            msg: ' ',
            status: '200',
            totalPages: allPage,
            currentPage: param.page,
            totalCount: allCount,
            data: list,
          })
        );
      }
    });
  });
});

// 分页查询关键：确定每页显示的数量 pageSize，然后根据当前页的索引 pageIndex（从 1 开始），
// 确定 LIMIT和 OFFSET应该设定的值
// LIMIT: pageSize
// OFFSET: pageSize * (pageIndex - 1)
// 从而查出第 pageIndex页的数据
