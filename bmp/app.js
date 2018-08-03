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
    isShop:false
    // ptRuleId:'',
    // goodsId:'',
    // shopId:'',
    // customerId:'',
    // ptName:'',
    // address:'',
    // linkMan:'',
  },
  loginTimer: null,
  userTimer: null,
  timeout: 0,
  onLaunch: function () {
    // 获取用户信息
    // wx.getUserInfo({
    //   success: res => {
    //     console.log(res.userInfo)
    //     this.globalData.userInfo = res.userInfo;
    //     if (this.userInfoReadyCallback) {
    //       this.userInfoReadyCallback(res)
    //     }
    //   }
    // })

     wx.clearStorageSync();
     wx.removeStorageSync('mydata');
    // this.toLogin();
    //缓存
    try {
      let mydata = wx.getStorageSync('mydata');
      if (mydata) {
        console.log('找到身份认证缓存');
        const nowTime = new Date().getTime();
        console.log('判断是否过期失效');
        if (nowTime - mydata.time < 6 * 60 * 60 * 1000) { //缓存6小时
          console.log('还未超过6小时，有效');
          this.globalData.token = mydata.token;
          this.globalData.userInfo = mydata.userInfo;
          this.globalData.openid = mydata.openid;
          this.globalData.memberId = mydata.memberId;
          console.log(this.globalData);

        } else {
          console.log('已经失效，清除缓存重新登录');
          wx.clearStorageSync()
          this.toLogin();
        }
      } else {
        console.log('未找到身份认证缓存，重新登录');
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
         // that.getUserInfo(fn);
        }
      }
    })
  },
  getUserInfo: function (fn) {
    var that = this;
    //2、调用获取用户信息接口 
    wx.getUserInfo({
      success: function (res) {
        console.log('获取用户信息成功');
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
    console.log('获取openId和应用token');
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
          console.log('获取openid成功');
          
          let openid = res.data.data.userInfo.openId;
          that.globalData.openid = openid;
          that.globalData.token = res.data.data.userInfo.token;
          that.globalData.userInfo = res.data.data.userInfo;
          if (res.data.data.userInfo.roles != null && res.data.data.userInfo.roles=='店长'){
            that.globalData.isShop =true;
          }
          let mydata = {
            token: that.globalData.token,
            userInfo: that.globalData.userInfo,
            openid: that.globalData.openid,
            time: new Date().getTime(),
          }
          console.log('缓存认证信息');
          wx.setStorageSync('mydata', mydata);
          fn && fn();
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
  //查询订单列表
  getOrderList: function (fn) {
    let that = this;
    let shopId = 222;
    let orderType = 1;
    let customerId = '123';
    //let status = 0;
    let createTime = '2018-07-16 15:44:53';

    wx.request({
      method: 'GET',
      url: this.globalData.serverPath + '/yzbOrder/listdata',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.globalData.token
      },
      data: {
        shopId: shopId,
        orderType: orderType,
        customerId: customerId,
       // status: status,
        createTime: createTime
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
  //查询订单详情
  getOrderInfo: function (fn) {
    let that = this;
    let shopId = 222;
    let orderType = 1;
    let customerId = '123';
    //let status = 0;
    let createTime = '2018-07-16 15:44:53';

    wx.request({
      method: 'GET',
      url: this.globalData.serverPath + '/yzbOrder/listdata',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.globalData.token
      },
      data: {
        shopId: shopId,
        orderType: orderType,
        customerId: customerId,
        // status: status,
        createTime: createTime
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
  },
  getGoodsList: function (fn) {
    let that = this;
    let shopId = 222;
    let orderType = 1;
    let customerId = '123';
    //let status = 0;
    let createTime = '2018-07-16 15:44:53';
    console.log(that.globalData.serverPath)
    wx.request({
      method: 'GET',
      url: that.globalData.serverPath + '/yzbGoodsInfo/listdata',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.globalData.token
      },
      data: {
        shopId: shopId,
        orderType: orderType,
        customerId: customerId,
        // status: status,
        createTime: createTime
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
//查询订单列表
  getOrderList: function (fn) {
    let that = this;
    let shopId = 222;
    let orderType = 1;
    let customerId = '123';
    //let status = 0;
    let createTime = '2018-07-16 15:44:53';

    wx.request({
      method: 'GET',
      url: this.globalData.serverPath + '/yzbOrder/listdata',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.globalData.token
      },
      data: {
        shopId: shopId,
        orderType: orderType,
        customerId: customerId,
       // status: status,
        createTime: createTime
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
  //查询订单列表
  getOrderList: function (fn) {
    let that = this;
    let shopId = 222;
    let orderType = 1;
    let customerId = '123';
    //let status = 0;
    let createTime = '2018-07-16 15:44:53';

    wx.request({
      method: 'GET',
      url: this.globalData.serverPath + '/yzbOrder/listdata',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.globalData.token
      },
      data: {
        shopId: shopId,
        orderType: orderType,
        customerId: customerId,
        // status: status,
        createTime: createTime
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
  showModal: function (that) {
    var animation = wx.createAnimation({
      duration: 200
    })
    animation.opacity(0).rotateX(-100).step();
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      that.setData({
        animationData: animation
      });
    }.bind(that), 200)
  },
  redirect: function (url, param) {
    wx.navigateTo({
      url: '/pages/' + url + '?' + param
    })
  },
  showToast: function (that, title) {
    var toast = {};
    toast.toastTitle = title;
    that.setData({
      toast: toast
    })
    var animation = wx.createAnimation({
      duration: 100
    })
    animation.opacity(0).rotateY(-100).step();
    toast.toastStatus = true;
    toast.toastAnimationData = animation.export()
    that.setData({
      toast: toast
    })
    setTimeout(function () {
      animation.opacity(1).rotateY(0).step();
      toast.toastAnimationData = animation
      that.setData({
        toast: toast
      });
    }.bind(that), 100)
    // 定时器关闭 
    setTimeout(function () {
      toast.toastStatus = false
      that.setData({
        toast: toast
      });
    }.bind(that), 2000);
  }
})