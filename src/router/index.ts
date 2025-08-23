import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import "./types"; // 导入路由类型扩展
import { useUserStore } from "@/stores";

// 路由配置
const routes: RouteRecordRaw[] = [
  // 首页
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Index.vue"),
    meta: {
      title: "随心壁纸 - 首页",
      requiresAuth: false,
    },
  },

  // 壁纸浏览路由 - 统一使用 wallpaperViews 组件
  {
    path: "/latest",
    name: "LatestWallpapers",
    component: () => import("@/views/wallpaper/wallpaperViews.vue"),
    meta: {
      title: "最新壁纸",
      requiresAuth: false,
    },
  },
  {
    path: "/top",
    name: "TopWallpapers",
    component: () => import("@/views/wallpaper/wallpaperViews.vue"),
    meta: {
      title: "排行榜",
      requiresAuth: false,
    },
  },
  {
    path: "/random",
    name: "RandomWallpapers",
    component: () => import("@/views/wallpaper/wallpaperViews.vue"),
    meta: {
      title: "随机壁纸",
      requiresAuth: false,
    },
  },
  {
    path: "/wallpaper/:id",
    name: "WallpaperDetail",
    component: () => import("@/views/wallpaper/wallpaperDetail.vue"),
    meta: {
      title: "壁纸详情",
      requiresAuth: false,
    },
  },
  {
    path: "/upload",
    name: "WallpaperUpload",
    component: () => import("@/views/wallpaper/uploads.vue"),
    meta: {
      title: "上传壁纸",
      requiresAuth: true,
    },
  },

  // 用户相关路由
  {
    path: "/auth",
    name: "Auth",
    redirect: "/auth/login",
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/user/Auth.vue"),
        meta: {
          title: "用户登录",
          requiresAuth: false,
          hideForAuth: true, // 已登录用户隐藏
        },
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/user/Auth.vue"),
        meta: {
          title: "用户注册",
          requiresAuth: false,
          hideForAuth: true,
        },
      },
    ],
  },

  // 用户中心路由
  {
    path: "/user",
    name: "UserCenter",
    redirect: "/user/profile",
    component: () => import("@/views/user/userCenter.vue"),
    meta: {
      title: "个人中心",
      requiresAuth: true,
    },
    children: [
      {
        path: "profile",
        name: "UserProfile",
        component: () => import("@/views/user/components/UserProfile.vue"),
        meta: {
          title: "个人资料",
          requiresAuth: true,
        },
      },
      {
        path: "settings",
        name: "UserSettings",
        component: () => import("@/views/user/components/UserSettings.vue"),
        meta: {
          title: "账号设置",
          requiresAuth: true,
        },
      },
      {
        path: "uploads",
        name: "UserUploads",
        component: () => import("@/views/user/components/UserUploads.vue"),
        meta: {
          title: "我的上传",
          requiresAuth: true,
        },
      },
      {
        path: "favorites",
        name: "UserFavorites",
        component: () => import("@/views/user/components/UserFavorites.vue"),
        meta: {
          title: "我的收藏",
          requiresAuth: true,
        },
      },
      {
        path: "likes",
        name: "UserLikes",
        component: () => import("@/views/user/components/UserLikes.vue"),
        meta: {
          title: "我的点赞",
          requiresAuth: true,
        },
      },
    ],
  },

  // 论坛相关路由
  {
    path: "/forums",
    name: "Forums",
    component: () => import("@/views/forums/index.vue"),
    meta: {
      title: "社区论坛",
      requiresAuth: false,
    },
  },
  {
    path: "/forum/new",
    name: "ForumNewPost",
    component: () => import("@/views/forums/NewPost.vue"),
    meta: {
      title: "发布新帖",
      requiresAuth: true,
    },
  },
  {
    path: "/forum/post/:id",
    name: "ForumPostDetail",
    component: () => import("@/views/forums/PostDetail.vue"),
    meta: {
      title: "帖子详情",
      requiresAuth: false,
    },
  },
  {
    path: "/forum/post/:id/edit",
    name: "ForumPostEdit",
    component: () => import("@/views/forums/EditPost.vue"),
    meta: {
      title: "编辑帖子",
      requiresAuth: true,
    },
  },

  // 测试上传页面
  {
    path: "/test-upload",
    name: "TestUpload",
    component: () => import("@/views/test-upload.vue"),
    meta: {
      title: "测试上传",
      requiresAuth: false,
    },
  },

  // 404 页面
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      title: "页面未找到",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 路由滚动行为
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  // 检查登录状态 - 使用Pinia store中的用户状态来判断登录状态
  const userStore = useUserStore();
  const isLoggedIn = userStore.isLoggedIn;

  // 需要登录的路由
  if (to.meta.requiresAuth && !isLoggedIn) {
    // 避免在登录页之间无限重定向
    if (to.name === "Login" || to.name === "Register") {
      next();
      return;
    }

    next({
      name: "Login",
      query: { redirect: to.fullPath }, // 保存重定向路径
    });
    return;
  }

  // 已登录用户访问登录/注册页面，重定向到首页
  if (to.meta.hideForAuth && isLoggedIn) {
    // 避免在首页之间无限重定向
    if (to.name === "Home") {
      next();
      return;
    }

    next({ name: "Home" });
    return;
  }

  next();
});

// 路由错误处理
router.onError((error) => {
  console.error("路由错误:", error);
});

export default router;
