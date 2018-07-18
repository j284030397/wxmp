//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
   // remark:'获得你的公开信息（昵称、头像等）',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    app.getUserInfo(this.setDatas);
  },
  setDatas:function(){
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    });
    wx.navigateTo({
      url: '../goods/detail'
    })

  },
  onLoad: function () {
  
  }

})
