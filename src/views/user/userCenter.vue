<template>
  <div class="min-h-screen bg-base-200">
    <!-- 用户信息头部 -->
    <div class="bg-base-100 py-8">
      <div class="container mx-auto px-4">
        <!-- 返回首页按钮 -->
        <div class="mb-6">
          <button class="btn btn-ghost btn-sm" @click="$router.push('/')">
            <i class="i-mdi-arrow-left text-lg"></i>
            返回首页
          </button>
        </div>

        <!-- 响应式用户信息布局 -->
        <div class="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <!-- 用户头像 -->
          <div class="avatar relative">
            <div class="h-24 w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
              <img
                :src="userStore.userAvatar"
                :alt="userStore.user?.username"
                class="object-cover"
              />
            </div>
            <!-- 在线状态指示器 -->
            <div class="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-success border-2 border-base-100"></div>
          </div>

          <!-- 用户信息 -->
          <div class="w-full flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 class="text-3xl font-bold">{{ userStore.user?.username }}</h1>
                <p class="text-gray-500 mt-1">{{ userStore.user?.email }}</p>
                <p v-if="userStore.user?.bio" class="text-gray-600 mt-2 max-w-md">
                  {{ userStore.user.bio }}
                </p>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-outline btn-sm" @click="$router.push('/user/settings')">
                  <i class="i-mdi-cog"></i>
                  编辑资料
                </button>
              </div>
            </div>

            <!-- 响应式统计信息网格 -->
            <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div
                class="stat place-items-center rounded-box bg-base-100 p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                @click="$router.push('/user/uploads')"
              >
                <div class="stat-figure text-primary">
                  <i class="i-mdi-image-multiple text-2xl"></i>
                </div>
                <div class="stat-title text-sm">上传壁纸</div>
                <div class="stat-value text-xl font-bold text-primary">
                  {{ userStore.userStats.uploads }}
                </div>
              </div>
              <div
                class="stat place-items-center rounded-box bg-base-100 p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                @click="$router.push('/user/favorites')"
              >
                <div class="stat-figure text-secondary">
                  <i class="i-mdi-star text-2xl"></i>
                </div>
                <div class="stat-title text-sm">我的收藏</div>
                <div class="stat-value text-xl font-bold text-secondary">
                  {{ userStore.userStats.favorites }}
                </div>
              </div>
              <div
                class="stat place-items-center rounded-box bg-base-100 p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                @click="$router.push('/user/likes')"
              >
                <div class="stat-figure text-accent">
                  <i class="i-mdi-heart text-2xl"></i>
                </div>
                <div class="stat-title text-sm">我的点赞</div>
                <div class="stat-value text-xl font-bold text-accent">
                  {{ userStore.userStats.likes }}
                </div>
              </div>
              <div
                class="stat place-items-center rounded-box bg-base-100 p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div class="stat-figure text-info">
                  <i class="i-mdi-heart-outline text-2xl"></i>
                </div>
                <div class="stat-title text-sm">获赞数</div>
                <div class="stat-value text-xl font-bold text-info">
                  {{ userStore.userStats.likesReceived }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <div class="bg-base-100 border-t border-base-200 sticky top-0 z-10">
      <div class="container mx-auto px-4">
        <div class="tabs-boxed tabs overflow-x-auto">
          <router-link
            to="/user/uploads"
            class="tab tab-lg whitespace-nowrap"
            active-class="tab-active"
          >
            <i class="i-mdi-image-multiple text-lg"></i>
            我的上传
          </router-link>
          <router-link
            to="/user/favorites"
            class="tab tab-lg whitespace-nowrap"
            active-class="tab-active"
          >
            <i class="i-mdi-star text-lg"></i>
            我的收藏
          </router-link>
          <router-link
            to="/user/likes"
            class="tab tab-lg whitespace-nowrap"
            active-class="tab-active"
          >
            <i class="i-mdi-heart text-lg"></i>
            我的点赞
          </router-link>
          <router-link
            to="/user/settings"
            class="tab tab-lg whitespace-nowrap"
            active-class="tab-active"
          >
            <i class="i-mdi-cog text-lg"></i>
            账号设置
          </router-link>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="container mx-auto px-4 pb-8 pt-6">
      <!-- 使用子路由显示内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useUserStore } from "@/stores";

const userStore = useUserStore();

// 页面加载时获取用户数据
onMounted(() => {
  fetchUserData();
});

// 获取用户数据
const fetchUserData = async () => {
  try {
    // 获取用户统计数据
    await userStore.fetchUserStats();
    console.log("获取用户中心数据");
  } catch (error) {
    console.error("获取用户数据失败:", error);
  }
};
</script>

<style scoped>
/* 统计卡片悬停效果 */
.stat {
  transition: all 0.3s ease;
}

.stat:hover {
  transform: translateY(-2px);
}

/* 移动端优化 */
@media (max-width: 640px) {
  .stat .stat-value {
    font-size: 1.25rem;
  }

  .stat .stat-title {
    font-size: 0.75rem;
  }
}
</style>
