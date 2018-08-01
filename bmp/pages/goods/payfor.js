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
    address: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(app.mydata.goodsId+app.num);
    var address = this.data.address = wx.getStorageSync('address')
    this.setData({
      address: address,
      mydata: app.mydata,
      goodsNum: app.num,
    })
  },
  getWxAddress: function () {
    var self = this;
    wx.chooseAddress({
      success: function (res) {
        self.data.address = {
          userName: res.userName,
          telNumber: res.telNumber,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo
        };
        wx.setStorage({
          key: "address",
          data: self.data.address
        })
        self.setData({
          address: self.data.address
        })
      }
    })
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
      ptRuleId: 9,
      goodsId: app.mydata.goodsId,
      shopId: app.shopId,
      customerId: 105,
      ptName: app.mydata.ptName,
      address: JSON.stringify(this.data.address.detailInfo),
      //totalPrice: app.mydata.goodsPrice * app.num,
      linkMan: JSON.stringify(this.data.address.userName),
      phone: JSON.stringify(this.data.address.telNumber),
      City: JSON.stringify(this.data.address.cityName),
    }
    if (this.oid) {
      return;
    }
    console.log(data)
    wx.request({
      url: app.globalData.serverPath + '/mp/mpKaiTua',
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success: function (res) {
        var oid = self.oid = res;
        console.log(res)
      }
    })
  },
})