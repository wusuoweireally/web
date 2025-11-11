<template>
  <div
    class="card bg-base-100 shadow-lg transition-shadow duration-300 hover:shadow-xl"
  >
    <div class="card-body">
      <h3 class="card-title mb-4 text-xl">修改密码</h3>

      <div class="space-y-4">
        <div class="form-control">
          <label class="label flex">
            <span class="label-text w-24 font-semibold">当前密码</span>
            <input
              type="password"
              v-model="passwordForm.currentPassword"
              placeholder="请输入当前密码"
              class="input-bordered input flex-1 focus:input-primary"
            />
          </label>
        </div>

        <div class="form-control">
          <label class="label flex">
            <span class="label-text w-24 font-semibold">新密码</span>
            <input
              type="password"
              v-model="passwordForm.newPassword"
              placeholder="请输入新密码"
              class="input-bordered input flex-1 focus:input-primary"
            />
          </label>
        </div>

        <div class="form-control">
          <label class="label flex">
            <span class="label-text w-24 font-semibold">确认新密码</span>
            <input
              type="password"
              v-model="passwordForm.confirmPassword"
              placeholder="请再次输入新密码"
              class="input-bordered input flex-1 focus:input-primary"
            />
          </label>
        </div>
      </div>

      <div class="card-actions mt-6 justify-end">
        <button
          @click="updatePassword"
          :class="[
            'btn btn-primary transition-all duration-300 hover:btn-secondary',
            { 'btn-disabled loading': loading },
          ]"
          :disabled="loading"
        >
          {{ loading ? "保存中..." : "修改密码" }}
        </button>
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
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

// 密码表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 状态管理
const loading = ref(false)
const error = ref('')
const success = ref('')

// 验证密码表单
const validatePasswordForm = (): boolean => {
  // 验证当前密码
  if (!passwordForm.currentPassword) {
    error.value = '请输入当前密码'
    return false
  }

  // 验证新密码
  if (!passwordForm.newPassword) {
    error.value = '请输入新密码'
    return false
  }

  if (passwordForm.newPassword.length < 6) {
    error.value = '新密码长度至少6位'
    return false
  }

  // 验证确认密码
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return false
  }

  return true
}

// 更新密码
const updatePassword = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // 表单验证
    if (!validatePasswordForm()) {
      loading.value = false
      return
    }

    // 这里需要调用后端的密码更新接口
    // 由于后端目前没有专门的密码更新接口，暂时使用通用的更新接口
    await userStore.updateUserInfo({
      password: passwordForm.newPassword
    })

    success.value = '密码修改成功'

    // 清空密码表单
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''

    // 3秒后清除成功提示
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.message || '密码修改失败'
  } finally {
    loading.value = false
  }
}
</script>