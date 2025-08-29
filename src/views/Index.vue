<template>
  <div
    class="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
  >
    <!-- 头部导航栏 -->
    <NavBar />

    <!-- 精选壁纸展示 -->
    <WallpaperShowcase />
  </div>
</template>

<script lang="ts" setup>
import NavBar from "@/components/NavBar.vue";
import WallpaperShowcase from "@/components/WallpaperShowcase.vue";
</script>
