<template>
  <div class="min-h-screen bg-base-200">
    <!-- 导航栏 -->
    <nav class="navbar bg-base-100 shadow-sm">
      <div class="flex-1">
        <button class="btn btn-ghost btn-sm" @click="$router.back()">
          <i class="i-mdi-arrow-left text-lg"></i>
          返回
        </button>
        <h1 class="text-xl font-bold ml-4">上传壁纸</h1>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <!-- 图片上传区域 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">选择壁纸图片</span>
              </label>
              <div 
                class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                :class="{ 'border-primary': isDragging, 'border-error': errors.image }"
                @click="fileInput?.click()"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop="handleDrop"
              >
                <input
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileSelect"
                />
                
                <div v-if="!previewImage">
                  <i class="i-mdi-cloud-upload text-4xl text-gray-400 mb-4"></i>
                  <p class="text-gray-600 mb-2">点击选择图片或拖拽到此处</p>
                  <p class="text-sm text-gray-500">支持 JPG, PNG, WEBP 格式，最大 10MB</p>
                </div>
                
                <div v-else class="relative">
                  <img 
                    :src="previewImage" 
                    alt="预览图"
                    class="max-h-64 mx-auto rounded-lg"
                  />
                  <button 
                    class="btn btn-circle btn-sm btn-error absolute -top-2 -right-2"
                    @click.stop="removeImage"
                  >
                    <i class="i-mdi-close"></i>
                  </button>
                </div>
              </div>
              <label class="label" v-if="errors.image">
                <span class="label-text-alt text-error">{{ errors.image }}</span>
              </label>
            </div>

            <!-- 图片信息显示 -->
            <div v-if="imageInfo" class="bg-gray-50 rounded-lg p-4 mt-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">文件名:</span>
                  <span class="font-medium ml-2">{{ imageInfo.name }}</span>
                </div>
                <div>
                  <span class="text-gray-600">文件大小:</span>
                  <span class="font-medium ml-2">{{ imageInfo.size }}</span>
                </div>
                <div>
                  <span class="text-gray-600">尺寸:</span>
                  <span class="font-medium ml-2">{{ imageInfo.width }} × {{ imageInfo.height }}</span>
                </div>
                <div>
                  <span class="text-gray-600">格式:</span>
                  <span class="font-medium ml-2">{{ imageInfo.type }}</span>
                </div>
              </div>
            </div>

            <!-- 壁纸标题 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">壁纸标题</span>
              </label>
              <input
                type="text"
                v-model="formData.title"
                placeholder="请输入壁纸标题"
                class="input input-bordered"
                :class="{ 'input-error': errors.title }"
              />
              <label class="label" v-if="errors.title">
                <span class="label-text-alt text-error">{{ errors.title }}</span>
              </label>
            </div>

            <!-- 壁纸描述 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">壁纸描述</span>
              </label>
              <textarea
                v-model="formData.description"
                placeholder="描述一下这张壁纸的特点和适用场景..."
                class="textarea textarea-bordered h-24"
                :class="{ 'textarea-error': errors.description }"
              ></textarea>
              <label class="label">
                <span class="label-text-alt">{{ formData.description?.length || 0 }}/500</span>
              </label>
              <label class="label" v-if="errors.description">
                <span class="label-text-alt text-error">{{ errors.description }}</span>
              </label>
            </div>

            <!-- 标签选择 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">标签</span>
                <span class="label-text-alt">最多选择5个标签</span>
              </label>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in availableTags" 
                  :key="tag"
                  class="badge cursor-pointer"
                  :class="{
                    'badge-primary': selectedTags.includes(tag),
                    'badge-outline': !selectedTags.includes(tag)
                  }"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                </span>
              </div>
              <label class="label" v-if="errors.tags">
                <span class="label-text-alt text-error">{{ errors.tags }}</span>
              </label>
            </div>

            <!-- 分类选择 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">分类</span>
              </label>
              <select 
                v-model="formData.category"
                class="select select-bordered"
                :class="{ 'select-error': errors.category }"
              >
                <option value="" disabled>请选择分类</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <label class="label" v-if="errors.category">
                <span class="label-text-alt text-error">{{ errors.category }}</span>
              </label>
            </div>

            <!-- 可见性设置 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">可见性</span>
              </label>
              <div class="flex gap-4">
                <label class="label cursor-pointer gap-2">
                  <input 
                    type="radio" 
                    name="visibility" 
                    value="public"
                    v-model="formData.visibility"
                    class="radio radio-primary"
                  />
                  <span class="label-text">公开</span>
                </label>
                <label class="label cursor-pointer gap-2">
                  <input 
                    type="radio" 
                    name="visibility" 
                    value="private"
                    v-model="formData.visibility"
                    class="radio radio-primary"
                  />
                  <span class="label-text">私有</span>
                </label>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="form-control mt-6">
              <button 
                class="btn btn-primary"
                :class="{ 'loading': loading }"
                :disabled="loading || !formData.imageFile"
                @click="handleSubmit"
              >
                <i class="i-mdi-upload text-lg"></i>
                上传壁纸
              </button>
              <button 
                class="btn btn-ghost mt-2"
                @click="$router.back()"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const isDragging = ref(false)
