<template>
  <div class="py-8">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-lg loading-spinner text-primary"></span>
    </div>

    <!-- 空状态 -->
    <div v-else-if="showcaseWallpapers.length === 0" class="py-12 text-center">
      <i class="i-mdi-image-off mb-4 text-6xl text-gray-300"></i>
      <p class="text-lg text-gray-500">暂无精选壁纸</p>
    </div>

    <!-- 精选壁纸网格 -->
    <div
      v-else
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div
        v-for="wallpaper in showcaseWallpapers"
        :key="wallpaper.id"
        class="card transform cursor-pointer bg-base-100 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        @click="$router.push(`/wallpaper/${wallpaper.id}`)"
      >
        <figure class="aspect-video">
          <img
            :src="wallpaper.thumbnailUrl || wallpaper.fileUrl"
            :alt="wallpaper.title"
            class="h-full w-full object-cover"
            @load="handleImageLoad(wallpaper)"
          />
          <div
            v-if="!wallpaper.loaded"
            class="absolute inset-0 flex items-center justify-center"
          >
            <span class="loading loading-sm loading-spinner"></span>
          </div>
        </figure>
        <div class="card-body p-4">
          <h3 class="card-title text-sm font-semibold">
            {{ wallpaper.uploader?.username || "未知用户" }} 的壁纸
          </h3>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ wallpaper.width }}×{{ wallpaper.height }}</span>
            <div class="flex gap-2">
              <span class="flex items-center gap-1">
                <i class="i-mdi-eye text-sm text-blue-500"></i>
                {{ wallpaper.viewCount || 0 }}
              </span>
              <span class="flex items-center gap-1">
                <i class="i-mdi-heart text-sm text-red-500"></i>
                {{ wallpaper.likeCount || 0 }}
              </span>
            </div>
          </div>
          <div class="mt-2 flex flex-wrap gap-1">
            <span
              v-for="tag in wallpaper.tags.slice(0, 2)"
              :key="tag"
              class="badge badge-outline badge-xs"
            >
              {{ tag }}
            </span>
            <span
              v-if="wallpaper.tags.length > 2"
              class="badge badge-ghost badge-xs"
            >
              +{{ wallpaper.tags.length - 2 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看更多按钮 -->
    <div class="mt-8 text-center">
      <router-link to="/wallpapers" class="btn rounded-full px-8 btn-primary">
        查看更多壁纸
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

import { wallpaperService, type Wallpaper } from "@/services/wallpaper";

// 扩展 Wallpaper 接口以包含前端需要的额外属性
interface ExtendedWallpaper extends Wallpaper {
  loaded?: boolean;
  uploader?: {
    username: string;
  };
  viewCount?: number;
  likeCount?: number;
  tags: string[];
}

const loading = ref(false);
const showcaseWallpapers = ref<ExtendedWallpaper[]>([]);

// 获取精选壁纸
const fetchShowcaseWallpapers = async () => {
  loading.value = true;
  try {
    // 获取热门壁纸作为精选壁纸
    const response = await wallpaperService.getWallpapers({
      page: 1,
      limit: 8, // 只获取8张壁纸用于展示
      sortBy: "likes",
      sortOrder: "DESC",
    });

    if (response.success && response.data) {
      showcaseWallpapers.value = response.data.map((wallpaper: any) => ({
        ...wallpaper,
        loaded: false,
        uploader: wallpaper.uploader || { username: "未知用户" },
        viewCount: wallpaper.viewCount || 0,
        likeCount: wallpaper.likeCount || 0,
        tags:
          wallpaper.category === "anime"
            ? ["动漫", "二次元", "高清"]
            : wallpaper.category === "people"
              ? ["人物", "肖像", "艺术"]
              : ["风景", "自然", "4K"],
      }));
    }
  } catch (error) {
    console.error("获取精选壁纸失败:", error);
    showcaseWallpapers.value = [];
  } finally {
    loading.value = false;
  }
};

// 图片加载完成
const handleImageLoad = (wallpaper: ExtendedWallpaper) => {
  wallpaper.loaded = true;
};

onMounted(() => {
  fetchShowcaseWallpapers();
});
</script>
