// pages/order/index.js
var app = getApp() 
Page( { 
 data: {   
  currentTab: 0,
  scrollTop:0,
  page:0,
  status: '',
  totalCount: 1,
  ordersData:[],
  loading:true,
  shopReqUrl: '/mp/mpShopOrder/',
  customReqUrl: '/mp/mpCustomOrder/',
  rootPath: app.globalData.serverPath
 }, 
 onLoad: function(options) {
  var current = options.id;
  this.data.currentTab = current?current:0
  var systemInfo = wx.getSystemInfoSync()
    this.setData({
      currentTab:this.data.currentTab,
      windowHeight:systemInfo.windowHeight
    })
 },
 onShow:function(options){
  if(this.data.currentTab==0){
    this.setCurrentData()
  }
 },
 setCurrentData:function(){
  if(!this.data.loading){
    return false;
  }
  var self = this;

  if (this.data.totalCount > 0 && this.data.page < this.data.totalCount) {

    let urlStr = '';
    if (app.globalData.isShop) {
      urlStr = this.data.shopReqUrl;
    } else {
      urlStr = this.data.customReqUrl;
    }
    wx.request({
      url: app.globalData.serverPath + urlStr + app.globalData.userInfo.sid,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      data: {
        status: this.data.status
      },
      success: function (res) {
        if (!res) {
          self.data.loading = false;
          self.data.totalCount = res.data.data.total;
          self.setData({
            loading: false
          })
          var ordersData = self.data.ordersData
        } else {
          var ordersData = self.data.ordersData = self.data.ordersData.concat(res.data.data.result)
        }
        if (res.length < 4) {
          self.setData({
            loading: false
          })
        }

        if (self.data.totalCount != null && self.data.page < self.data.totalCount) {
          ++self.data.page;
        }
      
        self.setData({
          ordersList: ordersData
        })
      }
    })
  }

 },
 toGroupDetail:function(e){
  var id = e.currentTarget.dataset.id;
  app.redirect('group/detail','id='+id)
 },
 toPay:function(e){
  var self = this
  var id = e.currentTarget.dataset.id
  app.request.wxRequest({
    url:'wx-pay',
    data:{oid:id},
    success:function(res){
      wx.requestPayment({
       'timeStamp': res.timeStamp,
       'nonceStr': res.nonceStr,
       'package': res.package,
       'signType': 'MD5',
       'paySign': res.paySign,
       'success':function(res){
          self.data.loading = true
          self.data.ordersData = []
          self.data.page = 0
          self.setCurrentData()
       },
       'fail':function(res){
        console.log(res)
       }
    })
    }
  })
 },
 confirmReceipt:function(e){
  var self = this;
  var id = e.currentTarget.dataset.id;
  wx.showModal({
    content: '是否确认收货？',
    success: function(res) {
      if (res.confirm) {
        app.request.wxRequest({
          url:'confirm-receipt',
          data:{oid:id},
          success:function(res){
            self.data.loading = true
            self.data.ordersData = []
            self.data.page = 0
            self.setCurrentData()
          }
        })
      }
    }
  })
 },
 showOrderDetail:function(e){
  var id = e.currentTarget.dataset.id;
  app.redirect('orders/detail','oid='+id)
 },
 showGoodsDetial:function(e){
  var id = e.currentTarget.dataset.id;
  app.redirect('goods/detail','gid='+id);
 },
 // 滑动切换tab 
 bindChange: function( e ) { 
  this.data.page = 0
  this.data.ordersData=[]
  this.data.loading =true
  this.data.currentTab = e.detail.current
  switch (e.detail.current) {
    case 0: //全部
      this.data.status = ''; break;
    case 1://未支付
      this.data.status = 0; break;
    case 2: //待成团
      this.data.status = 1; break;
    case 3: // 待发货
      this.data.status = 2; break;
    case 4: // 待收货
      this.data.status = 3; break;
    default:
      this.data.status = ''; break;
  }
  this.setCurrentData()
  this.setData({
    loading:true,
    ordersList:[],
    currentTab: this.data.currentTab
  })
 }, 
 // 点击tab切换 
 swichNav: function( e ) {
    if( this.data.currentTab == e.currentTarget.dataset.current ) return;

    this.data.currentTab = e.currentTarget.dataset.current
    switch (e.currentTarget.dataset.current) {
      case 0: //全部
        this.data.status = ''; break;
      case 1://未支付
        this.data.status = 0; break;
      case 2: //待成团
        this.data.status = 1; break;
      case 3: // 待发货
        this.data.status = 2; break;
      case 4: // 待收货
        this.data.status = 3; break;
      default:
        this.data.status = ''; break;
    }
    this.setData({
      currentTab: this.data.currentTab
    })
 },
 scrolltolower:function(){
   if (this.data.totalCount != null && this.data.page < this.data.totalCount){
     this.setCurrentData();
   }
  
 }
})