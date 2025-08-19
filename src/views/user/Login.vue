<template>
  <div>登录页</div>
  <input type="number" placeholder="账号" v-model="form.id" />
  <input type="password" placeholder="密码" v-model="form.password" />
  <button @click="submit">登录</button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "@/stores";
const form = ref({
  id: "",
  password: "",
});
const userStore = useUserStore();
const submit = async () => {
  console.log("提交登录信息", form.value);
  try {
    const res = await userStore.login({
      ...form.value,
      id: Number(form.value.id),
    });
    console.log("登录成功", res.data);
    console.log("用户信息", userStore.user);
    // 登录成功后可以跳转到首页或其他页面
    // router.push("/");
  } catch (err) {
    console.error("登录失败:", err);
  }
};
</script>

<style lang="scss" scoped></style>
