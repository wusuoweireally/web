<template>
  <div
    class="group card cursor-pointer bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl"
  >
    <!-- 壁纸图片 -->
    <figure class="relative aspect-video overflow-hidden">
      <img
        :src="wallpaper.thumbnailUrl"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </figure>

    <!-- 壁纸信息 -->
    <div class="card-body p-4">
      <!-- 统计信息 -->
      <div class="mt-2 flex items-center justify-between">
        <div class="flex items-center gap-4 text-sm">
          <!-- 查看数 -->
          <div class="flex items-center gap-1">
            <i class="i-mdi-eye text-blue-500"></i>
            <span class="text-gray-600">{{ wallpaper.viewCount }}</span>
          </div>

          <!-- 点赞数 -->
          <div class="flex items-center gap-1">
            <i class="i-mdi-heart text-red-500"></i>
            <span class="text-gray-600">{{ wallpaper.likeCount }}</span>
          </div>

          <!-- 收藏数 -->
          <div class="flex items-center gap-1">
            <i class="i-mdi-star text-yellow-500"></i>
            <span class="text-gray-600">{{ wallpaper.favoriteCount }}</span>
          </div>

          <!-- 上传时间 -->
          <div v-if="wallpaper.createdAt" class="flex items-center gap-1">
            <i class="i-mdi-clock-outline text-gray-400"></i>
            <span class="text-xs text-gray-500">{{
              formatDate(wallpaper.createdAt)
            }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center gap-1">
          <!-- 点赞按钮 -->
          <button
            v-if="showActions"
            class="btn btn-ghost btn-xs"
            :class="{ 'text-red-500': wallpaper.isLiked }"
            @click.stop="handleLike"
          >
            <i class="i-mdi-heart"></i>
          </button>

          <!-- 收藏按钮 -->
          <button
            v-if="showActions"
            class="btn btn-ghost btn-xs"
            :class="{ 'text-yellow-500': wallpaper.isFavorited }"
            @click.stop="handleFavorite"
          >
            <i class="i-mdi-star"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

interface WallpaperItem {
  id: number;
  title?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  uploader?: {
    username: string;
  };
  likeCount: number;
  favoriteCount: number;
  createdAt?: string;
  isLiked?: boolean;
  isFavorited?: boolean;
  width?: number;
  height?: number;
  aspectRatio?: string;
  category?: string;
  viewCount?: number;
}

interface Props {
  wallpaper: WallpaperItem;
  showUploader?: boolean;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showUploader: true,
  showActions: true,
});

const router = useRouter();

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1天前";
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}月前`;
  return `${Math.floor(diffDays / 365)}年前`;
};

// 点击卡片跳转到详情页
const handleCardClick = () => {
  router.push(`/wallpaper/${props.wallpaper.id}`);
};

// 点赞处理
const handleLike = () => {
  console.log("点赞壁纸:", props.wallpaper.id);
  // TODO: 调用点赞API
};

// 收藏处理
const handleFavorite = () => {
  console.log("收藏壁纸:", props.wallpaper.id);
  // TODO: 调用收藏API
};

// 点击卡片时触发
const handleClick = (event: Event) => {
  // 如果点击的是操作按钮，不跳转
  const target = event.target as HTMLElement;
  if (target.closest("button")) {
    return;
  }
  handleCardClick();
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}
</style>
