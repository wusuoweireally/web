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
                      class="badge badge-outline badge-xs badge-primary"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- 尺寸信息 -->
                <div>
                  <h3 class="mb-1 text-xs font-semibold text-gray-500">尺寸</h3>
                  <p class="text-sm">
                    {{ wallpaper.width }} × {{ wallpaper.height }} px
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
                          @error="handleAvatarError"
                          class="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium">
                        {{ wallpaper.uploader.name }}
                      </p>
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
                      <div class="flex items-center justify-center gap-1">
                        <i class="i-mdi-thumb-up text-sm text-green-500"></i>
                        <div class="stat-title text-xs">点赞</div>
                      </div>
                      <div class="stat-value text-sm text-primary">
                        {{ wallpaper.likes }}
                      </div>
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="stat p-1">
                      <div class="flex items-center justify-center gap-1">
                        <i class="i-mdi-star text-sm text-yellow-500"></i>
                        <div class="stat-title text-xs">收藏</div>
                      </div>
                      <div class="stat-value text-sm text-secondary">
                        {{ wallpaper.favorites }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex gap-1">
                  <button
                    class="btn flex-1 btn-xs btn-primary"
                    :class="{ 'btn-active': isLiked }"
                    @click="handleLike"
                  >
                    <i class="i-mdi-heart text-xs"></i>
                    {{ isLiked ? "已点赞" : "点赞" }}
                  </button>
                  <button
                    class="btn flex-1 btn-xs btn-secondary"
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
          <div class="card h-full bg-base-100 shadow-xl">
            <figure class="aspect-video h-full">
              <img
                :src="wallpaper.imageUrl"
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { wallpaperService } from "@/services/wallpaper";
import { useUserStore } from "@/stores";

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
const userStore = useUserStore();
const imageLoaded = ref(false);
const isLiked = ref(false);
const isFavorited = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const detailTimeoutId = ref<NodeJS.Timeout | null>(null);

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
      wallpaperService.getWallpaperTags(id),
    ]);

    // 检查响应是否成功
    if (!wallpaperResponse.success) {
      throw new Error(wallpaperResponse.message || "获取壁纸详情失败");
    }

    // 转换API数据格式以匹配组件接口
    wallpaper.value = {
      id: wallpaperResponse.data.id,
      imageUrl: wallpaperResponse.data.fileUrl,
      width: wallpaperResponse.data.width,
      height: wallpaperResponse.data.height,
      fileSize: `${(wallpaperResponse.data.fileSize / 1024 / 1024).toFixed(2)} MB`,
      tags: tagsResponse.success ? tagsResponse.data.map((tag: any) => tag.name) : [], // 从标签接口获取标签名称
      uploader: {
        id: wallpaperResponse.data.uploaderId,
        name: wallpaperResponse.data.uploader?.username || "未知用户",
        avatar: wallpaperResponse.data.uploader?.avatarUrl || "", // 使用后端处理后的完整头像URL
      },
      uploadDate: new Date(
        wallpaperResponse.data.createdAt,
      ).toLocaleDateString(),
      likes: wallpaperResponse.data.likeCount,
      favorites: wallpaperResponse.data.favoriteCount,
      resolutions: [
        `${wallpaperResponse.data.width}x${wallpaperResponse.data.height}`,
      ], // 简化处理
    };

    // 初始化点赞和收藏状态（如果API返回则使用，否则设为false）
    isLiked.value = wallpaperResponse.data.isLiked || false;
    isFavorited.value = wallpaperResponse.data.isFavorited || false;
  } catch (err: any) {
    console.error("获取壁纸详情失败:", err);

    // 静默处理请求被取消的情况，不显示错误信息
    if (err.message === '请求已取消' || err.name === 'REQUEST_CANCELLED' || err.isCancelled) {
      console.log('壁纸详情请求被取消，静默处理');
      return;
    }

    // 其他错误才显示错误信息
    error.value = err instanceof Error ? err.message : "获取壁纸详情失败";
  } finally {
    loading.value = false;
  }
};

// 处理点赞
const handleLike = async () => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    alert("请先登录后再点赞");
    return;
  }

  const id = Number(wallpaperId);
  if (isNaN(id)) {
    console.error("无效的壁纸ID");
    return;
  }

  // 保存当前状态用于错误回滚
  const previousLiked = isLiked.value;
  const previousLikes = wallpaper.value.likes;

  // 确定要执行的操作（根据当前状态）
  const shouldLike = !previousLiked;

  // 乐观更新UI
  isLiked.value = shouldLike;
  if (shouldLike) {
    wallpaper.value.likes++;
  } else {
    wallpaper.value.likes--;
  }

  try {
    // 调用API
    if (shouldLike) {
      await wallpaperService.likeWallpaper(id);
    } else {
      await wallpaperService.unlikeWallpaper(id);
    }
  } catch (err: any) {
    // API调用失败，回滚状态
    isLiked.value = previousLiked;
    wallpaper.value.likes = previousLikes;

    // 处理错误
    if (err.response?.status === 401) {
      alert("登录已过期，请重新登录");
    } else {
      const errorMessage =
        err.response?.data?.message || err.message || "操作失败，请稍后重试";
      console.error("点赞操作失败:", errorMessage);
      alert(errorMessage);
    }
  }
};

// 处理收藏
const handleFavorite = async () => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    alert("请先登录后再收藏");
    return;
  }

  const id = Number(wallpaperId);
  if (isNaN(id)) {
    console.error("无效的壁纸ID");
    return;
  }

  // 保存当前状态用于错误回滚
  const previousFavorited = isFavorited.value;
  const previousFavorites = wallpaper.value.favorites;

  // 确定要执行的操作（根据当前状态）
  const shouldFavorite = !previousFavorited;

  // 乐观更新UI
  isFavorited.value = shouldFavorite;
  if (shouldFavorite) {
    wallpaper.value.favorites++;
  } else {
    wallpaper.value.favorites--;
  }

  try {
    // 调用API
    if (shouldFavorite) {
      await wallpaperService.favoriteWallpaper(id);
    } else {
      await wallpaperService.unfavoriteWallpaper(id);
    }
  } catch (err: any) {
    // API调用失败，回滚状态
    isFavorited.value = previousFavorited;
    wallpaper.value.favorites = previousFavorites;

    // 处理错误
    if (err.response?.status === 401) {
      alert("登录已过期，请重新登录");
    } else {
      const errorMessage =
        err.response?.data?.message || err.message || "操作失败，请稍后重试";
      console.error("收藏操作失败:", errorMessage);
      alert(errorMessage);
    }
  }
};

// 处理头像加载失败
const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // 设置默认头像
  img.src = '/uploads/profile-pictures/defaultAvatar.png';
  img.onerror = null; // 防止无限循环
};

// 选择分辨率
const selectResolution = (resolution: string) => {
  console.log("选择分辨率:", resolution);
  // 这里可以处理分辨率选择逻辑，比如显示不同分辨率的图片
};

// 组件卸载时清理所有pending请求和计时器
onUnmounted(() => {
  // 清理可能存在的重试计时器
  if (detailTimeoutId.value) {
    clearTimeout(detailTimeoutId.value);
    detailTimeoutId.value = null;
  }

  // 重置加载状态
  loading.value = false;

  console.log('wallpaperDetail 组件卸载，清理完成');
});
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

  .lg\:col-span-1,
  .lg\:col-span-3 {
    grid-column: span 1 / span 1;
  }
}
</style>
