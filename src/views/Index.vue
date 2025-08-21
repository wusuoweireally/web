<template>
  <div
    class="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
  >
    <!-- 头部导航栏 -->
    <nav
      class="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-md backdrop-blur-md"
    >
      <div class="max-w-8xl py-auto mx-auto">
        <div class="flex h-16 justify-between">
          <!-- Logo 和品牌 -->
          <div class="ml-8 flex items-center">
            <div class="flex-shrink-0">
              <span
                class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent"
              >
                随心壁纸
              </span>
            </div>
          </div>

          <!-- 导航菜单 -->
          <div class="hidden items-center space-x-4 md:flex">
            <template v-for="item in navItems" :key="item.name">
              <router-link
                :to="item.to"
                class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                active-class="bg-blue-100 text-blue-700"
              >
                {{ item.name }}
              </router-link>
            </template>
          </div>

          <!-- 用户操作区域 -->
          <div class="flex items-center" style="margin-right: 20px">
            <!-- 未登录状态 -->
            <template v-if="!isLoggedIn">
              <router-link
                to="/auth/login"
                class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                登录
              </router-link>
              <router-link
                to="/auth/register"
                class="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-md"
              >
                注册
              </router-link>
            </template>

            <!-- 已登录状态 -->
            <template v-else>
              <div class="group relative">
                <!-- 用户头像按钮 -->
                <button
                  class="m-0 flex items-center space-x-2 rounded-full p-1 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-red-100 focus:outline-none"
                  @click="toggleDropdown"
                >
                  <img
                    :src="userAvatar"
                    :alt="user?.username || '用户'"
                    class="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                  />
                  <span
                    class="hidden text-sm font-medium text-gray-700 sm:block"
                  >
                    {{ user?.username }}
                  </span>
                  <svg
                    class="h-4 w-4 text-gray-400 transition-transform duration-200"
                    :class="{ 'rotate-180': showDropdown }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <!-- 下拉菜单 -->
                <div
                  v-if="showDropdown"
                  class="ring-opacity-5 absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black focus:outline-none"
                  role="menu"
                >
                  <router-link
                    to="/user/center"
                    class="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    role="menuitem"
                    @click="showDropdown = false"
                  >
                    👤 个人中心
                  </router-link>
                  <router-link
                    to="/user/settings"
                    class="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    role="menuitem"
                    @click="showDropdown = false"
                  >
                    ⚙️ 账号设置
                  </router-link>
                  <router-link
                    to="/upload"
                    class="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    role="menuitem"
                    @click="showDropdown = false"
                  >
                    📤 上传壁纸
                  </router-link>
                  <div class="border-t border-gray-100"></div>
                  <button
                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    role="menuitem"
                    @click="handleLogout"
                  >
                    🚪 退出登录
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </nav>
    <!-- 壁纸图片网格 -->
    <div class="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="(paper, index) in papers"
        :key="index"
        class="aspect-[9/14] overflow-hidden rounded-3xl shadow-lg transition-transform hover:scale-101"
      >
        <img
          :src="paper"
          :alt="`随机壁纸 ${index + 1}`"
          class="h-full w-full object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useUserStore } from "@/stores/index";
import api from "@/config/api";

const userStore = useUserStore();
const showDropdown = ref(false);
const papers = ref<string[]>([]);

// 计算属性
const isLoggedIn = computed(() => userStore.isLoggedIn);
const user = computed(() => userStore.user);
const userAvatar = computed(() => userStore.userAvatar);

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

// 切换下拉菜单
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// 关闭下拉菜单（点击外部）
const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative.group")) {
    showDropdown.value = false;
  }
};

// 退出登录
const handleLogout = async () => {
  try {
    await userStore.logout();
    showDropdown.value = false;
    // 可以添加退出成功后的跳转逻辑
  } catch (error) {
    console.error("退出登录失败:", error);
  }
};

const fetchRandomPapers = async () => {
  try {
    for (let i = 0; i < 2; i++) {
      try {
        const response: any = await api.get("/papers/random");
        if (response.code === 200) {
          papers.value.push(response.url);
        } else {
          console.warn(`请求 ${i + 1} 失败，状态码: ${response.code}`);
        }
      } catch (error) {
        console.warn(`请求 ${i + 1} 异常:`, error);
      }
    }
    console.log("获取壁纸成功，共获取:", papers.value.length, "张");
  } catch (error) {
    console.error("获取壁纸失败:", error);
  }
};

onMounted(() => {
  fetchRandomPapers();

  // 添加全局点击事件监听，点击外部关闭下拉菜单
  document.addEventListener("click", closeDropdown);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>
