import request from "../../utils/request";

Page({
	data: {
		videoNavList:[],
		videoList :[],
		navId:0,
	},
	chooseVideo(){
		wx.chooseVideo({
			sourceType: ['album','camera'],
			maxDuration: 40,
			camera: 'back',
		})
	},

	async getVideoList(){
		let videoListData = await request('/video/group',{id:this.data.navId})
		if (videoListData.code ===200){
			wx.hideLoading()
			this.setData({
				videoList:videoListData.datas
			})
		}
	},
	changeNavId(event){
		wx.showLoading({
			title:'正在加载中'
		});
		this.setData({
			navId:event.currentTarget.dataset.navid,
			videoList:[],//切换的时候下面视频不应该出现
			isTriggered :false,
		});
		this.getVideoList();
	},
	//下拉刷新
	handleRefresh(){
		this.getVideoList();
		//关闭下拉刷新的状态
		this.setData({
			isTriggered: false
		})
	},
	//处理多个视频的可以同时播放的问题
	handleContorl(event){ //点击视频播放的时时候触发
		/*需求:点击下一个的时候,要上一个视频停止,注意如果点击的是在暂停的话,我们要注意判断vid*/
		event.currentTarget.dataset.vid !== this.vid && this.videoContext && this.videoContext.stop();
		this.vid = event.currentTarget.dataset.vid; //id是必须的
		this.videoContext = wx.createVideoContext(this.vid);
		/*VideoContext 实例，可通过 wx.createVideoContext 获取。
		VideoContext 通过 id 跟一个 video 组件绑定，操作对应的 video 组件。*/
	},



	onLoad:async function (options) {
		//判断用户是否登录
		let userInfo = wx.getStorageSync('userInfo');
		if(!userInfo){
			wx.showToast({
				title: '请先登录'
			});
			wx.redirectTo({
				url:'/pages/login/login'
			})
			return
		}
		let videoNavListData = await request('/video/group/list')
		if (videoNavListData.code ===200){
			this.setData({
				videoNavList:videoNavListData.data.slice(0,14),
				navId:videoNavListData.data[0].id
			})
		}
		wx.showLoading({
			title:'正在加载中'
		});
		//获取视频列表
		this.getVideoList()
	},
	/**
	 * 用户点击右上角分享
	 */
	/*onShareAppMessage: function () {
		//自定义分享内容
		return {
			title: '这是我自定义的内容',
			page: '/pages/video/video',
			imageUrl: '/static/images/nvsheng.jpg'
		}
	}*/
});