const previewImage = ref<string>('')

// 表单数据
const formData = reactive({
  imageFile: null as File | null,
  title: '',
  description: '',
  category: '',
  visibility: 'public',
  tags: [] as string[]
})

// 图片信息
const imageInfo = ref<{
  name: string
  size: string
  width: number
  height: number
  type: string
} | null>(null)

// 错误信息
const errors = reactive({
  image: '',
  title: '',
  description: '',
  category: '',
  tags: ''
})

// 可用标签
const availableTags = [
  '4K', '8K', '高清', '超清',
  '风景', '星空', '海洋', '森林', '城市',
  '动漫', '游戏', '电影', '艺术',
  '暗色', '亮色', '渐变', '抽象',
  '自然', '动物', '植物', '建筑'
]

// 可用分类
const categories = [
  '风景', '抽象', '动漫', '游戏', 
  '电影', '艺术', '自然', '城市',
  '动物', '植物', '科技', '其他'
]

// 选中的标签
const selectedTags = ref<string[]>([])

// 切换标签选择
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    if (selectedTags.value.length < 5) {
      selectedTags.value.push(tag)
    }
  } else {
    selectedTags.value.splice(index, 1)
  }
  formData.tags = selectedTags.value
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processImageFile(input.files[0])
  }
}

// 处理拖拽放置
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processImageFile(event.dataTransfer.files[0])
  }
}

// 处理图片文件
const processImageFile = (file: File) => {
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    errors.image = '请选择图片文件'
    return
  }
  
  // 验证文件大小 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    errors.image = '图片大小不能超过 10MB'
    return
  }
  
  formData.imageFile = file
  errors.image = ''
  
  // 创建预览图
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string
    
    // 获取图片尺寸信息
    const img = new Image()
    img.onload = () => {
      imageInfo.value = {
        name: file.name,
        size: formatFileSize(file.size),
        width: img.width,
        height: img.height,
        type: file.type.split('/')[1].toUpperCase()
      }
    }
    img.src = previewImage.value
  }
  reader.readAsDataURL(file)
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 移除图片
const removeImage = () => {
  formData.imageFile = null
  previewImage.value = ''
  imageInfo.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 验证表单
const validateForm = (): boolean => {
  let isValid = true
  
  // 清空错误信息
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  // 验证图片
  if (!formData.imageFile) {
    errors.image = '请选择要上传的图片'
    isValid = false
  }
  
  // 验证标题
  if (!formData.title.trim()) {
    errors.title = '标题不能为空'
    isValid = false
  } else if (formData.title.length > 50) {
    errors.title = '标题不能超过50个字符'
    isValid = false
  }
  
  // 验证描述
  if (formData.description && formData.description.length > 500) {
    errors.description = '描述不能超过500个字符'
    isValid = false
  }
  
  // 验证分类
  if (!formData.category) {
    errors.category = '请选择分类'
    isValid = false
  }
  
  // 验证标签
  if (selectedTags.value.length === 0) {
    errors.tags = '请至少选择一个标签'
    isValid = false
  }
  
  return isValid
}

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // 创建FormData对象
    const formDataToSend = new FormData()
    formDataToSend.append('image', formData.imageFile!)
    formDataToSend.append('title', formData.title)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('visibility', formData.visibility)
    formData.tags.forEach(tag => {
      formDataToSend.append('tags[]', tag)
    })
    
    // 这里应该调用上传API
    // const response = await api.post('/wallpapers/upload', formDataToSend, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 上传成功，跳转到壁纸详情页或用户中心
    alert('壁纸上传成功！')
    router.push('/user')
  } catch (error: any) {
    console.error('上传失败:', error)
    alert(error.message || '上传失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 拖拽区域样式 */
.border-dashed {
  transition: all 0.3s ease;
}

.border-dashed:hover {
  border-color: hsl(var(--p));
  background-color: hsl(var(--b1) / 0.5);
}

/* 图片预览样式 */
img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
