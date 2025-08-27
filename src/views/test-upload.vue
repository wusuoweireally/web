<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">测试上传页面</h1>
      <p class="text-gray-600">此页面用于测试上传功能</p>
      <button class="btn btn-primary mt-4" @click="$router.push('/wallpaper/upload')">
        前往上传页面
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>