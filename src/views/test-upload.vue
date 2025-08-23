<template>
  <div class="min-h-screen bg-base-200 p-8">
    <div class="max-w-md mx-auto">
      <h1 class="text-2xl font-bold mb-6">测试上传功能</h1>
      
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="form-control">
            <label class="label">
              <span class="label-text">选择图片文件</span>
            </label>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              class="file-input file-input-bordered"
              @change="handleFileSelect"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">标题</span>
            </label>
            <input
              type="text"
              v-model="formData.title"
              placeholder="输入标题"
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">描述</span>
            </label>
            <textarea
              v-model="formData.description"
              placeholder="输入描述"
              class="textarea textarea-bordered"
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">上传者ID</span>
            </label>
            <input
              type="number"
              v-model="formData.uploaderId"
              placeholder="输入上传者ID"
              class="input input-bordered"
            />
          </div>

          <div class="form-control mt-6">
            <button
              class="btn btn-primary"
              :class="{ 'loading': loading }"
              :disabled="loading"
              @click="handleUpload"
            >
              测试上传
            </button>
          </div>

          <div v-if="response" class="mt-6 p-4 bg-base-200 rounded-lg">
            <h3 class="font-bold mb-2">响应结果：</h3>
            <pre class="text-sm overflow-auto">{{ JSON.stringify(response, null, 2) }}</pre>
          </div>

          <div v-if="error" class="mt-6 p-4 bg-error text-error-content rounded-lg">
            <h3 class="font-bold mb-2">错误信息：</h3>
            <pre class="text-sm">{{ error }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { wallpaperService } from '@/services/wallpaper'

const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const response = ref<any>(null)
const error = ref<string>('')

const formData = reactive({
  file: null as File | null,
  title: '测试壁纸',
  description: '这是一个测试壁纸',
  uploaderId: 1
})

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    formData.file = input.files[0]
  }
}

const handleUpload = async () => {
  if (!formData.file) {
    error.value = '请选择文件'
    return
  }

  loading.value = true
  response.value = null
  error.value = ''

  try {
    const result = await wallpaperService.uploadWallpaper({
      file: formData.file,
      title: formData.title,
      description: formData.description,
      uploaderId: formData.uploaderId
    })
    
    response.value = result
  } catch (err: any) {
    error.value = err.message || '上传失败'
    console.error('上传错误:', err)
  } finally {
    loading.value = false
  }
}
</script>