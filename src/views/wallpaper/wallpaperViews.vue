<template>
  <div class="min-h-screen bg-base-200">
    <!-- 筛选导航栏 -->
    <div class="bg-base-100 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex flex-wrap items-center gap-4">
          <!-- 排序方式 -->
          <div class="dropdown dropdown-hover">
            <div tabindex="0" role="button" class="btn btn-outline btn-sm">
              <i class="i-mdi-sort text-lg"></i>
              排序: {{ sortOptions.find(opt => opt.value === sortBy)?.label }}
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
              <li v-for="option in sortOptions" :key="option.value">
                <a @click="changeSort(option.value)" :class="{ 'active': sortBy === option.value }">
                  {{ option.label }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 分类筛选 -->
          <div class="dropdown dropdown-hover">
            <div tabindex="0" role="button" class="btn btn-outline btn-sm">
              <i class="i-mdi-tag text-lg"></i>
              分类: {{ currentCategory || '全部' }}
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
              <li><a @click="changeCategory('')" :class="{ 'active': !currentCategory }">全部</a></li>
              <li v-for="category in categories" :key="category">
                <a @click="changeCategory(category)" :class="{ 'active': currentCategory === category }">
                  {{ category }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 尺寸筛选 -->
          <div class="dropdown dropdown-hover">
            <div tabindex="0" role="button" class="btn btn-outline btn-sm">
              <i class="i-mdi-aspect-ratio text-lg"></i>
              尺寸: {{ currentResolution || '全部' }}
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
              <li><a @click="changeResolution('')" :class="{ 'active': !currentResolution }">全部</a></li>
              <li v-for="resolution in resolutions" :key="resolution">
                <a @click="changeResolution(resolution)" :class="{ 'active': currentResolution === resolution }">
                  {{ resolution }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 比例筛选 -->
          <div class="dropdown dropdown-hover">
            <div tabindex="0" role="button" class="btn btn-outline btn-sm">
              <i class="i-mdi-crop text-lg"></i>
              比例: {{ currentRatio || '全部' }}
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
              <li><a @click="changeRatio('')" :class="{ 'active': !currentRatio }">全部</a></li>
              <li v-for="ratio in ratios" :key="ratio">
                <a @click="changeRatio(ratio)" :class="{ 'active': currentRatio === ratio }">
                  {{ ratio }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 搜索框 -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索壁纸..."
                class="input input-bordered input-sm w-full pl-10"
                @keyup.enter="searchWallpapers"
              />
              <i class="i-mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
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
      <div v-else-if="wallpapers.length === 0" class="text-center py-12">
        <i class="i-mdi-image-off text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">暂无壁纸</p>
        <button class="btn btn-primary mt-4" @click="resetFilters">
          重置筛选条件
        </button>
      </div>

      <!-- 壁纸列表 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div
          v-for="wallpaper in wallpapers"
          :key="wallpaper.id"
          class="card bg-base-100 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          @click="$router.push(`/wallpaper/${wallpaper.id}`)"
        >
          <figure class="aspect-video">
            <img
              :src="wallpaper.thumbnailUrl || wallpaper.imageUrl"
              :alt="wallpaper.title"
              class="w-full h-full object-cover"
              @load="handleImageLoad"
            />
            <div v-if="!wallpaper.loaded" class="absolute inset-0 flex items-center justify-center">
              <span class="loading loading-spinner loading-sm"></span>
            </div>
          </figure>
          <div class="card-body p-4">
            <h3 class="card-title text-sm font-semibold line-clamp-1">{{ wallpaper.title }}</h3>
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>{{ wallpaper.width }}×{{ wallpaper.height }}</span>
              <div class="flex gap-2">
                <span class="flex items-center gap-1">
                  <i class="i-mdi-heart text-red-500 text-sm"></i>
                  {{ wallpaper.likes }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="i-mdi-star text-yellow-500 text-sm"></i>
                  {{ wallpaper.favorites }}
                </span>
              </div>
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="tag in wallpaper.tags.slice(0, 2)"
                :key="tag"
                class="badge badge-outline badge-xs"
              >
                {{ tag }}
              </span>
              <span v-if="wallpaper.tags.length > 2" class="badge badge-ghost badge-xs">
                +{{ wallpaper.tags.length - 2 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="wallpapers.length > 0 && totalPages > 1" class="flex justify-center mt-8">
        <div class="join">
          <button
            class="join-item btn btn-sm"
            :class="{ 'btn-disabled': currentPage === 1 }"
            @click="goToPage(currentPage - 1)"
          >
            «
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="join-item btn btn-sm"
            :class="{ 'btn-active': page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            class="join-item btn btn-sm"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

interface Wallpaper {
  id: number
  title: string
  imageUrl: string
  thumbnailUrl?: string
  width: number
  height: number
  tags: string[]
  category: string
  likes: number
  favorites: number
  uploadDate: string
  aspectRatio: string
  resolution: string
  loaded?: boolean
}

const route = useRoute()
const loading = ref(false)
const wallpapers = ref<Wallpaper[]>([])
const currentPage = ref(1)
const pageSize = 20
const totalCount = ref(0)

// 筛选条件
const sortBy = ref('latest') // latest, popular, random
const currentCategory = ref('')
const currentResolution = ref('')
const currentRatio = ref('')
const searchKeyword = ref('')

// 筛选选项
const sortOptions = [
  { value: 'latest', label: '最新上传' },
  { value: 'popular', label: '最受欢迎' },
  { value: 'random', label: '随机推荐' }
]

const categories = [
  '自然风景', '城市建筑', '动物植物', '抽象艺术', 
  '游戏动漫', '影视明星', '科技数码', '节日主题'
]

const resolutions = [
  '1920x1080', '2560x1440', '3840x2160', '5120x2880',
  '1080x1920', '1440x2560', '2160x3840'
]

const ratios = [
  '16:9', '16:10', '4:3', '21:9', '1:1', '9:16'
]

// 计算总页数
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

// 计算可见页码
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 从路由参数获取初始筛选条件
onMounted(() => {
  const type = route.params.type as string
  if (type) {
    switch (type) {
      case 'latest':
        sortBy.value = 'latest'
        break
      case 'top':
        sortBy.value = 'popular'
        break
      case 'random':
        sortBy.value = 'random'
        break
    }
  }
  fetchWallpapers()
})

// 监听筛选条件变化
watch([sortBy, currentCategory, currentResolution, currentRatio, searchKeyword, currentPage], () => {
  fetchWallpapers()
})

// 获取壁纸列表
const fetchWallpapers = async () => {
  loading.value = true
  try {
    // 模拟API调用 - 实际项目中替换为真实API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 根据筛选条件生成模拟数据
    const mockData = generateMockData()
    wallpapers.value = mockData.map(wallpaper => ({
      ...wallpaper,
      loaded: false
    }))
    totalCount.value = 100 // 模拟总数量
  } catch (error) {
    console.error('获取壁纸失败:', error)
  } finally {
    loading.value = false
  }
}

// 生成模拟数据
const generateMockData = (): Wallpaper[] => {
  const data: Wallpaper[] = []
  const startIndex = (currentPage.value - 1) * pageSize
  
  for (let i = 0; i < pageSize; i++) {
    const index = startIndex + i + 1
    const aspectRatio = ratios[Math.floor(Math.random() * ratios.length)]
    const [width, height] = aspectRatio.split(':').map(Number)
    const baseWidth = Math.floor(Math.random() * 2000) + 1000
    const actualWidth = Math.round(baseWidth / 100) * 100
    const actualHeight = Math.round((actualWidth * height) / width)
    
    data.push({
      id: index,
      title: `壁纸 ${index}`,
      imageUrl: `https://picsum.photos/${actualWidth}/${actualHeight}?random=${index}`,
      thumbnailUrl: `https://picsum.photos/400/300?random=${index}`,
      width: actualWidth,
      height: actualHeight,
      tags: ['标签1', '标签2', '标签3'],
      category: categories[Math.floor(Math.random() * categories.length)],
      likes: Math.floor(Math.random() * 1000),
      favorites: Math.floor(Math.random() * 500),
      uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      aspectRatio,
      resolution: `${actualWidth}x${actualHeight}`
    })
  }
  
  // 根据排序方式排序
  if (sortBy.value === 'latest') {
    data.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
  } else if (sortBy.value === 'popular') {
    data.sort((a, b) => b.likes + b.favorites - (a.likes + a.favorites))
  } else if (sortBy.value === 'random') {
    data.sort(() => Math.random() - 0.5)
  }
  
  return data
}

// 图片加载完成
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  const wallpaperId = parseInt(img.src.split('random=')[1])
  const wallpaper = wallpapers.value.find(w => w.id === wallpaperId)
  if (wallpaper) {
    wallpaper.loaded = true
  }
}

// 切换排序方式
const changeSort = (sort: string) => {
  sortBy.value = sort
  currentPage.value = 1
}

// 切换分类
const changeCategory = (category: string) => {
  currentCategory.value = category
  currentPage.value = 1
}

// 切换分辨率
const changeResolution = (resolution: string) => {
  currentResolution.value = resolution
  currentPage.value = 1
}

// 切换比例
const changeRatio = (ratio: string) => {
  currentRatio.value = ratio
  currentPage.value = 1
}

// 搜索壁纸
const searchWallpapers = () => {
  currentPage.value = 1
  fetchWallpapers()
}

// 重置筛选条件
const resetFilters = () => {
  sortBy.value = 'latest'
  currentCategory.value = ''
  currentResolution.value = ''
  currentRatio.value = ''
  searchKeyword.value = ''
  currentPage.value = 1
}

// 跳转到指定页码
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>