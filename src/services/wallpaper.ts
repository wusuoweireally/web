import api from "@/config/api";
import type { AxiosProgressEvent } from "axios";

/**
 * 壁纸查询参数接口
 */
export interface WallpaperQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  tags?: string[];
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  category?: string;
}

/**
 * 壁纸上传参数接口
 */
export interface UploadWallpaperParams {
  file: File;
  category: string;
  tags: string[];
}

/**
 * 壁纸数据接口
 */
export interface Wallpaper {
  id: number;
  title?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  aspectRatio: string;
  category: string;
  tags: string[];
  likeCount: number;
  favoriteCount: number;
  viewCount: number;
  uploaderId: number;
  uploader?: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  isFavorited?: boolean;
}

/**
 * 壁纸列表响应接口
 */
export interface WallpaperListResponse {
  data: Wallpaper[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * 壁纸服务类
 */
class WallpaperService {
  /**
   * 上传壁纸
   */
  async uploadWallpaper(
    params: UploadWallpaperParams,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  ) {
    const formData = new FormData();
    formData.append("file", params.file);

    formData.append("category", params.category);

    if (params.tags && params.tags.length > 0) {
      // 后端期望tags是数组，但FormData不能直接传递数组
      // 需要将每个标签作为单独的字段传递
      params.tags.forEach((tag) => {
        formData.append("tags[]", tag);
      });
    }

    // 生成请求ID用于取消上传
    const requestId = `upload_${Date.now()}`;

    try {
      const response = await api.post("/wallpapers/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });

      return { response, requestId };
    } catch (error) {
      console.error("上传壁纸失败:", error);
      throw error;
    }
  }

  /**
   * 获取壁纸列表
   */
  async getWallpapers(params: WallpaperQueryParams = {}) {
    try {
      // 构建查询参数对象，确保数字类型参数正确传递
      const queryParams: Record<string, any> = {
        page: Math.max(1, params.page ?? 1),
        limit: Math.max(1, Math.min(100, params.limit ?? 20)),
      };

      if (params.search) queryParams.search = params.search;
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
      if (params.category) queryParams.category = params.category;
      if (params.aspectRatio) queryParams.aspectRatio = params.aspectRatio;
      if (params.minWidth) queryParams.minWidth = params.minWidth;
      if (params.maxWidth) queryParams.maxWidth = params.maxWidth;
      if (params.minHeight) queryParams.minHeight = params.minHeight;
      if (params.maxHeight) queryParams.maxHeight = params.maxHeight;

      if (params.tags && params.tags.length > 0) {
        queryParams.tags = params.tags;
      }

      const response = await api.get("/wallpapers", { params: queryParams });
      return response;
    } catch (error) {
      console.error("获取壁纸列表失败:", error);
      throw error;
    }
  }

  /**
   * 获取壁纸详情
   */
  async getWallpaperDetail(id: number) {
    try {
      const response = await api.get(`/wallpapers/${id}`);
      return response;
    } catch (error) {
      console.error("获取壁纸详情失败:", error);
      throw error;
    }
  }

  /**
   * 更新壁纸信息
   */
  async updateWallpaper(id: number, updateData: Partial<Wallpaper>) {
    try {
      const response = await api.put(`/wallpapers/${id}`, updateData);
      return response;
    } catch (error) {
      console.error("更新壁纸失败:", error);
      throw error;
    }
  }

  /**
   * 删除壁纸
   */
  async deleteWallpaper(id: number) {
    try {
      const response = await api.delete(`/wallpapers/${id}`);
      return response;
    } catch (error) {
      console.error("删除壁纸失败:", error);
      throw error;
    }
  }

  /**
   * 点赞壁纸
   */
  async likeWallpaper(id: number) {
    try {
      const response = await api.post(`/wallpapers/${id}/like`);
      return response;
    } catch (error) {
      console.error("点赞壁纸失败:", error);
      throw error;
    }
  }

  /**
   * 取消点赞壁纸
   */
  async unlikeWallpaper(id: number) {
    try {
      const response = await api.post(`/wallpapers/${id}/unlike`);
      return response;
    } catch (error) {
      console.error("取消点赞壁纸失败:", error);
      throw error;
    }
  }

  /**
   * 收藏壁纸
   */
  async favoriteWallpaper(id: number) {
    try {
      const response = await api.post(`/wallpapers/${id}/favorite`);
      return response;
    } catch (error) {
      console.error("收藏壁纸失败:", error);
      throw error;
    }
  }

  /**
   * 取消收藏壁纸
   */
  async unfavoriteWallpaper(id: number) {
    try {
      const response = await api.post(`/wallpapers/${id}/unfavorite`);
      return response;
    } catch (error) {
      console.error("取消收藏壁纸失败:", error);
      throw error;
    }
  }

  /**
   * 获取热门壁纸
   */
  async getPopularWallpapers(limit: number = 10) {
    try {
      const response = await api.get(`/wallpapers/popular`, {
        params: { limit },
      });
      return response;
    } catch (error) {
      console.error("获取热门壁纸失败:", error);
      throw error;
    }
  }

  /**
   * 根据上传者获取壁纸
   */
  async getWallpapersByUploader(
    uploaderId: number,
    page: number = 1,
    limit: number = 20,
  ) {
    try {
      const response = await api.get(`/wallpapers/uploader/${uploaderId}`, {
        params: { page, limit },
      });
      return response;
    } catch (error) {
      console.error("获取上传者壁纸失败:", error);
      throw error;
    }
  }

  /**
   * 获取壁纸关联标签
   */
  async getWallpaperTags(id: number) {
    try {
      const response = await api.get(`/wallpapers/${id}/tags`);
      return response;
    } catch (error) {
      console.error("获取壁纸标签失败:", error);
      throw error;
    }
  }
}

// 导出单例实例
export const wallpaperService = new WallpaperService();

export default wallpaperService;
