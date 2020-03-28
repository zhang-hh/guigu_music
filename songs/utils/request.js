import config from "./config";
export default (url,data={},method='GET') => {
	return new Promise((resolve,reject) =>{
		wx.request({
			url: config.host + url,
			data,
			method,
			header:{
				/*设置的cookies必须是字符串,同时还得解析里面的数组*/
				 cookie:JSON.parse(wx.getStorageSync('cookies') || '[]').toString()
				// cookie:`${(JSON.parse(wx.getStorageSync("cookies") || "[]"))}`
			},
			success:(res) => {
				// 修改promise对象的状态为成功状态，同时将数据返回
				//将登录的后获取的cookies存放在本地,便于之后发请求使用
				/*只有登录请求才需要往本地存cookies
				*   1.通过判断url判断登录请求
				*   2.通过登录时传递的参数判断是登录请求*/
				if (data.isLogin){
					wx.setStorage({
						key:'cookies',
						data:JSON.stringify(res.cookies)
					})
				}
				resolve(res.data)
			},
			fail:(error) =>{
				reject(error)
			}
		})
	})
}