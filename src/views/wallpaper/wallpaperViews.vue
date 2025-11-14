<template>
  <div class="min-h-screen bg-base-200">
    <!-- 顶部导航栏 -->
    <NavBar />

    <!-- 筛选导航栏 -->
    <div class="bg-base-100 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex flex-wrap items-center gap-4">
          <!-- 排序方式 -->
          <div class="dropdown-hover dropdown">
            <div tabindex="0" role="button" class="btn btn-outline btn-sm">
              <i class="i-mdi-sort text-lg"></i>
              排序: {{ sortOptions.find((opt) => opt.value === sortBy)?.label }}
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu z-10 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li v-for="option in sortOptions" :key="option.value">
                <a
                  @click="changeSort(option.value)"
                  :class="{ active: sortBy === option.value }"
                >
                  {{ option.label }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 分类筛选 -->
          <div class="dropdown-hover dropdown">
            <div tabindex="0" role="button" class="btn btn-outline btn-sm">
              <i class="i-mdi-tag text-lg"></i>
              分类:
              {{
                categories.find((c) => c.value === currentCategory)?.label ||
                "全部"
              }}
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu z-10 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <a
                  @click="changeCategory('')"
                  :class="{ active: !currentCategory }"
                  >全部</a
                >
              </li>
              <li v-for="category in categories" :key="category.value">
                <a
                  @click="changeCategory(category.value)"
                  :class="{ active: currentCategory === category.value }"
                >
                  {{ category.label }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 尺寸筛选 -->
          <div class="dropdown-hover dropdown">
            <div tabindex="0" role="button" class="btn btn-outline btn-sm">
              <i class="i-mdi-aspect-ratio text-lg"></i>
              尺寸: {{ currentResolution || "全部" }}
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu z-10 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <a
                  @click="changeResolution('')"
                  :class="{ active: !currentResolution }"
                  >全部</a
                >
              </li>
              <li v-for="resolution in resolutions" :key="resolution">
                <a
                  @click="changeResolution(resolution)"
                  :class="{ active: currentResolution === resolution }"
                >
                  {{ resolution }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 比例筛选 -->
          <div class="dropdown-hover dropdown">
            <div tabindex="0" role="button" class="btn btn-outline btn-sm">
              <i class="i-mdi-crop text-lg"></i>
              比例: {{ currentRatio || "全部" }}
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu z-10 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <a @click="changeRatio('')" :class="{ active: !currentRatio }"
                  >全部</a
                >
              </li>
              <li v-for="ratio in ratios" :key="ratio">
                <a
                  @click="changeRatio(ratio)"
                  :class="{ active: currentRatio === ratio }"
                >
                  {{ ratio }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 搜索框 -->
          <div class="max-w-md flex-1">
            <div class="relative">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索壁纸..."
                class="input-bordered input input-sm w-full pl-10"
                @keyup.enter="searchWallpapers"
              />
              <i
                class="i-mdi-magnify absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 壁纸网格 -->
    <div class="container mx-auto px-4 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-12">
        <span class="loading loading-lg loading-spinner text-primary"></span>
      </div>

      <!-- 空状态 -->
      <div v-else-if="wallpapers.length === 0" class="py-12 text-center">
        <i class="i-mdi-image-off mb-4 text-6xl text-gray-300"></i>
        <p class="text-lg text-gray-500">暂无壁纸</p>
        <button class="btn mt-4 btn-primary" @click="resetFilters">
          重置筛选条件
        </button>
      </div>

      <!-- 壁纸列表 -->
      <div
        v-else
        class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <div
          v-for="wallpaper in wallpapers"
          :key="wallpaper.id"
          class="card transform cursor-pointer bg-base-100 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          @click="$router.push(`/wallpaper/${wallpaper.id}`)"
        >
          <figure class="aspect-video">
            <img
              :src="wallpaper.thumbnailUrl || wallpaper.fileUrl"
              class="h-full w-full object-cover"
              @load="handleImageLoad"
            />
          </figure>
          <div class="card-body p-1">
            <div
              class="flex items-center justify-between text-xs text-gray-500"
            >
              <span>分辨率 {{ wallpaper.width }}×{{ wallpaper.height }}</span>
              <div class="flex gap-3">
                <!-- 查看数 -->
                <div class="flex items-center gap-1 text-sm">
                  <span class="text-blue-500">👁️‍🗨️</span>
                  <span>{{ (wallpaper as any).viewCount || 0 }}</span>
                </div>

                <!-- 点赞数 -->
                <div class="flex items-center gap-1 text-sm">
                  <span class="text-green-500">👍🏻</span>
                  <span>{{ (wallpaper as any).likeCount || 0 }}</span>
                </div>

                <!-- 收藏数 -->
                <div class="flex items-center gap-1 text-sm">
                  <span class="text-yellow-500">⭐</span>
                  <span>{{ (wallpaper as any).favoriteCount || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div
        v-if="wallpapers.length > 0 && totalPages > 1"
        class="mt-8 flex justify-center"
      >
        <div class="join">
          <button
            class="btn join-item btn-sm"
            :class="{ 'btn-disabled': currentPage === 1 }"
            @click="goToPage(currentPage - 1)"
          >
            «
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="btn join-item btn-sm"
            :class="{ 'btn-active': page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            class="btn join-item btn-sm"
            :class="{ 'btn-disabled': currentPage === totalPages }"
            @click="goToPage(currentPage + 1)"
          >
            »
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { wallpaperService, type Wallpaper } from "@/services/wallpaper";
import NavBar from "@/components/NavBar.vue";

// API拦截器返回的格式
interface ApiWallpaperResponse {
  success: boolean;
  message?: string;
  data: Wallpaper[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// 扩展 Wallpaper 接口以包含前端需要的额外属性
interface ExtendedWallpaper extends Wallpaper {
  loaded?: boolean;
  imageUrl: string;
  uploadDate: string;
  resolution: string;
}

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const wallpapers = ref<ExtendedWallpaper[]>([]);
const currentPage = ref(1);
const pageSize = 20;
const totalCount = ref(0);

// 排序映射表：前端值 -> API 参数
const sortMapping = {
  latest: { sortBy: "createdAt", sortOrder: "DESC" },
  popular: { sortBy: "likes", sortOrder: "DESC" },
  random: { sortBy: "random", sortOrder: "DESC" },
} as const;

// 筛选条件
const sortBy = ref<"latest" | "popular" | "random">("latest");
const currentCategory = ref("");
const currentResolution = ref("");
const currentRatio = ref("");
const searchKeyword = ref("");

// 筛选选项
const sortOptions: Array<{
  value: "latest" | "popular" | "random";
  label: string;
}> = [
  { value: "latest", label: "最新上传" },
  { value: "popular", label: "最受欢迎" },
  { value: "random", label: "随机推荐" },
];

const categories = [
  { value: "general", label: "综合" },
  { value: "anime", label: "动漫" },
  { value: "people", label: "人物" },
];

const resolutions = [
  "1920x1080",
  "2560x1440",
  "3840x2160",
  "5120x2880",
  "1080x1920",
  "1440x2560",
  "2160x3840",
];

const ratios = ["16:9", "16:10", "4:3", "21:9", "1:1", "9:16"];

// 计算总页数
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

// 计算可见页码
const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// 从路由查询参数初始化排序方式
const initSortFromRoute = () => {
  const sortParam = route.query.sort as string;
  if (sortParam && ["latest", "popular", "random"].includes(sortParam)) {
    sortBy.value = sortParam as "latest" | "popular" | "random";
  } else {
    // 如果没有查询参数，默认使用 latest
    sortBy.value = "latest";
  }
};

// 初始化
onMounted(() => {
  initSortFromRoute();
  fetchWallpapers();
});

// 监听路由查询参数变化（当用户通过导航栏切换时）
watch(
  () => route.query.sort,
  (newSort) => {
    if (
      newSort &&
      ["latest", "popular", "random"].includes(newSort as string)
    ) {
      const newSortValue = newSort as "latest" | "popular" | "random";
      if (sortBy.value !== newSortValue) {
        sortBy.value = newSortValue;
        currentPage.value = 1; // 切换排序时重置到第一页
      }
    }
  },
);

// 监听筛选条件变化
watch(
  [
    sortBy,
    currentCategory,
    currentResolution,
    currentRatio,
    searchKeyword,
    currentPage,
  ],
  () => {
    fetchWallpapers();
  },
);

// 获取壁纸列表
const fetchWallpapers = async () => {
  loading.value = true;
  try {
    // 使用映射表获取排序参数
    const sortConfig = sortMapping[sortBy.value];

    // 解析分辨率
    let minWidth: number | undefined;
    let maxWidth: number | undefined;
    let minHeight: number | undefined;
    let maxHeight: number | undefined;

    if (currentResolution.value) {
      const [width, height] = currentResolution.value.split("x").map(Number);
      minWidth = maxWidth = width;
      minHeight = maxHeight = height;
    }

    const response = await wallpaperService.getWallpapers({
      page: currentPage.value,
      limit: pageSize,
      search: searchKeyword.value || undefined,
      sortBy: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
      category: currentCategory.value || undefined,
      aspectRatio: currentRatio.value
        ? parseFloat(currentRatio.value.replace(":", "/"))
        : undefined,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      tags: [],
    });

    // API拦截后直接返回 response.data，格式: { success: boolean, data: Wallpaper[], pagination: {...} }
    const apiResponse = response as unknown as ApiWallpaperResponse;
    if (apiResponse.success && apiResponse.data) {
      wallpapers.value = apiResponse.data.map((wallpaper: any) => ({
        ...wallpaper,
        loaded: false,
        imageUrl: wallpaper.thumbnailUrl || wallpaper.fileUrl,
        uploadDate: wallpaper.createdAt,
        resolution: `${wallpaper.width}x${wallpaper.height}`,
        // 添加一些模拟标签数据
        tags:
          wallpaper.category === "anime"
            ? ["动漫", "二次元", "高清"]
            : wallpaper.category === "people"
              ? ["人物", "肖像", "艺术"]
              : ["风景", "自然", "4K"],
      }));
      totalCount.value = apiResponse.pagination.total;
    }
  } catch (error) {
    console.error("获取壁纸失败:", error);
    // API调用失败，清空壁纸列表
    wallpapers.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
};

// 图片加载完成
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // 对于真实数据，我们通过数据索引来设置加载状态
  const index = wallpapers.value.findIndex(
    (w) =>
      img.src.includes(w.fileUrl) || img.src.includes(w.thumbnailUrl || ""),
  );
  if (index !== -1) {
    wallpapers.value[index].loaded = true;
  }
};

// 切换排序方式
const changeSort = (sort: "latest" | "popular" | "random") => {
  sortBy.value = sort;
  currentPage.value = 1;
  // 更新路由查询参数，保持 URL 与状态同步
  router.push({
    path: route.path,
    query: {
      ...route.query,
      sort: sort,
    },
  });
};

// 切换分类
const changeCategory = (category: string) => {
  currentCategory.value = category;
  currentPage.value = 1;
};

// 切换分辨率
const changeResolution = (resolution: string) => {
  currentResolution.value = resolution;
  currentPage.value = 1;
};

// 切换比例
const changeRatio = (ratio: string) => {
  currentRatio.value = ratio;
  currentPage.value = 1;
};

// 搜索壁纸
const searchWallpapers = () => {
  currentPage.value = 1;
  fetchWallpapers();
};

// 重置筛选条件
const resetFilters = () => {
  sortBy.value = "latest";
  currentCategory.value = "";
  currentResolution.value = "";
  currentRatio.value = "";
  searchKeyword.value = "";
  currentPage.value = 1;
};

// 跳转到指定页码
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>
