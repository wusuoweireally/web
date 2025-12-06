<template>
  <div
    class="group flex cursor-pointer flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:ring-black/10"
    @click="handleClick"
  >
    <figure class="relative aspect-[4/3] w-full overflow-hidden">
      <img
        :src="wallpaper.thumbnailUrl || wallpaper.fileUrl"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
        :alt="`壁纸 ${wallpaper.id}`"
        @load="handleImageLoad"
        @error="handleImageError"
      />

      <div
        v-if="!imageLoaded && !imageError"
        class="absolute inset-0 animate-pulse bg-slate-200"
      ></div>
      <div
        v-if="imageError"
        class="absolute inset-0 flex items-center justify-center bg-slate-100"
      >
        <i class="i-mdi-image-off text-4xl text-slate-400"></i>
      </div>
      <div
        v-if="showActions"
        class="pointer-events-none absolute inset-0 flex items-start justify-end p-4"
      >
        <div
          class="flex gap-2 opacity-0 transition duration-150 group-hover:opacity-100"
        >
          <button
            class="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-xs text-white transition hover:bg-black/70"
            :class="{ 'text-red-300': isLiked }"
            :disabled="liking"
            @click.stop="handleLike"
            title="点赞"
          >
            👍
          </button>
          <button
            class="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-xs text-white transition hover:bg-black/70"
            :class="{ 'text-yellow-200': isFavorited }"
            :disabled="favoriting"
            @click.stop="handleFavorite"
            title="收藏"
          >
            ☆
          </button>
        </div>
      </div>
    </figure>
    <div class="px-4 pb-3 pt-2">
      <div class="flex items-center justify-center gap-2.5 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <span class="flex items-center gap-1.5">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {{ wallpaper.width }}×{{ wallpaper.height }}
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {{ wallpaper.viewCount || 0 }}
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="h-3.5 w-3.5" :class="isLiked ? 'fill-rose-500 stroke-rose-500' : 'fill-none stroke-current'" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {{ likeCount }}
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="h-3.5 w-3.5" :class="isFavorited ? 'fill-amber-400 stroke-amber-400' : 'fill-none stroke-current'" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          {{ favoriteCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { Wallpaper } from "@/services/wallpaper";
import { wallpaperService } from "@/services/wallpaper";
import { useUserStore } from "@/stores";

interface Props {
  wallpaper: Wallpaper;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
});

const router = useRouter();
const userStore = useUserStore();

const imageLoaded = ref(false);
const imageError = ref(false);
const likeCount = ref(props.wallpaper.likeCount || 0);
const favoriteCount = ref(props.wallpaper.favoriteCount || 0);
const isLiked = ref(Boolean(props.wallpaper.isLiked));
const isFavorited = ref(Boolean(props.wallpaper.isFavorited));
const liking = ref(false);
const favoriting = ref(false);

const handleCardClick = () => {
  router.push(`/wallpaper/${props.wallpaper.id}`);
};

const syncState = (wallpaper: Wallpaper) => {
  likeCount.value = wallpaper.likeCount || 0;
  favoriteCount.value = wallpaper.favoriteCount || 0;
  isLiked.value = Boolean(wallpaper.isLiked);
  isFavorited.value = Boolean(wallpaper.isFavorited);
};

watch(
  () => props.wallpaper,
  (newWallpaper) => {
    if (newWallpaper) {
      syncState(newWallpaper);
    }
  },
);
syncState(props.wallpaper);

const ensureAuth = () => {
  if (userStore.isLoggedIn) {
    return true;
  }
  router.push("/auth/login");
  return false;
};

const handleLike = async () => {
  if (!ensureAuth() || liking.value) {
    return;
  }

  liking.value = true;
  try {
    if (isLiked.value) {
      await wallpaperService.unlikeWallpaper(props.wallpaper.id);
      isLiked.value = false;
      likeCount.value = Math.max(0, likeCount.value - 1);
    } else {
      await wallpaperService.likeWallpaper(props.wallpaper.id);
      isLiked.value = true;
      likeCount.value += 1;
    }
  } catch (error) {
    console.error("点赞壁纸失败:", error);
    alert("点赞失败，请稍后重试");
  } finally {
    liking.value = false;
  }
};

const handleFavorite = async () => {
  if (!ensureAuth() || favoriting.value) {
    return;
  }

  favoriting.value = true;
  try {
    if (isFavorited.value) {
      await wallpaperService.unfavoriteWallpaper(props.wallpaper.id);
      isFavorited.value = false;
      favoriteCount.value = Math.max(0, favoriteCount.value - 1);
    } else {
      await wallpaperService.favoriteWallpaper(props.wallpaper.id);
      isFavorited.value = true;
      favoriteCount.value += 1;
    }
  } catch (error) {
    console.error("收藏壁纸失败:", error);
    alert("收藏失败，请稍后重试");
  } finally {
    favoriting.value = false;
  }
};

const handleImageLoad = () => {
  imageLoaded.value = true;
  imageError.value = false;
};

const handleImageError = () => {
  imageLoaded.value = false;
  imageError.value = true;
};

const handleClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.closest("button")) {
    return;
  }
  handleCardClick();
};
</script>
