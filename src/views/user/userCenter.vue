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
        <div
          class="flex flex-col items-center gap-6 md:flex-row md:items-start"
        >
          <!-- 用户头像 -->
          <div class="avatar">
            <div
              class="h-24 w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100"
            >
              <img
                :src="userStore.userAvatar"
                :alt="userStore.user?.username"
              />
            </div>
          </div>

          <!-- 用户信息 -->
          <div class="w-full flex-1">
            <h1 class="text-3xl font-bold">{{ userStore.user?.username }}</h1>
            <p class="text-gray-500">{{ userStore.user?.email }}</p>

            <!-- 响应式统计信息网格 -->
            <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div
                class="stat place-items-center rounded-box bg-base-100 p-4 shadow-md"
              >
                <div class="stat-figure text-primary">
                  <i class="i-mdi-image-multiple text-3xl"></i>
                </div>
                <div class="stat-title text-sm">上传壁纸</div>
                <div class="stat-value text-2xl font-bold text-primary">
                  {{ userStats.uploads }}
                </div>
              </div>
              <div
                class="stat place-items-center rounded-box bg-base-100 p-4 shadow-md"
              >
                <div class="stat-figure text-secondary">
                  <i class="i-mdi-heart text-3xl"></i>
                </div>
                <div class="stat-title text-sm">获赞数</div>
                <div class="stat-value text-2xl font-bold text-secondary">
                  {{ userStats.likesReceived }}
                </div>
              </div>
              <div
                class="stat place-items-center rounded-box bg-base-100 p-4 shadow-md"
              >
                <div class="stat-figure text-accent">
                  <i class="i-mdi-star text-3xl"></i>
                </div>
                <div class="stat-title text-sm">收藏数</div>
                <div class="stat-value text-2xl font-bold text-accent">
                  {{ userStats.favorites }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <div class="bg-base-100 border-t border-base-200">
      <div class="container mx-auto px-4">
        <div class="tabs-boxed tabs">
          <router-link to="/user/uploads" class="tab" active-class="tab-active">
            <i class="i-mdi-image-multiple text-lg"></i>
            我的上传
          </router-link>
          <router-link to="/user/favorites" class="tab" active-class="tab-active">
            <i class="i-mdi-star text-lg"></i>
            我的收藏
          </router-link>
          <router-link to="/user/likes" class="tab" active-class="tab-active">
            <i class="i-mdi-heart text-lg"></i>
            我的点赞
          </router-link>
          <router-link to="/user/settings" class="tab" active-class="tab-active">
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
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores";

const userStore = useUserStore();

// 用户统计数据
const userStats = ref({
  uploads: 12,
  likesReceived: 256,
  favorites: 89,
});

// 页面加载时获取用户数据
onMounted(() => {
  fetchUserData();
});

// 获取用户数据
const fetchUserData = async () => {
  try {
    // 这里应该调用API获取用户统计数据
    // const statsResponse = await api.get('/user/stats')
    // userStats.value = statsResponse.data

    console.log("获取用户中心数据");
  } catch (error) {
    console.error("获取用户数据失败:", error);
  }
};
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}

/* 卡片悬停效果 */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

/* 响应式调整 */
/* 更细致的响应式处理 */
@media (max-width: 576px) {
  .avatar .h-24 {
    height: 6rem;
    width: 6rem;
  }

  .stat {
    padding: 0.75rem;
  }

  .stat .stat-value {
    font-size: 1.5rem;
  }

  .stat .stat-title {
    font-size: 0.875rem;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .avatar .h-24 {
    height: 8rem;
    width: 8rem;
  }
}

@media (min-width: 769px) {
  /* 默认样式保持不变 */
}
</style>
