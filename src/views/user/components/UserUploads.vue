<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">我的上传</h2>
    <div v-if="uploads.length === 0" class="text-center py-12">
      <i class="i-mdi-image-off text-6xl text-gray-300 mb-4"></i>
      <p class="text-gray-500 text-lg">暂无上传的壁纸</p>
      <button 
        class="btn btn-primary mt-4 hover:btn-secondary transition-all duration-300"
        @click="$router.push('/upload')"
      >
        开始上传
      </button>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="upload in uploads" 
        :key="upload.id"
        class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        @click="$router.push(`/wallpaper/${upload.id}`)"
      >
        <figure class="aspect-video">
          <img :src="upload.imageUrl" :alt="upload.title" class="w-full h-full object-cover" />
        </figure>
        <div class="card-body p-4">
          <h3 class="card-title text-sm">{{ upload.title }}</h3>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ upload.uploadDate }}</span>
            <div class="flex gap-2">
              <span class="flex items-center gap-1">
                <i class="i-mdi-heart text-red-500"></i>
                {{ upload.likes }}
              </span>
              <span class="flex items-center gap-1">
                <i class="i-mdi-star text-yellow-500"></i>
                {{ upload.favorites }}
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

// 模拟上传数据
const uploads = ref([
  {
    id: 1,
    title: '梦幻星空',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    uploadDate: '2024-01-15',
    likes: 45,
    favorites: 23
  },
  {
    id: 2,
    title: '海洋之心',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    uploadDate: '2024-01-10',
    likes: 32,
    favorites: 18
  },
  {
    id: 3,
    title: '森林秘境',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    uploadDate: '2024-01-05',
    likes: 28,
    favorites: 15
  }
])
</script>