import { Component } from "react";
import Taro from '@tarojs/taro';
import { router } from './tools/util';
import { cloudFunction } from './tools/cloud';
import "./app.scss";

class App extends Component {
  componentDidMount() {
    const updateManager = Taro.getUpdateManager();
    const userInfo = Taro.getStorageSync('userInfo');
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          Taro.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (r) {
              if (r.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          Taro.showModal({
            title: '更新提示',
            content: '新版本下载失败，请删除小程序重新后重新搜索打开',
            showCancel: false
          })
        })
      }
    })
    this.cloudInit();
    if (!userInfo) {
      router.reLaunch('login');
    } else {
      cloudFunction({ name: 'hasLogin' }).then((res: any) => {
        if (res) {
          Taro.setStorage({ key: 'userInfo', data: res });
        } else {
          Taro.removeStorageSync('userInfo');
          router.reLaunch('login');
        }
      });
    }
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  cloudInit = () => {
    if (!Taro.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      Taro.cloud.init({
        env: 'cloud1-4gsyxy4be34d511f',
        traceUser: true
      })
    }
  }

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
