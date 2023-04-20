// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event) => {
  const { params, _id } = event;
  const db = cloud.database({
    throwOnNotFound: false
  });
  console.log({ ...params, status: 3 }, _id);
  return new Promise((resolve) => {
    db.collection('repairList').where({
      _id
    }).update({
      data: { ...params, status: 3 }
    }).then((ures) => {
      if (ures.stats.updated > 0) {
        resolve({
          code: 200,
          message: '评价成功'
        })
      } else {
        resolve({
          code: 404,
          message: '评价失败，未知原因'
        })
      }
    })
  });
}