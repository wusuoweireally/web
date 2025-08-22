<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">账号设置</h2>
    <div class="space-y-6">
      <!-- 修改密码 -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h3 class="card-title">修改密码</h3>
          <div class="form-control">
            <label class="label">
              <span class="label-text">当前密码</span>
            </label>
            <input
              type="password"
              placeholder="请输入当前密码"
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">新密码</span>
            </label>
            <input
              type="password"
              placeholder="请输入新密码"
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">确认新密码</span>
            </label>
            <input
              type="password"
              placeholder="请再次输入新密码"
              class="input input-bordered"
            />
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary">保存修改</button>
          </div>
        </div>
      </div>

      <!-- 隐私设置 -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h3 class="card-title">隐私设置</h3>
          <div class="form-control">
            <label class="label cursor-pointer justify-between">
              <span class="label-text">公开我的个人资料</span>
              <input type="checkbox" class="toggle toggle-primary" checked />
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer justify-between">
              <span class="label-text">允许他人关注我</span>
              <input type="checkbox" class="toggle toggle-primary" checked />
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer justify-between">
              <span class="label-text">接收系统通知</span>
              <input type="checkbox" class="toggle toggle-primary" checked />
            </label>
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary">保存设置</button>
          </div>
        </div>
      </div>

      <!-- 账号注销 -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h3 class="card-title text-error">账号注销</h3>
          <p class="text-gray-600">
            注销账号将永久删除您的所有数据，包括上传的壁纸、收藏、点赞等。此操作无法撤销。
          </p>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-error">注销账号</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 这里可以添加账号设置相关的逻辑
</script>