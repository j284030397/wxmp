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
    this.setData({
      goodsid: options.goodsid,
      shopid: options.shopid,
    })
    app.shopId= this.data.shopid;
    console.log(app.shopId)
    this.getGoodsById();
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
  getGoodsById: function (fn) {
    let that = this;
    let shopid = that.data.shopid;
    let goodsid = that.data.goodsid;
    let customerId = '123';
    console.log(goodsid);
    //let status = 0;
    let createTime = '2018-07-16 15:44:53';
    //console.log(app.globalData.serverPath)
    wx.request({
      method: 'GET',
      url: app.globalData.serverPath + '/mp/mpShopGoodsById/' +shopid+'/'+goodsid,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        shopid: shopid,
        goodsid: goodsid,
        // searchPageNum: that.data.searchPageNum,
        // callbackcount: that.data.callbackcount,
      },
      success: function (res) {
        console.log(res);
        if (res.data.success == true) {
          let data = res.data.data;
          that.setData({
            mydata: res.data.data.result
          })
          //console.log(that.data.mydata.descL);
        }

      }
    })
  },
  showModal: function (e) {
    var type = e.currentTarget.dataset.type;
    var showModalStatus = e.currentTarget.dataset.statu == 'open' ? true : false;
    var goodsPrice = this.goodsPrice = type == 'group' ? this.data.mydata.tprice : this.data.mydata.price;
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
    app.mydata = this.data.mydata; 
    app.num=this.data.num;
   // console.log(this.data.mydata.goodsId + app.goodsId);
    if (this.data.mydata.goodsid){
      if(this.propValue &&(this.propValue.length==this.goodsInfo.property.length)){
        app.redirect('goods/payfor');
      }else{
        app.showToast(this,'请选择商品属性')
      }
    }else{
      app.redirect('goods/payfor');
    }
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