// pages/song/song.js
import request from "../../../utils/request";
import Pubsub from 'pubsub-js';
import moment from "moment";
let appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//标识着页面是否播放
    song:{}, //歌曲信息
    musicId:0,
    momentDurationTime:'00:00',//当前音乐的时长
    momentCurrentTime:'00:00',//当前音乐的播放时长
    currentWidth:0,//当前进度条的宽度
  },
  //控制音乐播放暂停
  playControl(){
    const {isPlay,musicId} = this.data;
    this.musicControl(!isPlay,musicId);
  },

  async musicControl(isPlay,musicId){
    if (isPlay){ //播放的逻辑
      let songData = await request('/song/url',{id:musicId})
      let musicUrl = songData.data[0].url;
      this.backgroundAudioManager.src = musicUrl;
      /*背景音乐的标题是必填项*/
      this.backgroundAudioManager.title = this.data.song.name;
      this.backgroundAudioManager.play();
      appInstance.globalData.globalMusicId =musicId;
      appInstance.globalData.globalIsPlay = true;

      //声明歌曲正在播放 不能切换
      this.isSwitch = false;

    }else { //暂停的逻辑
      this.backgroundAudioManager.pause();
      appInstance.globalData.globalIsPlay = false;
    }
    this.setData({
      isPlay
    })
  },

  //切换歌曲的事件回调
  switchMusic(event){
    //判断当前音乐是否正常播放
    if (this.isSwitch) return // 当前的音乐正在切换
    this.isSwitch = true; /*函数节流*/
    let type = event.currentTarget.dataset.type;
    //关闭上一首音乐的播放
    this.setData({isPlay:false});
    //停止音乐的播放
    this.backgroundAudioManager.stop();
    this.handleSwitchMusic(type)
  },

  /*封装切换歌曲的方法*/
  async handleSwitchMusic(type){
  //  两个页面之间如何通信
    //1.将切换的类型(上一首或下一首)的信号要发送给recommendSong
    Pubsub.publish('switchMusic',type);
    Pubsub.subscribe('musicId',async (msg,musicId) =>{
      //获取音乐的详细信息
      let songData = await request('/song/detail',{ids:musicId});

      this.setData({
        song: songData.songs[0],
        musicId
      });
      this.musicControl(true,musicId);
      wx.setNavigationBarTitle({
        title: this.data.song.name
      });
      //取消当前的订购
      Pubsub.unsubscribe('musicId')
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
    this.backgroundAudioManager =  wx.getBackgroundAudioManager();
    /*监听音乐播放进度*/
    this.backgroundAudioManager.onTimeUpdate(() =>{
      let momentCurrentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 410;
      this.setData({
        momentCurrentTime,
        currentWidth
      })
    });
    //监听音乐的播放/暂停/停止的逻辑
    /*音乐暂停时*/
    this.backgroundAudioManager.onPause(() =>{
      this.setData({
        isPlay:false
      })
    });
    /*音乐停止时*/
    this.backgroundAudioManager.onStop(() =>{
      this.setData({
        isPlay:false
      })
    });
    /*音乐播放时*/
    this.backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay:true
      })
    });
    //console.log(typeof musicId) String
    /*获取音乐的详细信息*/
    let songData = await request('/song/detail',{ids:musicId});
    //处理音乐时长
    let durationTime = songData.songs[0].dt; //毫秒
    let momentDurationTime = moment(durationTime).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      musicId,
      momentDurationTime,
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