// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event) => {
  const { _id, ...params } = event;
  const db = cloud.database({
    throwOnNotFound: false
  });
  if (params.repair) {
    params.finishTime = db.serverDate();
  }
  return new Promise((resolve) => {
    db.collection('repairList').where({
      _id
    }).update({
      data: params
    }).then((res) => {
      if (res.stats.updated > 0) {
        resolve({
          code: 200,
          message: '修改成功'
        })
      } else {
        resolve({
          code: 404,
          message: '修改失败，未知原因'
        })
      }
    })
  });
}