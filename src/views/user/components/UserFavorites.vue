<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">我的收藏</h2>
    <div v-if="favorites.length === 0" class="text-center py-12">
      <i class="i-mdi-star-off text-6xl text-gray-300 mb-4"></i>
      <p class="text-gray-500 text-lg">暂无收藏的壁纸</p>
      <button 
        class="btn btn-primary mt-4 hover:btn-secondary transition-all duration-300"
        @click="$router.push('/wallpapers')"
      >
        去发现壁纸
      </button>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="favorite in favorites" 
        :key="favorite.id"
        class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        @click="$router.push(`/wallpaper/${favorite.id}`)"
      >
        <figure class="aspect-video">
          <img :src="favorite.imageUrl" :alt="favorite.title" class="w-full h-full object-cover" />
        </figure>
        <div class="card-body p-4">
          <h3 class="card-title text-sm">{{ favorite.title }}</h3>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>by {{ favorite.uploader }}</span>
            <div class="flex gap-2">
              <span class="flex items-center gap-1">
                <i class="i-mdi-heart text-red-500"></i>
                {{ favorite.likes }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 模拟收藏数据
const favorites = ref([
  {
    id: 4,
    title: '城市夜景',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    uploader: '夜景摄影师',
    likes: 78
  },
  {
    id: 5,
    title: '雪山之巅',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    uploader: '登山爱好者',
    likes: 92
  }
])
</script>