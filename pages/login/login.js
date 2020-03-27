import request from "../../utils/request";

Page({
	data: {
		phone:'',
		password:'',
	},
	handleBlur(event){
		//判断是哪个输入框的 'phone','password'
		let type = event.currentTarget.dataset.type;
		/*event下边有两个属性,event.currentTarget,event.target
		有什么区别:event.currentTarget是绑定事件的本身触发的,(更为精确)
		而event.target可能是事件冒泡子元素冒泡触发的
		 */
		//更新状态
		this.setData({
			[type]:event.detail.value //我们是要将变量值作为属性名,中括号语法
		})
	},
	//登录的逻辑
	async login(){
		//获取用户的输入
		let {phone,password} = this.data;
		let regExp = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
		//前端校验
		if (!phone.trim() || !password.trim() ||!regExp.test(phone)) {
			wx.showToast({
			  title: '登录失败',
			  icon:"loading"
			});
			return;
		}
		//发送请求
		let result = await request('/login/cellphone',{phone,password,isLogin:true})
		if (result.code ===200){
			//提示用户登录成功
			wx.showToast({
			  title: '登录成功',
			  icon:"success"
			})
			//把用户登录信息缓存下来
			wx.setStorage({
				key:'userInfo',
				data:JSON.stringify(result)
			})
			//跳转至个人中心界面
			wx.switchTab({
				url:'/pages/personal/personal'
			})
		}
	},
	onLoad: function (options) {

	}
});