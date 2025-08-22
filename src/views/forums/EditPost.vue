<template>
  <div class="min-h-screen bg-base-200 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">编辑帖子</h1>
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
              value="分享一些4K壁纸制作技巧"
            />
          </div>
          
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">内容</span>
            </label>
            <textarea
              placeholder="请输入帖子内容..."
              class="textarea textarea-bordered h-64"
            >最近在研究4K壁纸制作，发现了一些不错的技巧和大家分享。首先要选择合适的原始素材，分辨率要足够高...</textarea>
          </div>
          
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text">分类</span>
            </label>
            <select class="select select-bordered">
              <option>讨论</option>
              <option selected>分享</option>
              <option>求助</option>
            </select>
          </div>
          
          <div class="card-actions justify-end">
            <button class="btn btn-primary">
              <i class="i-mdi-check text-lg"></i>
              保存修改
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 编辑帖子的逻辑
</script>