import utils from "./utils/util.js";
App({
  globalData: {
    userInfo: {},
    token: '',
    code: '',
    openid: '',
    appid: '',
    iv: '',
    encryptedData: '',
    secret: '',
    serverPath: 'https://www.xbang8.com/wxmp',
  },
  loginTimer: null,
  userTimer: null,
  timeout: 0,
  onLaunch: function () {
    // 获取用户信息
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo)
        this.globalData.userInfo = res.userInfo;
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })

     wx.clearStorageSync();
     wx.removeStorageSync('mydata');
    // this.toLogin();
    //缓存
    try {
      let mydata = wx.getStorageSync('mydata');

      console.log(mydata);

      if (mydata) {
        const nowTime = new Date().getTime();
        if (nowTime - mydata.time < 6 * 60 * 60 * 1000) { //缓存6小时
          this.globalData.token = mydata.token;
          this.globalData.userInfo = mydata.userInfo;
          this.globalData.openid = mydata.openid;
          this.globalData.memberId = mydata.memberId;

        } else {
          wx.clearStorageSync()
          this.toLogin();
        }
      } else {
        this.toLogin();
      }
    } catch (e) {

    }
  }, 
  toLoginPage:function(){

  },
  toLogin: function (fn) {
    let that = this;
    wx.login({
      success: function (loginres) {
        console.log('获取code')
        if (loginres.code) {//登录凭证 
          console.log(loginres.code);
          that.globalData.code = loginres.code;
          that.getUserInfo(fn);
        }
      }
    })
  },
  getUserInfo: function (fn) {
    var that = this;
    //2、调用获取用户信息接口 
    wx.getUserInfo({
      success: function (res) {
        console.log(res.encryptedData);
        console.log(res.iv);
        that.globalData.userInfo = res.userInfo;
        that.globalData.iv = res.iv;
        that.globalData.encryptedData = res.encryptedData;
        that.getOpenId(that.globalData.code, res.encryptedData, res.iv, fn);
      },
      fail: function () {
        console.log('获取用户信息失败')
      }
    })
  },
  getOpenId: function (code, encryptedData, iv, fn) {
    var that = this;
    wx.request({
      method: 'POST',
      url: that.globalData.serverPath + '/mpapi/decodeUser',
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer 123123123123'
      },
      success: function (res) {
        console.log(res);
        if (res.data.success == true) {
          console.log('获取openid')
          let openid = res.data.data.userInfo.openId;
          that.globalData.openid = openid;
          that.globalData.token = res.data.data.userInfo.token;
          that.globalData.userInfo = res.data.data.userInfo;
          let mydata = {
            token: that.globalData.token,
            userInfo: that.globalData.userInfo,
            openid: that.globalData.openid,
            time: new Date().getTime(),
          }
          wx.setStorageSync('mydata', mydata);
          fn && fn();
          console.log('获取token');
          console.log(that.globalData);

          // if (JSON.stringify(that.globalData.userInfo) === '{}') {
          //   that.userTimer = setInterval(function () {
          //     if (JSON.stringify(that.globalData.userInfo) !== '{}') {
          //       clearInterval(that.userTimer);
          //       that.getMemberLogin(openid, fn);
          //     }
          //   }, 200);
          // } else {
          //   that.getMemberLogin(openid, fn);
          // }


        }
      }

    })
  },
  getMemberLogin: function (openid, fn) {
    let that = this;
    wx.request({
      method: 'GET',
      url: this.globalData.serverPath + '/yzbGoodsInfo/findJsonById/3',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.globalData.token
      },
      data: {
       
      },
      success: function (res) {
        console.log(res);
        if (res.data.success == true) {
          let data = res.data.data;
          console.log(data);
        

        
        }

      }
    })
  },
  tokenCheck: function (fn) {
    let that = this;
    if (that.globalData.token) {
      fn && fn();
      return false;
    }
    that.loading('open', '登录中...');
    that.loginTimer = setInterval(function () {
      that.timeout += 200;
      if (that.globalData.token) {
        console.log('已登录')
        clearInterval(that.loginTimer);
        that.loading('close')
        typeof fn == 'function' && fn();
        that.timeout = 0;
      }
      //登录超时
      if (that.timeout >= 60000) {
        console.log('登录超时,重新登录');
        clearInterval(that.loginTimer);
        clearInterval(that.userTimer);
        that.timeout = 0;
        this.toLogin(fn);
      }
    }, 200);
  },
  loading: function (type, text = "加载中") {
    if (type === 'open') {
      wx.showLoading({
        title: text
      })
    } else if (type === 'close') {
      wx.hideLoading()
    }
  },
  scanFunc: function (that, fn) {
    wx.scanCode({
      success: (res) => {
        let userId = res.result;
        if (typeof userId !== 'undefined' && userId) {
          that.setData({
            userId: userId,
            pageNo: 0,
            scrollEnd: false,
          });
          fn();
          wx.setStorageSync('userId', userId);
        } else {
          wx.showModal({
            title: '提示',
            content: '参数错误,请重新扫码'
          })
        }
      }
    })
  }
  //生成订单
  ,
  createOrder: function (name, money, customerId, shopId, orderType, discount, goodsIds) {
    let that = this;

    wx.request({
      method: 'POST',
      url: this.globalData.serverPath + '/yzbOrder/createOrder',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.globalData.token
      },
      data: {
         name:name,
         money:money,
         customerId: customerId,
         shopId: shopId,
         orderType: orderType,
         discount: discount,
         goodsIds: goodsIds
      },
      success: function (res) {
        console.log(res);
        if (res.data.success == true) {
          let data = res.data.data;
          console.log(data);



        }

      }
    })
  }

})