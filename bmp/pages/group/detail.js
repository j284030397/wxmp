// pages/goods/payfor.js
var app = getApp();
var date1 = new Date();
var createTime = date1.getFullYear() + "-" + date1.getMonth() + "-" + date1.getDate();
Page({
  data: {
    goodsNum:1,
    groupInfo:{
      groupStatus:'拼团中',
      isSelf:true,
      name:'欧莱雅恒放溢彩持色哑光遮瑕轻垫霜红胖子气垫持久不脱妆',
      img:'/pages/images/1.jpg',
      oid:'10',
      groupNum: '5' ,
      saleNum: '54',
      leftNum:'2',
      gprice: '100',
      createTime: createTime
    },
  },
  onLoad: function (options) {
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
  minus: function () {
    var num = app.num > 1 ? --app.num : 1
    this.setData({
      goodsNum: num
    })
  },
  plus: function () {
    var num = ++app.num
    this.setData({
      goodsNum: num
    })
  },
  onShow: function () {
    var id = this.id;
    var self = this;
    // app.request.wxRequest({
    //   url: 'group-detail',
    //   data: { oid: id },
    //   success: function (res) {
       // self.goodsInfo = res;
        var timeStr = '';
        var leftTime = Date.parse(new Date());
        leftTime = 5000;
        if (leftTime > 0) {
          var t = --leftTime
          var h = Math.floor(t / 60 / 60)
          var m = Math.floor((t - h * 60 * 60) / 60)
          var s = t % 60;
          if (h < 10) h = "0" + h;
          if (m < 10) m = "0" + m;
          if (s < 10) s = "0" + s;
          timeStr = h + ':' + m + ':' + s
          self.setTimeData(leftTime)
        }
        var groupMember = [];
        // for (var i = res.groupNum - 1; i >= 0; i--) {
        //   if (res.groupMember[i]) {
        //     groupMember[i] = res.groupMember[i]
        //   } else {
        //     groupMember[i] = {}
        //   }
        // }
        self.setData({
          groupMember, groupMember,
         // groupInfo: res,
          leftTime: timeStr
        })
    //   }
    // })
  },
  setTimeData: function (data) {
    var self = this;
    var groupList = data
    setInterval(function () {
      for (var i = 0; i < groupList.length; i++) {
        var t = --groupList[i].leftTime;
        var h = Math.floor(t / 60 / 60);
        var m = Math.floor((t - h * 60 * 60) / 60);
        var s = t % 60;
        if (h < 10) h = "0" + h;
        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;
        groupList[i].leftTimeStr = h + ':' + m + ':' + s
      }
      self.setData({
        groupList: groupList
      })
    }, 1000)
  },
  onShareAppMessage: function (options) {
    console.log(options)
    var path = '/pages/group/detail?id=' 
    return {
      title: 111,
      path: path,
      success: function (res) {
        console.log(path)
        console.log(res)
      }
    }
  },
  showModal: function (e) {
    var showModalStatus = e.currentTarget.dataset.statu == 'open' ? true : false;
    app.showModal(this);
    this.setData({
      showModalStatus: showModalStatus
    })
  }
})