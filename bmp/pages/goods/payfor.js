var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {
      name:'欧莱雅恒放溢彩持色哑光遮瑕轻垫霜红胖子气垫持久不脱妆',
      img: '/pages/images/1.jpg',
      
    },
    goodsPrice:100,
    goodsNum:1,
    item: {
      name: 'S',
      pname: '大小',
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  minus: function () {
    var num = this.data.goodsNum > 1 ? --this.data.goodsNum : 1
    this.setData({
      goodsNum: num
    })
  },
  plus: function () {
    var num = ++this.data.goodsNum
    this.setData({
      goodsNum: num
    })
  },
  goToPay: function () {
    //跳转
    app.redirect('group/detail');
    var self = this;
    
    if (!this.data.address) {
      app.showToast(this, '请选择地址');
      
      return false;
    }
    // JSON.stringify(jsonobj)
    var data = {
      pid: app.groupPid,
      isGroup: app.buyType,
      gid: app.goodsInfo.id,
      goodsNum: app.num,
      address: JSON.stringify(this.data.address),
      totalPrice: app.goodsPrice * app.num,
      goodsProp: JSON.stringify(app.propValue)
    }
    if (this.oid) {
      return;
    }
    app.request.wxRequest({
      url: 'create-orders',
      method: "POST",
      data: data,
      success: function (res) {
        var oid = self.oid = res;
        app.request.wxRequest({
          url: 'wx-pay',
          data: { oid: res },
          success: function (res) {
            wx.requestPayment({
              'timeStamp': res.timeStamp,
              'nonceStr': res.nonceStr,
              'package': res.package,
              'signType': 'MD5',
              'paySign': res.paySign,
              'success': function (res) {
                console.log(res)
                if (data.isGroup == 1) { //拼团
                  app.redirect('group/detail', 'id=' + oid)
                } else {
                  app.redirect('orders/index', 'id=3')
                }
              },
              'fail': function (res) {
                app.redirect('orders/index', 'id=1')
                console.log(res)
              }
            })
          }
        })
      }
    })
  },
})