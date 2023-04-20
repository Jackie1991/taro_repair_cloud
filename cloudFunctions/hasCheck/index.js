// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event) => {
  const { inviteCode } = event;
  const db = cloud.database({
    throwOnNotFound: false
  });
  return new Promise((resolve) => {
    db.collection('checkCode').where({ inviteCode }).get().then((res) => {
      if (res.data.length) {
        resolve(res.data[0]);
      } else {
        resolve();
      }
    })
  });
}