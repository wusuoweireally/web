import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import "./types"; // 导入路由类型扩展

// 路由配置
const routes: RouteRecordRaw[] = [
  // 首页
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Index.vue"),
    meta: {
      title: "随心壁纸 - 首页",
      requiresAuth: false,
    },
  },

  // 壁纸相关路由
  {
    path: "/wallpapers",
    name: "WallpaperViews",
    component: () => import("../views/wallpaper/wallpaperViews.vue"),
    meta: {
      title: "壁纸浏览",
      requiresAuth: false,
    },
  },
  {
    path: "/wallpaper/:id",
    name: "WallpaperDetail",
    component: () => import("../views/wallpaper/wallpaperDetail.vue"),
    meta: {
      title: "壁纸详情",
      requiresAuth: false,
    },
  },
  {
    path: "/upload",
    name: "WallpaperUpload",
    component: () => import("../views/wallpaper/uploads.vue"),
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
        component: () => import("../views/user/Login.vue"),
        meta: {
          title: "用户登录",
          requiresAuth: false,
          hideForAuth: true, // 已登录用户隐藏
        },
      },
      {
        path: "register",
        name: "Register",
        component: () => import("../views/user/Register.vue"),
        meta: {
          title: "用户注册",
          requiresAuth: false,
          hideForAuth: true,
        },
      },
    ],
  },
  {
    path: "/user",
    name: "UserCenter",
    component: () => import("../views/user/userCenter.vue"),
    meta: {
      title: "个人中心",
      requiresAuth: true,
    },
  },

  // 论坛相关路由
  {
    path: "/forums",
    name: "Forums",
    component: () => import("../views/forums/index.vue"),
    meta: {
      title: "社区论坛",
      requiresAuth: false,
    },
  },

  // 分类浏览
  {
    path: "/category/:category",
    name: "Category",
    component: () => import("../views/wallpaper/wallpaperViews.vue"),
    meta: {
      title: "分类浏览",
      requiresAuth: false,
    },
  },

  // 搜索结果
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/wallpaper/wallpaperViews.vue"),
    meta: {
      title: "搜索结果",
      requiresAuth: false,
    },
  },

  // 收藏夹
  {
    path: "/favorites",
    name: "Favorites",
    component: () => import("../views/wallpaper/wallpaperViews.vue"),
    meta: {
      title: "我的收藏",
      requiresAuth: true,
    },
  },

  // 404 页面
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
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
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  // 检查登录状态
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // 需要登录的路由
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({
      name: "Login",
      query: { redirect: to.fullPath }, // 保存重定向路径
    });
    return;
  }

  // 已登录用户访问登录/注册页面，重定向到首页
  if (to.meta.hideForAuth && isLoggedIn) {
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
