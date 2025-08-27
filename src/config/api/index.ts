import axios, { type AxiosResponse, type AxiosError } from "axios";

// 定义 API 返回的数据格式
export interface ApiResponse<T = Record<string, any>> {
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
          // 不再直接跳转，而是让路由守卫处理重定向
          // 这样可以避免无限重定向循环
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
