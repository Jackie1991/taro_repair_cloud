// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event) => {
  const { type } = event;
  const db = cloud.database({
    throwOnNotFound: false
  });
  return new Promise((resolve) => {
    db.collection('dictionary').where({ type }).get().then((res) => {
      if (Array.isArray(res.data)) {
        resolve(res.data);
      } else {
        resolve([])
      }
    })
  });
}