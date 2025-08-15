// 通用 API 响应格式
export interface ApiResponse<T = any> {
	code: number;
	message: string;
	data: T;
}

// 分页请求参数
export interface PaginationParams {
	page: number;
	pageSize: number;
}

// 分页响应数据
export interface PaginationResponse<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

// 壁纸相关类型
export interface Wallpaper {
	id: string;
	title: string;
	url: string;
	thumbnailUrl: string;
	category: string;
	tags: string[];
	width: number;
	height: number;
	fileSize: number;
	downloads: number;
	likes: number;
	createdAt: string;
	updatedAt: string;
	author?: string;
	description?: string;
}

// 壁纸查询参数
export interface WallpaperQuery extends PaginationParams {
	category?: string;
	tags?: string[];
	keyword?: string;
	sortBy?: "latest" | "popular" | "downloads" | "likes";
	resolution?: string;
}

// 壁纸分类
export interface Category {
	id: string;
	name: string;
	count: number;
	thumbnail: string;
}

// 用户类型
export interface User {
	id: string;
	username: string;
	email: string;
	avatar: string;
	createdAt: string;
	favoriteCount: number;
	downloadCount: number;
}

// 登录请求
export interface LoginRequest {
	username: string;
	password: string;
}

// 注册请求
export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

// 登录响应
export interface LoginResponse {
	user: User;
	token: string;
	refreshToken: string;
	expiresIn: number;
}

// 上传响应
export interface UploadResponse {
	url: string;
	filename: string;
	size: number;
}
