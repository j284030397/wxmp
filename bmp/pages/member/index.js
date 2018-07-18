// pages/member/index.js
var app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
    let that=app;
    that.getMemberLogin();
  },
  onLaunch: function () {
    // 获取用户信息
    //getUserInfo();
  },
 
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow: function () {
    
  },
  showOrder: function (e) {
    var type = e.currentTarget.dataset.type
    app.redirect('orders/index', 'id=' + type)
  },
  showGroupIndex: function () {
    wx.switchTab({
      url: '/pages/group/index'
    })
  }
})