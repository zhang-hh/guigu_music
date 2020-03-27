// pages/recommendSong/recommendSong.js
import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[], //每日推荐歌曲
  },
  /*跳转到歌曲界面*/
  toSongs(event){
    //点击的时候获取音乐的id
    let musicId = event.currentTarget.dataset.songid;
    wx.navigateTo({
      /*支持query传参,但是路由传递参数一定是字符串,
       如果传递的不是会自动的toString方法
       并且路由传参不推荐传递大数据,他可能会缺失一部分
       */
      url:`/pages/song/song?musicId=${musicId}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录'
      });
      wx.redirectTo({
        url:'/pages/login/login'
      });
      return
    }
    //初始化页面的时间
        let day = new Date().getDate();
        let month = new Date().getMonth() + 1;
        this.setData({
          day,month
        })
  //  获取每日推荐歌曲
    let recommendListData =  await request('/recommend/songs');
    this.setData({
      recommendList:recommendListData.recommend
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

  }
})