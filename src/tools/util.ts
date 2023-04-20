/*  方法  */
import Taro from '@tarojs/taro';

// loading start
let reqNum = 0;

export const startLoading = () => {
  if (reqNum === 0) {
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
  }
  reqNum++
}

export const endLoading = () => {
  if (reqNum <= 0) return
  reqNum--
  if (reqNum === 0) {
    Taro.hideLoading()
  }
}
// loading end

// 路由输出路径
const echoUrl = (url: string) => {
  const path = url.split('?');
  return `/pages/${path[0]}/index${path[1] ? `?${path[1]}` : ''}`;
}

export const router = {
  reLaunch: (url: string) => {
    Taro.reLaunch({
      url: echoUrl(url)
    });
  },
  navigateTo: (url: string) => {
    Taro.navigateTo({
      url: echoUrl(url)
    });
  },
  navigateBack: (num?: number) => {
    if (num && typeof num === 'number') {
      Taro.navigateBack({
        delta: num
      });
    } else {
      Taro.navigateBack();
    }
  }
}

type showType = 'success' | 'loading';
export const showToast = (content: string, iconType?: showType) => {
  Taro.showToast({
    title: content,
    icon: iconType || 'none',
    duration: 2000
  });
}

export const confirm = (content: string, callback: () => void) => {
  Taro.showModal({
    title: '提示',
    content,
    success: (res: any) => {
      if (res.confirm) {
        callback();
      }
    }
  });
}

// 图片转base64
export const imageToBase64 = (filePath: string) => {
  return new Promise(resolve => {
    const fileManager = Taro.getFileSystemManager();
    fileManager.readFile({
      filePath,
      encoding: 'base64',
      success: (res: any) => {
        resolve(`data:image/jpg;base64,${res.data}`);
      }
    });
  });
};

// 获取时间
export type formatType = 'date' | 'datetime' | 'time' | 'string';
export const getDateTime = (format?: formatType, time?: string | number) => {
  const date = time ? new Date(time) : new Date();
  const pad = (n: number) => (n + '').padStart(2, '0');
  const Y = date.getFullYear(); // 年
  const M = pad(date.getMonth() + 1); // 月
  const D = pad(date.getDate()); // 日
  const h = pad(date.getHours()); // 时
  const m = pad(date.getMinutes()); // 分
  const s = pad(date.getSeconds()); // 秒
  const YMD = [Y, M, D];
  const hms = [h, m, s];
  switch (format) {
    case 'datetime':
      return `${YMD.join('-')} ${hms.join(':')}`;
    case 'time':
      return hms.join(':');
    case 'date':
      return YMD.join('-');
    case 'string':
      return YMD.concat(hms).join('');
  }
}
