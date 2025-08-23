import api from '@/config/api'
import type { ApiResponse } from '@/config/api'

/**
 * 壁纸接口响应数据类型
 */
export interface Wallpaper {
  id: number
  title: string
  description?: string
  fileUrl: string
  thumbnailUrl?: string
  fileSize: number
  width: number
  height: number
  format: string
  uploaderId: number
  viewCount: number
  likeCount: number
  favoriteCount: number
  status: number
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 上传壁纸请求参数
 */
export interface UploadWallpaperRequest {
  file: File
  title: string
  description?: string
  uploaderId: number
}

/**
 * 壁纸查询参数
 */
export interface WallpaperQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

/**
 * 壁纸列表响应
 */
export interface WallpaperListResponse {
  list: Wallpaper[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * 壁纸服务类
 */
class WallpaperService {
  /**
   * 上传壁纸
   */
  async uploadWallpaper(data: UploadWallpaperRequest): Promise<ApiResponse<Wallpaper>> {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('title', data.title)
    formData.append('uploaderId', data.uploaderId.toString())
    
    if (data.description) {
      formData.append('description', data.description)
    }

    try {
      const response = await api.post('/wallpapers/upload', formData)
      
      return response
    } catch (error: any) {
      console.error('上传壁纸失败:', error)
      throw new Error(error.message || '上传失败')
    }
  }

  /**
   * 获取壁纸列表
   */
  async getWallpapers(params?: WallpaperQueryParams): Promise<ApiResponse<WallpaperListResponse>> {
    try {
      const response = await api.get('/wallpapers', { params })
      return response
    } catch (error: any) {
      console.error('获取壁纸列表失败:', error)
      throw new Error(error.message || '获取失败')
    }
  }

  /**
   * 获取壁纸详情
   */
  async getWallpaperById(id: number): Promise<ApiResponse<Wallpaper>> {
    try {
      const response = await api.get(`/wallpapers/${id}`)
      return response
    } catch (error: any) {
      console.error('获取壁纸详情失败:', error)
      throw new Error(error.message || '获取失败')
    }
  }

  /**
   * 更新壁纸信息
   */
  async updateWallpaper(id: number, data: Partial<Wallpaper>): Promise<ApiResponse<Wallpaper>> {
    try {
      const response = await api.put(`/wallpapers/${id}`, data)
      return response
    } catch (error: any) {
      console.error('更新壁纸失败:', error)
      throw new Error(error.message || '更新失败')
    }
  }

  /**
   * 删除壁纸
   */
  async deleteWallpaper(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/wallpapers/${id}`)
      return response
    } catch (error: any) {
      console.error('删除壁纸失败:', error)
      throw new Error(error.message || '删除失败')
    }
  }

  /**
   * 获取用户上传的壁纸
   */
  async getUserWallpapers(userId: number, page: number = 1, limit: number = 20): Promise<ApiResponse<WallpaperListResponse>> {
    try {
      const response = await api.get(`/wallpapers/user/${userId}`, {
        params: { page, limit }
      })
      return response
    } catch (error: any) {
      console.error('获取用户壁纸失败:', error)
      throw new Error(error.message || '获取失败')
    }
  }

  /**
   * 获取热门壁纸
   */
  async getPopularWallpapers(limit: number = 10): Promise<ApiResponse<Wallpaper[]>> {
    try {
      const response = await api.get('/wallpapers/popular', {
        params: { limit }
      })
      return response
    } catch (error: any) {
      console.error('获取热门壁纸失败:', error)
      throw new Error(error.message || '获取失败')
    }
  }

  /**
   * 增加壁纸查看次数
   */
  async incrementViewCount(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/wallpapers/${id}/view`)
      return response
    } catch (error: any) {
      console.error('增加查看次数失败:', error)
      throw new Error(error.message || '操作失败')
    }
  }
}

export const wallpaperService = new WallpaperService()