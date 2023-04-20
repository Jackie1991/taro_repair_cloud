// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 云函数入口函数
exports.main = async (event) => {
  const { userInfo, _id, ...rest } = event;
  const wxContext = cloud.getWXContext();
  const db = cloud.database({
    throwOnNotFound: false,
  });
  return new Promise((resolve) => {
    db.collection('user')
      .where({
        openid: wxContext.OPENID,
      })
      .get()
      .then((res) => {
        if (res.data[0]) {
          resolve({ ...res.data[0], message: '已注册用户，登录成功' });
        } else {
          if (Object.keys(rest).length < 5) {
            resolve({ message: '您还未注册账户，请先注册' });
          } else {
            db.collection('user')
              .add({
                data: {
                  ...rest,
                  createTime: db.serverDate(),
                  openid: wxContext.OPENID,
                },
              })
              .then((result) => {
                resolve({
                  ...rest,
                  _id: result._id,
                  message: '注册成功',
                });
              })
              .catch((err) => {
                console.log(err);
                resolve({
                  message: '注册失败，请稍后重试',
                });
              });
          }
        }
      });
  });
};
