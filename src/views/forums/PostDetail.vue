<template>
  <div class="min-h-screen bg-base-200 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <button 
          class="btn btn-ghost"
          @click="$router.back()"
        >
          <i class="i-mdi-arrow-left text-lg"></i>
          返回
        </button>
        <div class="flex gap-2">
          <button class="btn btn-ghost">
            <i class="i-mdi-heart text-lg"></i>
            点赞
          </button>
          <button class="btn btn-ghost">
            <i class="i-mdi-share text-lg"></i>
            分享
          </button>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-md mb-6">
        <div class="card-body">
          <div class="flex items-start gap-4">
            <div class="avatar">
              <div class="w-12 h-12 rounded-full">
                <img src="https://picsum.photos/100/100?random=1" alt="用户头像" />
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="font-bold">星空爱好者</h3>
                <span class="badge badge-outline">讨论</span>
                <span class="text-sm text-gray-500">2024-01-15 10:30</span>
              </div>
              <h1 class="text-2xl font-bold mb-4">分享一些4K壁纸制作技巧</h1>
              <div class="prose max-w-none">
                <p>最近在研究4K壁纸制作，发现了一些不错的技巧和大家分享。首先要选择合适的原始素材，分辨率要足够高...</p>
                <p>其次要注意色彩搭配和构图，这里有一些实用的建议...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-md mb-6">
        <div class="card-body">
          <h3 class="card-title">评论 (8)</h3>
          <div class="space-y-4 mt-4">
            <div class="flex gap-4">
              <div class="avatar">
                <div class="w-8 h-8 rounded-full">
                  <img src="https://picsum.photos/100/100?random=2" alt="用户头像" />
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold">摄影新手</span>
                  <span class="text-sm text-gray-500">2024-01-15 11:45</span>
                </div>
                <p>感谢分享！这些技巧对我很有帮助，特别是关于色彩搭配的部分。</p>
                <div class="flex gap-2 mt-2">
                  <button class="btn btn-xs btn-ghost">
                    <i class="i-mdi-heart-outline"></i>
                    回复
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-control mt-6">
            <label class="label">
              <span class="label-text">发表评论</span>
            </label>
            <textarea
              placeholder="请输入您的评论..."
              class="textarea textarea-bordered h-24"
            ></textarea>
            <div class="card-actions justify-end mt-2">
              <button class="btn btn-primary">
                <i class="i-mdi-send text-lg"></i>
                发表评论
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 帖子详情页逻辑
</script>