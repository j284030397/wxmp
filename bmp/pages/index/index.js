//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    searchSongList: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isFromSearch: true,  
    searchPageNum: 1, 
    callbackcount: 3,  
    searchLoading: false, 
    searchLoadingComplete: false,
    goodsId:'',
    shopId:'',
    rootPath: app.globalData.serverPath
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/index/index?shopId='+this.data.shopId
    }
  },
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    
    wx.stopPullDownRefresh;
  },
  onReachBottom:function(){
    console.log('加载更多');
    this.getGoodsList();
  },
  //事件处理函数
  showGoodsDetial: function (e) {
    var goodsid = e.currentTarget.dataset.goodsid
   // console.log(shopId),
    // if (!gid) return;
    //app.redirect('goods/detail', 'gid=' + gid)
    wx.redirectTo({ url: '/pages/goods/detail?shopid=1&goodsid=' + goodsid})
  },
  onLaunch: function (options) {
   
  },
  onLoad: function (options) {
  
    if (options.shopId==null){
      console.log('options is null.');
      this.setData({
        shopId: app.globalData.userInfo.sid
      })
   }else{
      this.setData({
        shopId: options.shopId
      })
   }
    console.log('options is null end.');
    console.log(this.data.shopId);
   
    this.getGoodsList();
  },
  click_b: function (options){
    wx.scanCode({
      success: (res) => {
        console.log(res.result);
      }
    });
    console.log("Path: " + options.scene);
  },
  getUserInfo: function(e) {
    console.log(e)
  },
  getGoodsList: function (fn) {

    let that = this;
    let shopId = 1;
    let orderType = 1;
    let customerId = '123';
    //let status = 0;
    let createTime = '2018-07-16 15:44:53';
    //console.log(app.globalData.serverPath)
    wx.request({
      method: 'GET',
      url: app.globalData.serverPath + '/mp/mpShopGoodsk/' + that.data.shopId,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        // shopId: shopId,
        // orderType: orderType,
        // customerId: customerId,
        // // status: status,
        // createTime: createTime,
        // searchPageNum: that.data.searchPageNum,
        // callbackcount: that.data.callbackcount,
      },
      success: function (res) {
       // console.log(res);
        if (res.data.success == true) {
          let data = res.data.data;
          that.setData({
            searchSongList: res.data.data,
          })
          //console.log(that.data.searchSongList.result[0]);
        }

      }
    })
  },
})
