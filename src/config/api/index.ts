import axios, { type AxiosResponse, type AxiosError } from "axios";
import { useUserStore } from "@/stores/index";
// 定义 API 返回的数据格式
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
// 创建 axios 实例
const api = axios.create({
  baseURL: "/api", // 替换为你的 API 基础 URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 关键：允许发送 cookies
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 由于使用 HttpOnly cookie，前端无法直接读取 token
    // 浏览器会自动在请求中包含 cookie，无需手动添加

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
  },
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ Response:", response, response.config.url);

    // 根据你的后端返回格式调整
    // 后端返回格式：{ success: boolean, message?: string, data?: any }
    if (response.data.success !== undefined) {
      if (response.data.success) {
        return response.data as ApiResponse; // 返回完整响应，包含 success、message、data
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
      error.config?.url,
    );

    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，token 可能过期或无效
          // 由于使用 HttpOnly cookie，清除操作由后端处理
          console.error("认证失败，请重新登录");
          // 可以触发全局登录状态更新
          const userStore = useUserStore();
          userStore.clearUser();
          // 或者直接跳转登录页
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
  },
);

export default api;
