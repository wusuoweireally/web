<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">我的点赞</h2>
    <div v-if="likes.length === 0" class="text-center py-12">
      <i class="i-mdi-heart-off text-6xl text-gray-300 mb-4"></i>
      <p class="text-gray-500 text-lg">暂无点赞的壁纸</p>
      <button 
        class="btn btn-primary mt-4 hover:btn-secondary transition-all duration-300"
        @click="$router.push('/wallpapers')"
      >
        去发现壁纸
      </button>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="like in likes" 
        :key="like.id"
        class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        @click="$router.push(`/wallpaper/${like.id}`)"
      >
        <figure class="aspect-video">
          <img :src="like.imageUrl" :alt="like.title" class="w-full h-full object-cover" />
        </figure>
        <div class="card-body p-4">
          <h3 class="card-title text-sm">{{ like.title }}</h3>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>by {{ like.uploader }}</span>
            <div class="flex gap-2">
              <span class="flex items-center gap-1">
                <i class="i-mdi-heart text-red-500"></i>
                {{ like.likes }}
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

// 模拟点赞数据
const likes = ref([
  {
    id: 6,
    title: '沙漠绿洲',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    uploader: '旅行家',
    likes: 65
  },
  {
    id: 7,
    title: '樱花飞舞',
    imageUrl: 'https://picsum.photos/400/300?random=7',
    uploader: '春天使者',
    likes: 43
  }
])
</script>