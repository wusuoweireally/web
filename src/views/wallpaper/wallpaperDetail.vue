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

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- 左侧壁纸信息 -->
        <div class="lg:col-span-1">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title text-2xl">{{ wallpaper.title }}</h2>

              <!-- 壁纸信息 -->
              <div class="space-y-4">
                <!-- 标签 -->
                <div>
                  <h3 class="mb-2 text-sm font-semibold text-gray-500">标签</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in wallpaper.tags"
                      :key="tag"
                      class="badge badge-outline badge-primary"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- 尺寸信息 -->
                <div>
                  <h3 class="mb-2 text-sm font-semibold text-gray-500">尺寸</h3>
                  <p class="text-lg">
                    {{ wallpaper.width }} × {{ wallpaper.height }}
                  </p>
                  <p class="text-sm text-gray-500">{{ wallpaper.fileSize }}</p>
                </div>

                <!-- 上传者信息 -->
                <div>
                  <h3 class="mb-2 text-sm font-semibold text-gray-500">
                    上传者
                  </h3>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="h-10 w-10 rounded-full">
                        <img
                          :src="wallpaper.uploader.avatar"
                          :alt="wallpaper.uploader.name"
                        />
                      </div>
                    </div>
                    <div>
                      <p class="font-medium">{{ wallpaper.uploader.name }}</p>
                      <p class="text-sm text-gray-500">
                        {{ wallpaper.uploadDate }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 互动数据 -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center">
                    <div class="stat">
                      <div class="stat-title">点赞数</div>
                      <div class="stat-value text-primary">
                        {{ wallpaper.likes }}
                      </div>
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="stat">
                      <div class="stat-title">收藏数</div>
                      <div class="stat-value text-secondary">
                        {{ wallpaper.favorites }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex gap-2">
                  <button
                    class="btn flex-1 btn-primary"
                    :class="{ 'btn-active': isLiked }"
                    @click="handleLike"
                  >
                    <i class="i-mdi-heart text-lg"></i>
                    {{ isLiked ? "已点赞" : "点赞" }}
                  </button>
                  <button
                    class="btn flex-1 btn-secondary"
                    :class="{ 'btn-active': isFavorited }"
                    @click="handleFavorite"
                  >
                    <i class="i-mdi-star text-lg"></i>
                    {{ isFavorited ? "已收藏" : "收藏" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧壁纸展示 -->
        <div class="lg:col-span-2">
          <div class="card bg-base-100 shadow-xl">
            <figure class="aspect-video">
              <img
                :src="wallpaper.imageUrl"
                :alt="wallpaper.title"
                class="h-full w-full object-cover"
                @load="imageLoaded = true"
              />
              <div
                v-if="!imageLoaded"
                class="absolute inset-0 flex items-center justify-center"
              >
                <span class="loading loading-lg loading-spinner"></span>
              </div>
            </figure>

            <!-- 壁纸描述 -->
            <div class="card-body">
              <p class="text-gray-700">{{ wallpaper.description }}</p>

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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

// 壁纸详情接口
interface WallpaperDetail {
  id: number;
  title: string;
  description: string;
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

// 模拟数据 - 实际项目中应从API获取
const wallpaper = ref<WallpaperDetail>({
  id: Number(wallpaperId),
  title: "梦幻星空",
  description:
    "这是一张美丽的星空壁纸，展现了浩瀚宇宙的神秘与壮丽。适合作为桌面背景，带给您宁静与灵感。",
  imageUrl: "https://picsum.photos/1920/1080?random=1",
  width: 1920,
  height: 1080,
  fileSize: "2.5 MB",
  tags: ["星空", "宇宙", "梦幻", "4K"],
  uploader: {
    id: 1,
    name: "星空爱好者",
    avatar: "https://picsum.photos/100/100?random=2",
  },
  uploadDate: "2024-01-15",
  likes: 256,
  favorites: 189,
  resolutions: ["1920x1080", "2560x1440", "3840x2160", "5120x2880"],
});

// 页面加载时获取壁纸详情
onMounted(() => {
  fetchWallpaperDetail();
});

// 获取壁纸详情
const fetchWallpaperDetail = async () => {
  try {
    // 这里应该调用API获取壁纸详情
    // const response = await api.get(`/wallpapers/${wallpaperId}`)
    // wallpaper.value = response.data

    console.log("获取壁纸详情:", wallpaperId);
  } catch (error) {
    console.error("获取壁纸详情失败:", error);
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
}
</style>
