import api from "./index";
import type {
	User,
	LoginRequest,
	RegisterRequest,
	LoginResponse,
	Wallpaper,
} from "./types";

export class UserApi {
	// 用户登录
	static async login(credentials: LoginRequest): Promise<LoginResponse> {
		return api.post("/auth/login", credentials);
	}

	// 用户注册
	static async register(userData: RegisterRequest): Promise<LoginResponse> {
		return api.post("/auth/register", userData);
	}

	// 刷新token
	static async refreshToken(
		refreshToken: string
	): Promise<{ token: string; expiresIn: number }> {
		return api.post("/auth/refresh", { refreshToken });
	}

	// 获取用户信息
	static async getUserInfo(): Promise<User> {
		return api.get("/user/profile");
	}

	// 更新用户信息
	static async updateProfile(userData: Partial<User>): Promise<User> {
		return api.put("/user/profile", userData);
	}

	// 更换头像
	static async updateAvatar(formData: FormData): Promise<{ avatar: string }> {
		return api.post("/user/avatar", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	// 修改密码
	static async changePassword(data: {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}): Promise<void> {
		return api.put("/user/password", data);
	}

	// 用户登出
	static async logout(): Promise<void> {
		return api.post("/auth/logout");
	}

	// 获取用户收藏的壁纸
	static async getFavoriteWallpapers(
		page = 1,
		pageSize = 20
	): Promise<{
		list: Wallpaper[];
		total: number;
		page: number;
		pageSize: number;
	}> {
		return api.get("/user/favorites", {
			params: { page, pageSize },
		});
	}

	// 添加收藏
	static async addToFavorites(wallpaperId: string): Promise<void> {
		return api.post(`/user/favorites/${wallpaperId}`);
	}

	// 移除收藏
	static async removeFromFavorites(wallpaperId: string): Promise<void> {
		return api.delete(`/user/favorites/${wallpaperId}`);
	}

	// 检查是否已收藏
	static async isFavorite(
		wallpaperId: string
	): Promise<{ isFavorite: boolean }> {
		return api.get(`/user/favorites/${wallpaperId}/check`);
	}

	// 获取用户上传的壁纸
	static async getUserWallpapers(
		page = 1,
		pageSize = 20
	): Promise<{
		list: Wallpaper[];
		total: number;
		page: number;
		pageSize: number;
	}> {
		return api.get("/user/wallpapers", {
			params: { page, pageSize },
		});
	}

	// 获取用户下载历史
	static async getDownloadHistory(
		page = 1,
		pageSize = 20
	): Promise<{
		list: Wallpaper[];
		total: number;
		page: number;
		pageSize: number;
	}> {
		return api.get("/user/downloads", {
			params: { page, pageSize },
		});
	}

	// 获取用户统计信息
	static async getUserStats(): Promise<{
		favoriteCount: number;
		downloadCount: number;
		uploadCount: number;
		likeCount: number;
	}> {
		return api.get("/user/stats");
	}
}
