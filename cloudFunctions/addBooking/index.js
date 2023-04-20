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
    db.collection('repairList').add({
      data: {
        ...params,
        status: 0,
        createTime: db.serverDate(),
        openid: wxContext.OPENID
      }
    }).then((res) => {
      if (res._id) {
        resolve({
          code: 200,
          message: '申请报修成功'
        })
      } else {
        resolve({
          code: 444,
          message: '申请报修失败'
        })
      }
    }).catch(() => {
      resolve({
        code: 555,
        message: '数据添加失败'
      })
    })
  });
}