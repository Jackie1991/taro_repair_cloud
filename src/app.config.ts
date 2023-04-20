export default {
  pages: [
    "pages/index/index",
    "pages/details/index",
    "pages/login/index",
    "pages/about/index",
    "pages/booking/index",
    "pages/appraise/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "报修系统",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#000000",
    selectedColor: "#2d9dfb",
    backgroundColor: "#ffffff",
    list: [{
      pagePath: "pages/index/index",
      iconPath: "assets/icons/shouye.png",
      selectedIconPath: "assets/icons/shouye_on.png",
      text: "维修记录"
    }, {
      pagePath: "pages/about/index",
      iconPath: "assets/icons/huiyuan.png",
      selectedIconPath: "assets/icons/huiyuan_on.png",
      text: "我的"
    }]
  },
  lazyCodeLoading: 'requiredComponents'
};
