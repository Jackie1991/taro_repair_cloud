// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event) => {
  const { params } = event;
  const wxContext = cloud.getWXContext();
  const db = cloud.database({
    throwOnNotFound: false
  });
  return new Promise((resolve) => {
    db.collection('user').where({
      openid: wxContext.OPENID
    }).get().then((res) => {
      if (res.data[0]) {
        db.collection('user').where({
          openid: wxContext.OPENID
        }).update({
          data: params
        }).then(() => {
          resolve({
            code: 200,
            message: '修改成功'
          })
        })
      } else {
        resolve({
          code: 404,
          message: '该用户不存在'
        })
      }
    })
  });
}