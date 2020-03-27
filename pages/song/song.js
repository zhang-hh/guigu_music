// pages/song/song.js
import request from "../../utils/request";
let appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//标识着页面是否播放
    song:{}, //歌曲信息
    musicId:0
  },
  //控制音乐播放暂停
  playControl(){
    const {isPlay,musicId} = this.data;
    this.musicControl(!isPlay,musicId);
  },

  async musicControl(isPlay,musicId){
    this.backgroundAudioManager =  wx.getBackgroundAudioManager();
    if (isPlay){ //播放的逻辑
      let songData = await request('/song/url',{id:musicId})
      let musicUrl = songData.data[0].url;
      this.backgroundAudioManager.src = musicUrl;
      /*背景音乐的标题是必填项*/
      this.backgroundAudioManager.title = this.data.song.name;
      this.backgroundAudioManager.play();
      appInstance.globalData.globalMusicId =musicId;
      appInstance.globalData.globalIsPlay = true;

    }else { //暂停的逻辑
      this.backgroundAudioManager.pause();
      appInstance.globalData.globalIsPlay = false;
    }
    this.setData({
      isPlay
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    /*options正好是收集路由传参的对象 默认是空对象*/
    let musicId = options.musicId;
    //判断当前音乐是否播放
    if (appInstance.globalData.globalMusicId === musicId && appInstance.globalData.globalIsPlay){
      this.setData({
        isPlay:true
      })
    }
    //console.log(typeof musicId) String
    //获取音乐的详细信息
    let songData = await request('/song/detail',{ids:musicId});
    this.setData({
      song: songData.songs[0],
      musicId
    });
    //更新窗口的标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    });
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