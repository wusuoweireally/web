import axios, {
  type AxiosResponse,
  type CancelTokenSource,
  type InternalAxiosRequestConfig,
} from "axios";

// 扩展Axios请求配置类型
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  requestId?: string;
}

// 定义 API 响应的数据格式
export interface ApiResponse<T = Record<string, any>> {
  success: boolean;
  message?: string;
  data?: T | null;
}

// 创建 axios 实例
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 请求取消令牌管理
const cancelTokenSources: Map<string, CancelTokenSource> = new Map();

// 请求拦截器 - 添加请求取消功能
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // 为每个请求生成唯一标识
    const requestId = config.url || `request_${Date.now()}`;

    // 取消之前的相同请求（防止重复请求）
    if (cancelTokenSources.has(requestId)) {
      const source = cancelTokenSources.get(requestId);
      source?.cancel(`取消重复请求: ${requestId}`);
    }

    // 创建新的取消令牌
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    cancelTokenSources.set(requestId, source);

    config.requestId = requestId; // 保存requestId到config中
    console.log("🚀 Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// 响应拦截器 - 清理已完成请求的取消令牌
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求成功完成，清理取消令牌
    const config = response.config as CustomAxiosRequestConfig;
    const requestId = config.requestId;
    if (requestId && cancelTokenSources.has(requestId)) {
      cancelTokenSources.delete(requestId);
    }

    console.log("✅ Response:", config.url, response.status);

    // 根据你的后端返回格式调整
    // 后端返回格式：{ success: boolean, message?: string, data?: any }
    if (response.data.success !== undefined) {
      if (response.data.success) {
        return response.data as ApiResponse;
      } else {
        return Promise.reject(new Error(response.data.message || "请求失败"));
      }
    }

    return response.data;
  },
  (error: any) => {
    // 清理取消令牌
    if (error.config) {
      const config = error.config as CustomAxiosRequestConfig;
      const requestId = config.requestId;
      if (requestId && cancelTokenSources.has(requestId)) {
        cancelTokenSources.delete(requestId);
      }
    }

    // 处理取消请求
    if (axios.isCancel(error)) {
      console.warn("请求已被取消:", error.message);
      return Promise.reject(error);
    }

    console.error(
      "❌ Response Error:",
      error.response?.status,
      error.config?.url,
    );

    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("认证失败，请重新登录");
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

// 手动取消请求的函数
export const cancelRequest = (requestId: string): boolean => {
  if (cancelTokenSources.has(requestId)) {
    const source = cancelTokenSources.get(requestId);
    source?.cancel(`手动取消请求: ${requestId}`);
    cancelTokenSources.delete(requestId);
    return true;
  }
  return false;
};

export default api;
// 在 src/config/api/index.ts 文件末尾添加

// 扩展 axios 类型定义，让所有请求自动返回 ApiResponse 格式
declare module "axios" {
  export interface AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
    post<T = any>(
      url: string,
      data?: any,
      config?: any,
    ): Promise<ApiResponse<T>>;
    put<T = any>(
      url: string,
      data?: any,
      config?: any,
    ): Promise<ApiResponse<T>>;
    patch<T = any>(
      url: string,
      data?: any,
      config?: any,
    ): Promise<ApiResponse<T>>;
    delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
  }
}
