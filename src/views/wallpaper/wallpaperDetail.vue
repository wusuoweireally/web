<template>
  <div class="min-h-screen bg-base-200">
    <!-- 导航栏 -->
    <nav class="navbar bg-base-100 shadow-sm">
      <div class="flex-1">
        <button class="btn btn-ghost btn-sm" @click="$router.back()">
          <i class="i-mdi-arrow-left text-lg"></i>
          返回
        </button>
      </div>
      <div class="flex-none">
        <button class="btn btn-circle btn-ghost">
          <i class="i-mdi-share-variant text-lg"></i>
        </button>
      </div>
    </nav>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-lg loading-spinner text-primary"></span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="container mx-auto px-4 py-8">
      <div class="alert alert-error shadow-lg">
        <div>
          <i class="i-mdi-alert-circle text-xl"></i>
          <span>{{ error }}</span>
        </div>
      </div>
    </div>

    <div v-else class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <!-- 左侧壁纸信息 -->
        <div class="lg:col-span-1">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body p-4">
              <!-- 壁纸信息 -->
              <div class="space-y-3">
                <!-- 标签 -->
                <div>
                  <h3 class="mb-1 text-xs font-semibold text-gray-500">标签</h3>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="tag in wallpaper.tags"
                      :key="tag"
                      class="badge badge-outline badge-primary badge-xs"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- 尺寸信息 -->
                <div>
                  <h3 class="mb-1 text-xs font-semibold text-gray-500">尺寸</h3>
                  <p class="text-sm">
                    {{ wallpaper.width }} × {{ wallpaper.height }}
                  </p>
                  <p class="text-xs text-gray-500">{{ wallpaper.fileSize }}</p>
                </div>

                <!-- 上传者信息 -->
                <div>
                  <h3 class="mb-1 text-xs font-semibold text-gray-500">
                    上传者
                  </h3>
                  <div class="flex items-center gap-2">
                    <div class="avatar">
                      <div class="h-8 w-8 rounded-full">
                        <img
                          :src="wallpaper.uploader.avatar"
                          :alt="wallpaper.uploader.name"
                        />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ wallpaper.uploader.name }}</p>
                      <p class="text-xs text-gray-500">
                        {{ wallpaper.uploadDate }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 互动数据 -->
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-center">
                    <div class="stat p-1">
                      <div class="stat-title text-xs">点赞数</div>
                      <div class="stat-value text-primary text-sm">
                        {{ wallpaper.likes }}
                      </div>
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="stat p-1">
                      <div class="stat-title text-xs">收藏数</div>
                      <div class="stat-value text-secondary text-sm">
                        {{ wallpaper.favorites }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex gap-1">
                  <button
                    class="btn btn-primary btn-xs flex-1"
                    :class="{ 'btn-active': isLiked }"
                    @click="handleLike"
                  >
                    <i class="i-mdi-heart text-xs"></i>
                    {{ isLiked ? "已点赞" : "点赞" }}
                  </button>
                  <button
                    class="btn btn-secondary btn-xs flex-1"
                    :class="{ 'btn-active': isFavorited }"
                    @click="handleFavorite"
                  >
                    <i class="i-mdi-star text-xs"></i>
                    {{ isFavorited ? "已收藏" : "收藏" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧壁纸展示 -->
        <div class="lg:col-span-3">
          <div class="card bg-base-100 shadow-xl h-full">
            <figure class="aspect-video h-full">
              <img
                :src="wallpaper.imageUrl"
                :alt="wallpaper.title"
                class="h-full w-full object-contain"
                @load="imageLoaded = true"
              />
              <div
                v-if="!imageLoaded"
                class="absolute inset-0 flex items-center justify-center"
              >
                <span class="loading loading-lg loading-spinner"></span>
              </div>
            </figure>

            <!-- 分辨率选择 -->
              <div class="mt-4 flex flex-wrap gap-2">
                <button
                  v-for="resolution in wallpaper.resolutions"
                  :key="resolution"
                  class="btn btn-outline btn-sm"
                  @click="selectResolution(resolution)"
                >
                  {{ resolution }}
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { wallpaperService, type Wallpaper } from "@/services/wallpaper";

// 壁纸详情接口
interface WallpaperDetail {
  id: number;
  imageUrl: string;
  width: number;
  height: number;
  fileSize: string;
  tags: string[];
  uploader: {
    id: number;
    name: string;
    avatar: string;
  };
  uploadDate: string;
  likes: number;
  favorites: number;
  resolutions: string[];
}

const route = useRoute();
const wallpaperId = route.params.id;
const imageLoaded = ref(false);
const isLiked = ref(false);
const isFavorited = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

// 壁纸详情数据
const wallpaper = ref<WallpaperDetail>({
  id: 0,
  imageUrl: "",
  width: 0,
  height: 0,
  fileSize: "",
  tags: [],
  uploader: {
    id: 0,
    name: "",
    avatar: "",
  },
  uploadDate: "",
  likes: 0,
  favorites: 0,
  resolutions: [],
});

// 页面加载时获取壁纸详情
onMounted(() => {
  fetchWallpaperDetail();
});

// 获取壁纸详情
const fetchWallpaperDetail = async () => {
  loading.value = true;
  error.value = null;
  try {
    const id = Number(wallpaperId);
    if (isNaN(id)) {
      throw new Error("无效的壁纸ID");
    }

    // 同时获取壁纸详情和关联标签
    const [wallpaperResponse, tagsResponse] = await Promise.all([
      wallpaperService.getWallpaperDetail(id),
      wallpaperService.getWallpaperTags(id)
    ]);

    // 转换API数据格式以匹配组件接口
    wallpaper.value = {
      id: wallpaperResponse.data.id,
      imageUrl: wallpaperResponse.data.fileUrl,
      width: wallpaperResponse.data.width,
      height: wallpaperResponse.data.height,
      fileSize: `${(wallpaperResponse.data.fileSize / 1024 / 1024).toFixed(2)} MB`,
      tags: tagsResponse.data.map((tag: any) => tag.name), // 从标签接口获取标签名称
      uploader: {
        id: wallpaperResponse.data.uploaderId,
        name: wallpaperResponse.data.uploaderName || "未知用户",
        avatar: "", // API未提供头像URL，需要后端支持
      },
      uploadDate: new Date(wallpaperResponse.data.createdAt).toLocaleDateString(),
      likes: wallpaperResponse.data.likeCount,
      favorites: wallpaperResponse.data.favoriteCount,
      resolutions: [`${wallpaperResponse.data.width}x${wallpaperResponse.data.height}`], // 简化处理
    };
  } catch (err) {
    console.error("获取壁纸详情失败:", err);
    error.value = err instanceof Error ? err.message : "获取壁纸详情失败";
  } finally {
    loading.value = false;
  }
};

// 处理点赞
const handleLike = () => {
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    wallpaper.value.likes++;
  } else {
    wallpaper.value.likes--;
  }
  // 这里应该调用API更新点赞状态
  console.log("点赞状态:", isLiked.value);
};

// 处理收藏
const handleFavorite = () => {
  isFavorited.value = !isFavorited.value;
  if (isFavorited.value) {
    wallpaper.value.favorites++;
  } else {
    wallpaper.value.favorites--;
  }
  // 这里应该调用API更新收藏状态
  console.log("收藏状态:", isFavorited.value);
};

// 选择分辨率
const selectResolution = (resolution: string) => {
  console.log("选择分辨率:", resolution);
  // 这里可以处理分辨率选择逻辑，比如显示不同分辨率的图片
};
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}

/* 图片加载动画 */
img {
  transition: opacity 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .lg\:col-span-1, .lg\:col-span-3 {
    grid-column: span 1 / span 1;
  }
}
</style>
