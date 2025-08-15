import axios, { type AxiosResponse, type AxiosError } from "axios";

// 创建 axios 实例
const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.wallpaper.com",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// 请求拦截器
api.interceptors.request.use(
	(config) => {
		// 添加认证 token
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// 添加请求时间戳（防止缓存）
		if (config.method === "get") {
			config.params = {
				...config.params,
				_t: Date.now(),
			};
		}

		console.log("🚀 Request:", config.method?.toUpperCase(), config.url);
		return config;
	},
	(error) => {
		console.error("❌ Request Error:", error);
		return Promise.reject(error);
	}
);

// 响应拦截器
api.interceptors.response.use(
	(response: AxiosResponse) => {
		console.log("✅ Response:", response.status, response.config.url);

		// 统一处理响应数据格式
		if (response.data.code !== undefined) {
			if (response.data.code === 200) {
				return response.data.data;
			} else {
				return Promise.reject(new Error(response.data.message || "请求失败"));
			}
		}

		return response.data;
	},
	(error: AxiosError) => {
		console.error(
			"❌ Response Error:",
			error.response?.status,
			error.config?.url
		);

		// 统一错误处理
		if (error.response) {
			switch (error.response.status) {
				case 401:
					// 未授权，清除 token 并跳转登录
					localStorage.removeItem("token");
					window.location.href = "/login";
					break;
				case 403:
					console.error("权限不足");
					break;
				case 404:
					console.error("资源不存在");
					break;
				case 500:
					console.error("服务器错误");
					break;
				default:
					console.error(`错误状态码: ${error.response.status}`);
			}
		} else if (error.request) {
			console.error("网络错误，请检查网络连接");
		} else {
			console.error("请求配置错误");
		}

		return Promise.reject(error);
	}
);

export default api;
