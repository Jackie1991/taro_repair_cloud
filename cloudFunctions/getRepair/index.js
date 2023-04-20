// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database({
    throwOnNotFound: false,
  });
  const { page, userType, status } = event;
  const _ = db.command;
  let where = null;
  if (userType === 1) {
    where = {
      openid: wxContext.OPENID,
      status: status >= 0 ? status : _.gte(0),
    };
  } else if (userType === 2) {
    if (status >= 0) {
      where =
        status > 0
          ? {
              repairOpenid: wxContext.OPENID,
              status,
            }
          : { status };
    } else {
      where = _.or([{ status: 0 }, { status: _.gt(0), repairOpenid: wxContext.OPENID }]);
    }
  }

  return new Promise((resolve) => {
    db.collection('repairList')
      .where(where)
      .skip(page)
      .limit(10)
      .get()
      .then((res) => {
        db.collection('repairList')
          .where(where)
          .count()
          .then(({ total }) => {
            resolve({ list: res.data, total });
          });
      });
  });
};
