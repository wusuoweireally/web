<template>
  <div
    class="card bg-base-100 shadow-lg transition-shadow duration-300 hover:shadow-xl"
  >
    <div class="card-body">
      <h3 class="card-title mb-4 text-xl text-error">账号注销</h3>
      <p class="mb-4 text-gray-600">
        注销账号将永久删除您的所有数据，包括上传的壁纸、收藏、点赞等。此操作无法撤销。
      </p>
      <div class="card-actions justify-end">
        <button
          class="btn btn-error transition-all duration-300 hover:btn-error/80"
          @click="showDeleteConfirm = true"
        >
          注销账号
        </button>
      </div>
    </div>
  </div>

  <!-- 注销确认模态框 -->
  <div v-if="showDeleteConfirm" class="modal modal-open">
    <div class="modal-box bg-error text-error-content">
      <h3 class="text-2xl font-bold">
        <i class="i-mdi-alert-circle mr-2"></i>确认注销账号
      </h3>
      <div class="py-4 text-lg">
        ⚠️ 此操作将永久删除您的所有数据，包括：
        <ul class="mt-2 list-inside list-disc space-y-1">
          <li>所有上传的壁纸</li>
          <li>收藏和点赞记录</li>
          <li>个人资料和设置</li>
        </ul>
      </div>
      <p class="text-xl font-bold">此操作无法撤销！</p>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="showDeleteConfirm = false">
          取消
        </button>
        <button class="btn btn-outline btn-error" @click="deleteAccount">
          确认注销
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 注销确认弹窗显示状态
const showDeleteConfirm = ref(false)

// 注销账号
const deleteAccount = async () => {
  try {
    // 这里需要调用后端的账号删除接口
    // 由于后端目前没有账号删除接口，暂时提示用户
    alert('账号注销功能暂未开放，请联系管理员')
    showDeleteConfirm.value = false
  } catch (error) {
    console.error('注销账号失败:', error)
    alert('注销账号失败，请重试')
  }
}
</script>