import Taro from '@tarojs/taro';
import { endLoading, startLoading } from '../tools/util';

type paramsType = {
  name: string
  data?: Object
}
export const cloudFunction = (params: paramsType) => {
  startLoading()
  return Taro.cloud
    .callFunction(params)
    .then(res => {
      endLoading()
      return res.result
    })
    .catch(err => {
      endLoading()
      throw err
    })
}
