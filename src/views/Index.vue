<template>
  <!-- ...existing code... -->
  <div class="relative min-h-screen">
    <!-- 背景层：仅模糊背景图 -->
    <div
      class="absolute inset-0 filter scale-105 bg-[url('/src/assets/bg.webp')] bg-cover bg-center blur-lg"
      aria-hidden="true"
    ></div>
    <!-- 头部导航栏 -->
    <div class="relative z-10 mx-auto flex px-4 py-4">
      <!-- heard-left -->
      <div class="basis-1/5 p-1 text-lg text-white">
        随心壁纸世界上最好的壁纸
      </div>

      <!-- head-mid（改为循环生成，统一样式与图标） -->
      <div class="mt-4 flex flex-1 basis-3/5 justify-between">
        <!-- changed code -->
        <template v-for="item in navItems" :key="item.name">
          <router-link
            :to="item.to"
            class="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1 text-white transition hover:bg-white/10"
          >
            <!-- icon 使用 v-html 插入小 SVG（已在 script 中定义） -->
            <span>{{ item.name }}</span>
          </router-link>
        </template>
        <!-- ...existing code... -->
      </div>

      <!-- head-right -->
      <div v-show="true" class="flex basis-1/5 justify-end space-x-2">
        <button class="btn">
          <router-link to="/auth/login">登录</router-link>
        </button>
        <button class="btn btn-primary">
          <router-link to="/auth/register">注册</router-link>
        </button>
      </div>
    </div>
    <!-- 壁纸图片网格 -->
    <!-- <img :src="papers[0]" alt="" /> -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import api from "@/config/api";
/* ...existing code... */
const navItems = [
  {
    name: "最新壁纸",
    to: "/latest",
  },
  {
    name: "排行榜",
    to: "/top",
  },
  {
    name: "随机壁纸",
    to: "/random",
  },
  {
    name: "上传壁纸",
    to: "/upload",
  },
  {
    name: "论坛",
    to: "/forums",
  },
];
// let papers = ref<string[]>([]);

// try {
//   for (let i = 0; i < 10; i++) {
//     const response: any = await api.get("/papers/random");
//     if (response.code === 200) {
//       papers.value.push(response.url);
//     }
//   }
//   console.log("获取壁纸成功:", papers.value);
// } catch (error) {
//   console.error("获取壁纸失败:", error);
// }
</script>
