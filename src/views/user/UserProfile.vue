<template>
  <div class="min-h-screen bg-base-200">
    <!-- 导航栏 -->
    <nav class="navbar bg-base-100 shadow-sm">
      <div class="flex-1">
        <button class="btn btn-ghost btn-sm" @click="$router.back()">
          <i class="i-mdi-arrow-left text-lg"></i>
          返回
        </button>
        <h1 class="text-xl font-bold ml-4">编辑资料</h1>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <!-- 头像上传 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">头像</span>
              </label>
              <div class="flex items-center gap-6">
                <div class="avatar">
                  <div class="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img 
                      :src="previewAvatar || userStore.userAvatar" 
                      :alt="formData.username"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="file"
                    ref="avatarInput"
                    accept="image/*"
                    class="hidden"
                    @change="handleAvatarUpload"
                  />
                  <button 
                    class="btn btn-outline btn-sm"
                    @click="avatarInput?.click()"
                  >
                    <i class="i-mdi-upload text-lg"></i>
                    选择图片
                  </button>
                  <p class="text-xs text-gray-500 mt-1">支持 JPG, PNG 格式，最大 2MB</p>
                </div>
              </div>
            </div>

            <!-- 用户名 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">用户名</span>
              </label>
              <input
                type="text"
                v-model="formData.username"
                placeholder="请输入用户名"
                class="input input-bordered"
                :class="{ 'input-error': errors.username }"
              />
              <label class="label" v-if="errors.username">
                <span class="label-text-alt text-error">{{ errors.username }}</span>
              </label>
            </div>

            <!-- 邮箱 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">邮箱</span>
              </label>
              <input
                type="email"
                v-model="formData.email"
                placeholder="请输入邮箱"
                class="input input-bordered"
                :class="{ 'input-error': errors.email }"
              />
              <label class="label" v-if="errors.email">
                <span class="label-text-alt text-error">{{ errors.email }}</span>
              </label>
            </div>

            <!-- 个人简介 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">个人简介</span>
              </label>
              <textarea
                v-model="formData.bio"
                placeholder="介绍一下自己吧～"
                class="textarea textarea-bordered h-24"
                :class="{ 'textarea-error': errors.bio }"
              ></textarea>
              <label class="label">
                <span class="label-text-alt">{{ formData.bio?.length || 0 }}/200</span>
              </label>
              <label class="label" v-if="errors.bio">
                <span class="label-text-alt text-error">{{ errors.bio }}</span>
              </label>
            </div>

            <!-- 操作按钮 -->
            <div class="form-control mt-6">
              <button 
                class="btn btn-primary"
                :class="{ 'loading': loading }"
                :disabled="loading"
                @click="handleSubmit"
              >
                <i class="i-mdi-check text-lg"></i>
                保存修改
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

        <!-- 账户安全区域 -->
        <div class="card bg-base-100 shadow-xl mt-6">
          <div class="card-body">
            <h2 class="card-title text-lg">账户安全</h2>
            
            <!-- 修改密码 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">新密码</span>
              </label>
              <input
                type="password"
                v-model="passwordData.newPassword"
                placeholder="请输入新密码"
                class="input input-bordered"
                :class="{ 'input-error': errors.newPassword }"
              />
              <label class="label" v-if="errors.newPassword">
                <span class="label-text-alt text-error">{{ errors.newPassword }}</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">确认新密码</span>
              </label>
              <input
                type="password"
                v-model="passwordData.confirmPassword"
                placeholder="请再次输入新密码"
                class="input input-bordered"
                :class="{ 'input-error': errors.confirmPassword }"
              />
              <label class="label" v-if="errors.confirmPassword">
                <span class="label-text-alt text-error">{{ errors.confirmPassword }}</span>
              </label>
            </div>

            <div class="form-control mt-4">
              <button 
                class="btn btn-secondary"
                :class="{ 'loading': passwordLoading }"
                :disabled="passwordLoading"
                @click="handleChangePassword"
              >
                <i class="i-mdi-lock text-lg"></i>
                修改密码
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const avatarInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const passwordLoading = ref(false)
const previewAvatar = ref<string>('')

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  bio: '',
  avatarFile: null as File | null
})

