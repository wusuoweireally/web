<template>
  <div class="item-center m-auto flex h-100 w-100 flex-col justify-center p-4">
    <h1 class="text-center text-2xl font-bold">注册新用户</h1>
    <input
      type="text"
      v-model="form.id"
      placeholder="账号"
      class="input my-2 h-10 w-full max-w-xs"
    />
    <input
      type="text"
      v-model="form.username"
      placeholder="用户名"
      class="input my-2 h-10 w-full max-w-xs"
    />

    <input
      type="email"
      v-model="form.email"
      placeholder="邮箱"
      class="input my-2 h-10 w-full max-w-xs"
    />
    <input
      type="password"
      v-model="form.password"
      placeholder="密码"
      class="input my-2 h-10 w-full max-w-xs"
    />
    <input
      :type="'password'"
      v-model="form.confirm"
      placeholder="确认密码"
      class="input my-2 h-10 w-full max-w-xs"
    />

    <div class="my-2">
      <label for="avatar" class="btn btn-secondary">上传头像</label>
      <input
        id="avatar"
        type="file"
        accept="image/*"
        @change="onFileChange"
        class="hidden"
      />
    </div>
  </div>
  <div class="flex justify-center">
    <button class="btn btn-primary" :disabled="loading" @click="submit">
      {{ loading ? "注册中..." : "注册" }}
    </button>
    <button class="btn" @click="goLogin">已有账号？登录</button>
  </div>

  <div v-if="serverError" class="mt-2 text-red-500">
    {{ serverError }}
  </div>

  <div v-if="errors.id" class="mt-2 text-red-500">
    {{ errors.id }}
  </div>
  <div v-if="errors.username" class="mt-2 text-red-500">
    {{ errors.username }}
  </div>
  <div v-if="errors.email" class="mt-2 text-red-500">
    {{ errors.email }}
  </div>
  <div v-if="errors.password" class="mt-2 text-red-500">
    {{ errors.password }}
  </div>
  <div v-if="errors.confirm" class="mt-2 text-red-500">
    {{ errors.confirm }}
  </div>

  <img
    v-if="preview"
    :src="preview"
    alt="头像预览"
    class="mt-4 h-32 w-32 rounded-lg object-cover"
  />
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores";
const router = useRouter();
const userStore = useUserStore();
const form = reactive({
  id: "",
  username: "",
  email: "",
  password: "",
  confirm: "", // 仅用于前端验证
});

const preview = ref<string | null>(null);
const avatarFile = ref<File | null>(null);
const loading = ref(false);
const serverError = ref("");
const errors = reactive<{ [k: string]: string | null }>({
  id: null,
  username: null,
  email: null,
  password: null,
  confirm: null,
});

function resetErrors() {
  Object.keys(errors).forEach((k) => (errors[k] = null));
  serverError.value = "";
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files && input.files[0];
  avatarFile.value = file || null;
  if (file) {
    const reader = new FileReader();
    reader.onload = () => (preview.value = String(reader.result));
    reader.readAsDataURL(file);
  } else {
    preview.value = null;
  }
}

function validate() {
  resetErrors();
  let ok = true;

  if (!form.id) {
    errors.id = "请输入用户ID";
    ok = false;
  }

  if (!form.username || form.username.length < 2) {
    errors.username = "用户名至少 2 个字符";
    ok = false;
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRe.test(form.email)) {
    errors.email = "请输入有效的邮箱地址";
    ok = false;
  }
  if (!form.password || form.password.length < 8) {
    errors.password = "密码至少 8 位";
    ok = false;
  }
  if (form.password !== form.confirm) {
    errors.confirm = "两次输入的密码不一致";
    ok = false;
  }

  return ok;
}

async function submit() {
  if (loading.value) return;
  if (!validate()) return;

  loading.value = true;
  serverError.value = "";

  try {
    // 只发送后端需要的字段，确保 id 是字符串
    const registerData = {
      id: String(form.id).trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    };

    const res = await userStore.register(registerData);
    console.log("注册成功", res.data);

    // 成功后跳转到登录页
    router.push({ path: "/auth/login" });
  } catch (err: any) {
    console.error("注册失败:", err);

    // 处理错误信息
    if (err?.response?.data?.message) {
      if (Array.isArray(err.response.data.message)) {
        serverError.value = err.response.data.message.join(", ");
      } else {
        serverError.value = err.response.data.message;
      }
    } else {
      serverError.value = err?.message || "注册失败，请重试";
    }
  } finally {
    loading.value = false;
  }
}

function goLogin() {
  router.push({ path: "/auth/login" });
}
</script>
