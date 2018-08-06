var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: {   
    },
    goodsPrice:100,
    goodsNum:app.num,
    item: {
      name: 'S',
      pname: '大小',
    },
    address: false,
    rootPath: app.globalData.serverPath

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(app.mydata.goodsId+app.num);
    var address = this.data.address = wx.getStorageSync('address')
  
    var shopId = options.shopid;
    var goodsid = options.goodsid;
    var num = options.num;
    this.setData({
      address: address,
      shopId: shopId,
      goodsId: goodsid,
      goodsNum: app.num!=null?app.num:1,
    //  mydata: app.mydata,
    //  goodsNum: app.num,
      
    });
    this.getGoodsById();
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
  getGoodsById: function (fn) {
    var that = this;
    let shopId = that.data.shopId;
    let goodsId = that.data.goodsId;
    let customerId = '123';
   
    //let status = 0;
    let createTime = '2018-07-16 15:44:53';
    //console.log(app.globalData.serverPath)
    wx.request({
      method: 'GET',
      url: app.globalData.serverPath + '/mp/mpShopGoodsById/' + shopId + '/' + goodsId,
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
          });
          //console.log(that.data.mydata);

          //console.log(that.data.mydata.descL);
        }

      }
    })
  },
  goToPay: function () {
    //跳转
   // app.redirect('group/detail');
    var that = this;
    console.log(that.mydata);
    if (!this.data.address) {
      app.showToast(this, '请选择地址');
      return false;
    }
    // JSON.stringify(jsonobj)
    var data = {
      ptRuleId: that.data.mydata.ruleId,
      goodsId: that.data.mydata.goodsId,
      shopId: that.data.shopId,
      customerId: app.globalData.userInfo.sid,
      ptName: that.data.mydata.ptName,
      address: this.data.address.detailInfo,
      num: this.data.goodsNum,
      //totalPrice: app.mydata.goodsPrice * app.num,
      linkMan: this.data.address.userName,
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
        let mydata = res;
        let orderNo = res.data.data.orderNo;
        let tuanId = res.data.data.tuanId;
        console.log(res)
        console.log(orderNo)

        // if (data.isGroup == 1) { //拼团
       // app.redirect('group/detail', 'orderNo=' + orderNo + "&tuanId" + tuanId)
        wx.navigateTo({
          url: '/pages/group/detail?orderNo=' + orderNo + '&tuanId=' + tuanId
        })
        // } else {
        //   app.redirect('orders/index', 'id=3')
        // }
      }
    })
  },
})