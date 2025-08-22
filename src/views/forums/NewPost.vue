<template>
  <div class="min-h-screen bg-base-200 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">发布新帖子</h1>
        <button 
          class="btn btn-ghost"
          @click="$router.back()"
        >
          <i class="i-mdi-close text-lg"></i>
          取消
        </button>
      </div>
      
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">标题</span>
            </label>
            <input
              type="text"
              placeholder="请输入帖子标题"
              class="input input-bordered"
            />
          </div>
          
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">内容</span>
            </label>
            <textarea
              placeholder="请输入帖子内容..."
              class="textarea textarea-bordered h-64"
            ></textarea>
          </div>
          
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text">分类</span>
            </label>
            <select class="select select-bordered">
              <option disabled selected>请选择分类</option>
              <option>讨论</option>
              <option>求助</option>
              <option>分享</option>
            </select>
          </div>
          
          <div class="card-actions justify-end">
            <button class="btn btn-primary">
              <i class="i-mdi-send text-lg"></i>
              发布帖子
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 发布新帖子的逻辑
</script>