// 密码数据
const passwordData = reactive({
  newPassword: '',
  confirmPassword: ''
})

// 错误信息
const errors = reactive({
  username: '',
  email: '',
  bio: '',
  newPassword: '',
  confirmPassword: ''
})

// 页面加载时初始化表单数据
onMounted(() => {
  if (userStore.user) {
    formData.username = userStore.user.username
    formData.email = userStore.user.email
    // bio 字段需要根据实际用户数据结构调整
    formData.bio = '这个人很懒，什么都没有写～'
  }
})

// 处理头像上传
const handleAvatarUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // 验证文件类型和大小
    if (!file.type.startsWith('image/')) {
      errors.username = '请选择图片文件'
      return
    }
    
    if (file.size > 2 * 1024 * 1024) {
      errors.username = '图片大小不能超过 2MB'
      return
    }
    
    formData.avatarFile = file
    
    // 预览图片
    const reader = new FileReader()
    reader.onload = (e) => {
      previewAvatar.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    
    // 清空错误信息
    errors.username = ''
  }
}

// 验证表单
const validateForm = () => {
  let isValid = true
  
  // 清空错误信息
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  // 验证用户名
  if (!formData.username.trim()) {
    errors.username = '用户名不能为空'
    isValid = false
  } else if (formData.username.length < 2) {
    errors.username = '用户名至少2个字符'
    isValid = false
  } else if (formData.username.length > 20) {
    errors.username = '用户名不能超过20个字符'
    isValid = false
  }
  
  // 验证邮箱
  if (!formData.email.trim()) {
    errors.email = '邮箱不能为空'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }
  
  // 验证个人简介
  if (formData.bio && formData.bio.length > 200) {
    errors.bio = '个人简介不能超过200个字符'
    isValid = false
  }
  
  return isValid
}

// 验证密码
const validatePassword = () => {
  let isValid = true
  
  // 清空错误信息
  errors.newPassword = ''
  errors.confirmPassword = ''
  
  // 验证新密码
  if (!passwordData.newPassword) {
    errors.newPassword = '新密码不能为空'
    isValid = false
  } else if (passwordData.newPassword.length < 6) {
    errors.newPassword = '密码至少6个字符'
    isValid = false
  }
  
  // 验证确认密码
  if (!passwordData.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    isValid = false
  } else if (passwordData.newPassword !== passwordData.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }
  
  return isValid
}

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // 调用更新用户信息的API
    await userStore.updateUserInfo({
      username: formData.username,
      email: formData.email,
      avatarFile: formData.avatarFile
      // bio 字段需要根据实际API调整
    })
    
    // 更新成功，返回上一页
    router.back()
  } catch (error: any) {
    console.error('更新用户信息失败:', error)
    // 可以根据错误类型显示不同的错误信息
    errors.username = error.message || '更新失败，请重试'
  } finally {
    loading.value = false
  }
}

// 修改密码
const handleChangePassword = async () => {
  if (!validatePassword()) return
  
  passwordLoading.value = true
  
  try {
    // 这里应该调用修改密码的API
    // await api.post('/auth/change-password', {
    //   newPassword: passwordData.newPassword
    // })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 清空密码字段
    passwordData.newPassword = ''
    passwordData.confirmPassword = ''
    
    // 显示成功消息
    alert('密码修改成功！')
  } catch (error: any) {
    console.error('修改密码失败:', error)
    errors.newPassword = error.message || '修改密码失败，请重试'
  } finally {
    passwordLoading.value = false
  }
}
</script>

<style scoped>
/* 自定义样式 */
.avatar {
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .avatar {
    width: 16px;
    height: 16px;
  }
}
</style>