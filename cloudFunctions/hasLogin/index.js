// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async () => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database({
    throwOnNotFound: false
  });
  return new Promise((resolve) => {
    db.collection('user').where({
      openid: wxContext.OPENID
    }).get().then((res) => {
      if (res.data[0]) {
        resolve({ ...res.data[0] });
      } else {
        resolve();
      }
    })
  });
}