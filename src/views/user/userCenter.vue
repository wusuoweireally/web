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

        <div class="flex items-center gap-6">
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
          <div class="flex-1">
            <h1 class="text-3xl font-bold">{{ userStore.user?.username }}</h1>
            <p class="text-gray-500">{{ userStore.user?.email }}</p>
            <div class="mt-2 flex gap-4">
              <div class="stat">
                <div class="stat-title">上传壁纸</div>
                <div class="stat-value text-primary">
                  {{ userStats.uploads }}
                </div>
              </div>
              <div class="stat">
                <div class="stat-title">获赞数</div>
                <div class="stat-value text-secondary">
                  {{ userStats.likesReceived }}
                </div>
              </div>
              <div class="stat">
                <div class="stat-title">收藏数</div>
                <div class="stat-value text-accent">
                  {{ userStats.favorites }}
                </div>
              </div>
            </div>
          </div>

          <!-- 编辑资料按钮 -->
          <button
            class="btn btn-outline btn-primary"
            @click="$router.push('/user/profile')"
          >
            <i class="i-mdi-account-edit text-lg"></i>
            编辑资料
          </button>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <div class="container mx-auto px-4 py-6">
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

    <!-- 内容区域 -->
    <div class="container mx-auto px-4 pb-8">
      <!-- 使用子路由显示内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores";
import api from "@/config/api";

const userStore = useUserStore();

// 用户统计数据
const userStats = ref({
  uploads: 12,
  likesReceived: 256,
  favorites: 89,
});

// 随机壁纸
const randomPapers = ref<string[]>([]);

// 页面加载时获取用户数据和随机壁纸
onMounted(() => {
  fetchUserData();
  fetchRandomPapers();
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

// 获取随机壁纸
const fetchRandomPapers = async () => {
  try {
    for (let i = 0; i < 8; i++) {
      try {
        const response: any = await api.get("/papers/random");
        if (response.success && response.data) {
          randomPapers.value.push(response.data);
        } else {
          console.warn(`请求 ${i + 1} 失败，状态码: ${response.code}`);
          // 添加默认壁纸作为备用
          randomPapers.value.push("/api/images/wallpapers/default.jpg");
        }
      } catch (error) {
        console.warn(`请求 ${i + 1} 异常:`, error);
        // 添加默认壁纸作为备用
        randomPapers.value.push("/api/images/wallpapers/default.jpg");
      }
    }
    console.log("获取随机壁纸成功，共获取:", randomPapers.value.length, "张");
  } catch (error) {
    console.error("获取随机壁纸失败:", error);
    // 添加一些默认壁纸
    for (let i = 0; i < 8; i++) {
      randomPapers.value.push(
        `/api/images/wallpapers/default${(i % 4) + 1}.jpg`,
      );
    }
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
@media (max-width: 768px) {
  .avatar {
    width: 16px;
    height: 16px;
  }

  .stat {
    padding: 0.5rem;
  }

  .stat .stat-value {
    font-size: 1.25rem;
  }

  .stat .stat-title {
    font-size: 0.75rem;
  }
}
</style>
