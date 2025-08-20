import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { useUserStore } from "./stores/index";
import { createPinia } from "pinia";

import "./style.css";
const app = createApp(App);
const pinia = createPinia();

// 先注册 Pinia
app.use(pinia);

// 在挂载前初始化用户状态
const userStore = useUserStore();
userStore.initializeAuth();

app.use(router);
app.mount("#app");
