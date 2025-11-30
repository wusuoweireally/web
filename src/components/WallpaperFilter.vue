<template>
  <div class="bg-base-100 shadow-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex flex-wrap items-center gap-2 sm:gap-4">
        <!-- 排序方式 -->
        <div class="dropdown-hover dropdown">
          <div tabindex="0" role="button" class="btn btn-outline btn-sm">
            <i class="i-mdi-sort text-lg"></i>
            排序: {{ getSortLabel }}
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu z-10 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li v-for="option in sortOptions" :key="option.value">
              <a
                @click="updateSort(option.value)"
                :class="{ active: props.modelValue.sortBy === option.value }"
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
            分类: {{ getCategoryLabel }}
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu z-10 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <a
                @click="updateCategory('')"
                :class="{ active: !props.modelValue.category }"
                >全部</a
              >
            </li>
            <li v-for="category in categories" :key="category.value">
              <a
                @click="updateCategory(category.value)"
                :class="{ active: props.modelValue.category === category.value }"
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
            尺寸: {{ getResolutionLabel }}
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu z-10 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <a
                @click="updateResolution('')"
                :class="{ active: !props.modelValue.resolution }"
                >全部</a
              >
            </li>
            <li v-for="resolution in resolutions" :key="resolution">
              <a
                @click="updateResolution(resolution)"
                :class="{ active: props.modelValue.resolution === resolution }"
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
            比例: {{ getRatioLabel }}
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu z-10 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <a @click="updateRatio('')" :class="{ active: !props.modelValue.ratio }">全部</a>
            </li>
            <li v-for="ratio in ratios" :key="ratio">
              <a
                @click="updateRatio(ratio)"
                :class="{ active: props.modelValue.ratio === ratio }"
              >
                {{ ratio }}
              </a>
            </li>
          </ul>
        </div>

        <!-- 搜索框 -->
        <div class="w-full sm:max-w-md flex-1">
          <div class="relative">
            <input
              :value="props.modelValue.search"
              @input="(e) => {
                const value = (e.target as HTMLInputElement).value;
                updateFilters({ search: value });
                handleSearchInput(value);
              }"
              type="text"
              placeholder="搜索壁纸..."
              class="input-bordered input input-sm w-full pl-10"
              @keyup.enter="handleSearch"
            />
            <i
              class="i-mdi-magnify absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            ></i>
          </div>
        </div>

        <!-- 重置按钮 -->
        <button
          v-if="hasActiveFilters"
          class="btn btn-ghost btn-sm"
          @click="resetFilters"
        >
          <i class="i-mdi-refresh text-lg"></i>
          重置
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Filters {
  sortBy: "latest" | "popular" | "random";
  category: string;
  resolution: string;
  ratio: string;
  search: string;
}

interface Props {
  modelValue: Filters;
}

interface Emits {
  (e: 'update:modelValue', filters: Filters): void;
  (e: 'filter-change'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const route = useRoute();
const router = useRouter();

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

// 计算属性
const getSortLabel = computed(() => {
  return sortOptions.find((opt) => opt.value === props.modelValue.sortBy)?.label || "最新上传";
});

const getCategoryLabel = computed(() => {
  return categories.find((c) => c.value === props.modelValue.category)?.label || "全部";
});

const getResolutionLabel = computed(() => {
  return props.modelValue.resolution || "全部";
});

const getRatioLabel = computed(() => {
  return props.modelValue.ratio || "全部";
});

const hasActiveFilters = computed(() => {
  return (
    props.modelValue.category ||
    props.modelValue.resolution ||
    props.modelValue.ratio ||
    props.modelValue.search
  );
});

// 搜索防抖
let searchTimeout: NodeJS.Timeout | null = null;

// 方法
const updateFilters = (updates: Partial<Filters>) => {
  const newFilters = { ...props.modelValue, ...updates };
  emit('update:modelValue', newFilters);
  emit('filter-change');
};

const updateSort = (sortBy: "latest" | "popular" | "random") => {
  updateFilters({ sortBy });

  // 更新路由查询参数
  router.push({
    path: route.path,
    query: {
      ...route.query,
      sort: sortBy,
    },
  });
};

const updateCategory = (category: string) => {
  updateFilters({ category });
};

const updateResolution = (resolution: string) => {
  updateFilters({ resolution });
};

const updateRatio = (ratio: string) => {
  updateFilters({ ratio });
};

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  emit('filter-change');
};

// 搜索防抖处理
const handleSearchInput = (value: string) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    emit('filter-change');
  }, 500);
};

const resetFilters = () => {
  updateFilters({
    category: "",
    resolution: "",
    ratio: "",
    search: "",
  });
};

// 监听路由查询参数变化
watch(
  () => route.query.sort,
  (newSort) => {
    if (newSort && ["latest", "popular", "random"].includes(newSort as string)) {
      const newSortValue = newSort as "latest" | "popular" | "random";
      if (props.modelValue.sortBy !== newSortValue) {
        updateFilters({ sortBy: newSortValue });
      }
    }
  },
);
</script>

<style scoped>
.dropdown-content {
  max-height: 300px;
  overflow-y: auto;
}
</style>