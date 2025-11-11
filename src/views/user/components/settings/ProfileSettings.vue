<template>
  <div
    class="card bg-base-100 shadow-lg transition-shadow duration-300 hover:shadow-xl"
  >
    <div class="card-body">
      <h3 class="card-title mb-4 text-xl">个人信息</h3>

      <div class="space-y-4">
        <!-- 头像上传 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">头像</span>
          </label>
          <div class="flex flex-col items-center gap-4">
            <div class="avatar">
              <div
                class="h-24 w-24 rounded-full ring-2 ring-primary ring-offset-2"
              >
                <img
                  :src="userStore.userAvatar"
                  :alt="userStore.user?.username"
                />
              </div>
            </div>
            <label class="btn btn-outline btn-primary">
              <input
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
                class="hidden"
              />
              更换头像
            </label>
          </div>
          <label class="label" v-if="avatarPreview">
            <span class="label-text-alt text-success">✅ 新头像预览</span>
          </label>
        </div>

        <!-- 用户名 -->
        <div class="form-control">
          <label class="label flex">
            <span class="label-text w-24 font-semibold">用户名</span>
            <input
              type="text"
              v-model="profileForm.username"
              placeholder="请输入用户名"
              class="input-bordered input flex-1 focus:input-primary"
            />
          </label>
        </div>

        <!-- 邮箱 -->
        <div class="form-control">
          <label class="label flex">
            <span class="label-text w-24 font-semibold">邮箱</span>
            <input
              type="email"
              v-model="profileForm.email"
              placeholder="请输入邮箱（可选）"
              class="input-bordered input flex-1 focus:input-primary"
            />
          </label>
        </div>

        <!-- 个人简介 -->
        <div class="form-control">
          <label class="label flex">
            <span class="label-text w-24 font-semibold">个人简介</span>
            <textarea
              v-model="profileForm.bio"
              placeholder="简单介绍一下自己..."
              class="textarea-bordered textarea h-24 flex-1 focus:textarea-primary"
              maxlength="500"
            ></textarea>
          </label>
          <label class="label">
            <span class="label-text-alt text-gray-500"
              >{{ profileForm.bio?.length || 0 }}/500</span
            >
          </label>
        </div>
      </div>

      <div class="card-actions mt-6 justify-end">
        <button
          @click="updateProfile"
          :class="[
            'btn btn-primary transition-all duration-300 hover:btn-secondary',
            { 'btn-disabled loading': loading },
          ]"
          :disabled="loading"
        >
          {{ loading ? "保存中..." : "保存个人信息" }}
        </button>
      </div>

      <!-- 头像上传状态提示 -->
      <div v-if="loading && avatarFile" class="mt-2 text-sm text-info">
        正在上传头像...
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="alert alert-error mt-4 shadow-lg">
        <span>❌ {{ error }}</span>
      </div>

      <!-- 成功提示 -->
      <div v-if="success" class="alert alert-success mt-4 shadow-lg">
        <span>✅ {{ success }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

// 个人信息表单
const profileForm = reactive({
  username: '',
  email: '',
  bio: ''
})

// 头像相关状态
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

// 状态管理
const loading = ref(false)
const error = ref('')
const success = ref('')

// 初始化表单数据
onMounted(() => {
  if (userStore.user) {
    profileForm.username = userStore.user.username || ''
    profileForm.email = userStore.user.email || ''
    profileForm.bio = userStore.user.bio || ''
  }
})

// 头像选择处理
const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    // 验证文件类型和大小
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ]
    if (!allowedTypes.includes(file.type)) {
      error.value = '请选择有效的图片文件 (JPEG, PNG, GIF, WebP)'
      input.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      error.value = '图片大小不能超过 5MB'
      input.value = ''
      return
    }

    avatarFile.value = file
    error.value = ''

    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

    // 自动上传头像
    uploadAvatar(file)
  }
}

// 单独的头像上传方法
const uploadAvatar = async (file: File) => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await fetch(`/api/users/${userStore.user?.id}/avatar`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '头像上传失败')
    }

    const result = await response.json()

    // 更新本地用户信息中的头像URL
    if (userStore.user && result.data?.avatarUrl) {
      userStore.user.avatarUrl = result.data.avatarUrl
    }

    success.value = '头像更新成功'

    // 3秒后清除成功提示
    setTimeout(() => {
      success.value = ''
    }, 3000)

    // 清除预览和文件引用
    avatarFile.value = null
    avatarPreview.value = null

    return result
  } catch (err: any) {
    error.value = err.message || '头像上传失败'
    throw new Error(err.message || '头像上传失败')
  } finally {
    loading.value = false
  }
}

// 表单验证
const validateProfileForm = (): boolean => {
  // 验证邮箱格式
  if (profileForm.email && !validateEmail(profileForm.email)) {
    error.value = '请输入有效的邮箱地址'
    return false
  }

  return true
}

// 验证邮箱格式
const validateEmail = (email: string) => {
  if (!email) return true // 邮箱为空时跳过验证
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 检查是否有需要更新的字段
const hasProfileChanges = (): boolean => {
  if (!userStore.user) return false

  return (
    profileForm.username !== userStore.user.username ||
    profileForm.email !== userStore.user.email ||
    profileForm.bio !== userStore.user.bio
  )
}

// 更新个人信息
const updateProfile = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // 表单验证
    if (!validateProfileForm()) {
      loading.value = false
      return
    }

    // 检查是否有更改
    if (!hasProfileChanges()) {
      success.value = '没有需要更新的信息'
      loading.value = false
      // 3秒后清除成功提示
      setTimeout(() => {
        success.value = ''
      }, 3000)
      return
    }

    const updateData: any = {}

    if (profileForm.username !== userStore.user?.username) {
      updateData.username = profileForm.username
    }

    // 邮箱可以为空字符串，允许更新为空
    if (profileForm.email !== userStore.user?.email) {
      updateData.email = profileForm.email // 保留原始值，包括空字符串
    }

    if (profileForm.bio !== userStore.user?.bio) {
      updateData.bio = profileForm.bio
    }

    // 更新用户信息
    await userStore.updateUserInfo(updateData)

    success.value = '个人信息更新成功'

    // 3秒后清除成功提示
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.message || '更新失败'
  } finally {
    loading.value = false
  }
}
</script>