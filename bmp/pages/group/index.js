// pages/group/index.js
var app = getApp();
Page({
  data:{
    currentTab:0,
    scrollTop:0,
    page:0,
    status:'',
    totalCount:1,
    groupData:[],
    loading:true,
    rootPath: app.globalData.serverPath
  },
  onLoad: function (options) {
    console.log('onLoad...');
    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: systemInfo.windowHeight
    })
  },
  onShow:function(){
    this.setCurrentData()
  },
  setCurrentData:function(){
    if(!this.data.loading){
      return false
    }
    var self = this;

    if (this.data.totalCount > 0 && this.data.page < this.data.totalCount){
      wx.request({
        url: app.globalData.serverPath + '/mp/mpCustoTuan/' + app.globalData.userInfo.sid,
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
            return;
          }
          if (res.length < 3) {
            self.setData({
              loading: false
            })
          }
          var groupData = self.data.groupData = self.data.groupData.concat(res.data.data.result)
          self.setData({
            groupList: groupData
          })
        }
      })
   }


   
  },
  showGoodsDetail:function(e){
    var id = e.currentTarget.dataset.id;
    if(!id) return ;
    app.redirect('goods/detail',"gid="+id)
  },
  showGroupInfo:function(e){
    var id = e.currentTarget.dataset.id;
    app.redirect('group/detail',"id="+id)
  },
  showOrderInfo:function(e){
    var id = e.currentTarget.dataset.id;
    app.redirect('orders/detail',"oid="+id)

  },
  // 滑动切换tab 
  bindChange: function( e ) { 
   this.data.page = 0;
   this.data.totalCount = 1;
   this.data.groupData=[]
   this.data.loading = true
   this.data.currentTab = e.detail.current;
   switch (e.detail.current){
      case 0: //全部
       this.data.status = ''; break;
      case 1://待成团
        this.data.status = 0; break;
      case 2: //已成团
        this.data.status = 1; break;
      case 3: // 拼团失败
        this.data.status = 2; break;
        default:
       this.data.status = ''; break;
   }
   
   this.setCurrentData()
   this.setData({
    loading:true,
    groupList:[],
     currentTab: this.data.currentTab
   })
  }, 
  // 点击tab切换 
  swichNav: function( e ) {
   
    if( this.data.currentTab == e.currentTarget.dataset.current ) return;
    this.data.currentTab = e.currentTarget.dataset.current
    switch (e.currentTarget.dataset.current) {
      case 0: //全部
        this.data.status = null; break;
      case 1://待成团
        this.data.status = 0; break;
      case 2: //已成团
        this.data.status = 1; break;
      case 3: // 拼团失败
        this.data.status = 2; break;
      default:
        this.data.status = null; break;
    }
    this.setData({
      currentTab: this.data.currentTab
    }) 
  },
  scrolltolower:function(){
   if (this.data.totalCount != null && this.data.page < this.data.totalCount) {
     ++this.data.page
   }
   this.setCurrentData()
  }
})