import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/config/api";
// 定义后端返回的数据格式
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  id: number;
  password: string;
}

export interface RegisterDto {
  id: string;
  username: string;
  email: string;
  password: string;
  avatarFile?: File | null;
}

export const useUserStore = defineStore("user", () => {
  // 状态
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 计算属性
  const isLoggedIn = computed(() => !!user.value);
  const userAvatar = computed(() => {
    // 如果没有头像，返回默认头像
    if (!user.value?.avatarUrl) return "/images/avatars/default-avatar.svg";
    // 如果http开头网络头像，直接返回
    if (user.value.avatarUrl.startsWith("http")) return user.value.avatarUrl;
    return `/images/avatars/${user.value.avatarUrl}`;
  });

  // 操作方法
  const setUser = (userData: User) => {
    user.value = userData;
    // 同时保存到 localStorage 作为备份
    try {
      localStorage.setItem("currentUser", JSON.stringify(userData));
    } catch (e) {
      console.warn("无法保存用户信息到 localStorage:", e);
    }
  };

  const clearUser = () => {
    user.value = null;
    error.value = null;
    try {
      localStorage.removeItem("currentUser");
    } catch (e) {
      console.warn("无法清除 localStorage 用户信息:", e);
    }
  };

  const setError = (errorMessage: string) => {
    error.value = errorMessage;
  };

  const clearError = () => {
    error.value = null;
  };

  // 登录
  const login = async (loginData: LoginDto) => {
    try {
      loading.value = true;
      clearError();

      const response = (await api.post(
        "/users/login",
        loginData,
      )) as ApiResponse<User>;

      if (response.success && response.data) {
        setUser(response.data);
        return response;
      } else {
        throw new Error(response.message || "登录失败");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "登录失败";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  // 注册
  const register = async (payload: RegisterDto) => {
    try {
      loading.value = true;
      clearError();

      // 处理文件上传
      if (payload.avatarFile) {
        const formData = new FormData();
        formData.append("id", payload.id);
        formData.append("username", payload.username);
        formData.append("email", payload.email);
        formData.append("password", payload.password);
        formData.append("avatar", payload.avatarFile);

        const response = (await api.post("/users/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })) as ApiResponse<User>;

        if (response.data) {
          return response;
        } else {
          throw new Error(response.message || "注册失败");
        }
      } else {
        // 没有头像文件，使用原来的JSON方式
        const response = (await api.post("/users/register", {
          id: payload.id,
          username: payload.username,
          email: payload.email,
          password: payload.password,
        })) as ApiResponse<User>;

        if (response.data) {
          return response;
        } else {
          throw new Error(response.message || "注册失败");
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "注册失败";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  // 登出
  const logout = async () => {
    try {
      loading.value = true;
      await api.post("/users/logout");
    } catch (err) {
      console.warn("登出请求失败:", err);
    } finally {
      clearUser();
      loading.value = false;
    }
  };

  // 获取当前用户信息（从服务器验证）
  const fetchCurrentUser = async () => {
    try {
      loading.value = true;
      clearError();

      const response = await api.get("/users/profile");

      if (response.data.success && response.data.data) {
        setUser(response.data.data);
        return response.data.data;
      } else {
        // 服务器返回成功但没有数据，不清除用户信息（可能是token过期）
        console.warn("服务器返回成功但没有用户数据");
        return null;
      }
    } catch (err: any) {
      // 只在非401错误时清除用户信息，401错误表示token过期但仍保留用户信息显示
      if (err.response?.status !== 401) {
        clearUser();
        const errorMessage =
          err.response?.data?.message || err.message || "获取用户信息失败";
        setError(errorMessage);
      }
      return null;
    } finally {
      loading.value = false;
    }
  };

  // 更新用户信息
  const updateUserInfo = async (updateData: {
    username?: string;
    email?: string;
    avatarFile?: File | null;
  }) => {
    try {
      loading.value = true;
      clearError();

      const response = await api.put("/auth/user", updateData);

      if (response.data.success && response.data) {
        setUser(response.data);
        return response;
      } else {
        throw new Error(response.data.message || "更新失败");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "更新用户信息失败";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  // 初始化用户状态（应用启动时调用）
  const initializeAuth = async () => {
    console.log("🔐 开始初始化用户认证状态...");

    // 先尝试从 localStorage 恢复用户信息
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const userData = JSON.parse(savedUser) as User;
        user.value = userData;
        console.log("✅ 从localStorage恢复用户信息:", userData.username);
      } else {
        console.log("ℹ️  localStorage中没有保存的用户信息");
      }
    } catch (e) {
      console.warn("恢复用户信息失败:", e);
    }

    // 然后验证用户状态是否仍然有效
    // 如果认证失败（401），保持显示用户信息但提示需要重新登录
    try {
      console.log("🔄 验证用户认证状态...");
      const result = await fetchCurrentUser();
      if (result) {
        console.log("✅ 用户认证状态有效");
      } else {
        console.log("⚠️  用户认证验证返回空结果");
      }
    } catch (error: any) {
      // 401错误不处理，保持显示用户信息
      if (error.response?.status === 401) {
        console.log("⚠️  用户token已过期，需要重新登录");
        console.log("ℹ️  保持显示用户信息，但功能受限");
      } else {
        console.warn("用户认证验证失败:", error);
        // 其他错误时清除用户信息
        clearUser();
      }
    }

    console.log("🔐 用户认证状态初始化完成");
  };

  // 从 localStorage 恢复用户信息（不验证服务器）
  const restoreFromStorage = () => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const userData = JSON.parse(savedUser) as User;
        user.value = userData;
        return userData;
      }
    } catch (e) {
      console.warn("恢复用户信息失败:", e);
    }
    return null;
  };

  return {
    // 状态
    user,
    loading,
    error,

    // 计算属性
    isLoggedIn,
    userAvatar,

    // 方法
    setUser,
    clearUser,
    setError,
    clearError,
    login,
    register,
    logout,
    fetchCurrentUser,
    updateUserInfo,
    initializeAuth,
    restoreFromStorage,
  };
});
