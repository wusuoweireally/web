<template>
  <div class="mx-auto max-w-4xl p-6">
    <h2 class="mb-8 text-3xl font-bold text-gray-800">账号设置</h2>

    <div class="space-y-6">
      <!-- 个人信息设置 -->
      <ProfileSettings />

      <!-- 修改密码 -->
      <PasswordSettings />

      <!-- 账号注销 -->
      <AccountSettings />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ProfileSettings from './settings/ProfileSettings.vue'
import PasswordSettings from './settings/PasswordSettings.vue'
import AccountSettings from './settings/AccountSettings.vue'
</script>

