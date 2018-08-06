// pages/goods/detail.js
// var WxParse = require('../../wxParse/wxParse.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsid:'',
    shopid:'',
    scrollTop: 0,
    num: 1,
    mydata:'',
    rootPath: app.globalData.serverPath,
    item: {
      value:
      [
        { unique:'1', ind: 'S' },
        { unique: '2', ind: 'M' },
        { unique: '3', ind: 'L' },
      ],
    },
    name:'S',
    pname: '大小',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var systemInfo = wx.getSystemInfoSync()
    if (app.globalData.isShop){
      this.setData({
        windowHeight: systemInfo.windowHeight,
        isShop:true
      })
    }else{
      this.setData({
        windowHeight: systemInfo.windowHeight,
        groupId:options.groupId

      })
    }
   
   // app.shopId= this.data.shopid;
   // console.log(app.shopId)
    this.getGroupByTuanId();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  getGroupByTuanId: function (fn) {
    let that = this;
    wx.request({
      method: 'GET',
      url: app.globalData.serverPath + '/mp/mpShopTuanDetail/' +this.data.groupId,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
  
      },
      success: function (res) {
        console.log(res);
        if (res.data.success == true) {
          let data = res.data.data;
          that.setData({
            mydata: res.data.data.result
          })
        }

      }
    })
  },
  showModal: function (e) {
    var type = e.currentTarget.dataset.type;
    var showModalStatus = e.currentTarget.dataset.statu == 'open' ? true : false;
    var goodsPrice = this.goodsPrice = type == 'group' ? this.data.mydata.ptPrice : this.data.mydata.price;
    this.buyType = type == 'group' ? 1 : 0;
    app.showModal(this);
    this.setData({
      showModalStatus: showModalStatus,
      goodsPrice: goodsPrice
    })
  },
  selectProp: function (e) {
    var current = e.currentTarget.dataset;
    var pid = current.pid;
    var pname = current.pname;
    var name = current.name;
    var propValue = this.propValue ? this.propValue : [];
    propValue[pid] = { pname: pname, name: name };
    this.propValue = propValue;
    this.setData({
      propValue: propValue
    })
  },
  minus: function () {
    var num = this.data.num > 1 ? --this.data.num : 1
    this.setData({
      num: num
    })
  },
  plus: function () {
    var num = ++this.data.num
    this.setData({
      num: num
    })
  },
  goToBuy:function(){
    console.log('111111111111111111');
   
   let num=this.data.num;
    let that = this;
    let shopid = that.data.mydata.shopId;
    let goodsid = that.data.mydata.goodId;
    console.log(shopid + goodsid);


     wx.redirectTo({
        url: '/pages/goods/payfor?shopid=' + shopid + '&goodsid=' + goodsid+'&num=' + num
      });

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  goHome:function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
    
  },
  
})