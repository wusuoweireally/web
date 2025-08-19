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

app.use(router);
router.afterEach((to) => {
  document.title = to.meta && to.meta.title ? to.meta.title : "默认标题";
});
app.mount("#app");
const userStore = useUserStore();
userStore.initializeAuth();
