let moveY = 0; //滑动距离
let endY = 0; //手指滑动结束的触点位置
let startY = 0; //手指滑动开始的触点位置
Page({
	data: {
		userInfo:{},
		coverTransfrom:'translateY(0px)',
	},
	//跳转到登录界面
	toLogin(){
		if(this.data.userInfo.profile) return;
		wx.redirectTo({
			url:'/pages/login/login'
		})
	},

	handleStart(event){
		startY = event.changedTouches[0].clientY
	},
	handleMove(event){
		endY = event.changedTouches[0].clientY;
		//计算滑动的距离
		moveY = endY - startY ;
		if (moveY < 0  || moveY >80) return;
		this.setData({
			coverTransfrom:`translateY(${moveY}px)`
		})
	},
	handleEnd(){
		this.setData({
			coverTransfrom:`translateY(0px)`
		})
	},
	onLoad: function (options) {
		//验证用户是否登录
		let userInfo = wx.getStorageSync('userInfo');
		if (userInfo){
			userInfo = JSON.parse(userInfo);
			this.setData({
				userInfo
			})
		}
	}
});