<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4"
  >
    <div
      class="card flex h-auto w-full max-w-4xl transform flex-col md:flex-row justify-between rounded-2xl border border-white/30 bg-white/95 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:shadow-3xl"
    >
      <div class="mx-auto my-1 w-full md:w-1/2 border-r-0 md:border-r border-gray-400 bg-blue-100 p-8 rounded-l-2xl">
        <!-- 品牌标识 -->
        <div class="mb-8 text-center">
          <div
            class="mx-auto h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg flex"
          >
            <span class="text-3xl font-bold text-white">🎨</span>
          </div>
          <h1
            class="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent"
          >
            随心壁纸
          </h1>
          <p class="text-lg text-gray-600">发现属于你的视觉盛宴</p>
        </div>

        <!-- 切换标签 -->
        <div class="mt-10 md:mt-60 rounded-2xl bg-base-200/30 p-1 backdrop-blur-md">
          <div class="relative flex">
            <!-- 滑动指示器 -->
            <div
              class="absolute top-1 bottom-1 rounded-xl bg-white shadow-lg transition-all duration-500 ease-out"
              :class="{
                'right-1/2 left-1': isLogin,
                'right-1 left-1/2': !isLogin,
              }"
            ></div>

            <button
              :class="[
                'relative z-10 flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300',
                isLogin ? 'text-primary' : 'text-gray-500 hover:text-gray-700',
              ]"
              @click="isLogin = true"
            >
              📱 去登录
            </button>
            <button
              :class="[
                'relative z-10 flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300',
                !isLogin ? 'text-primary' : 'text-gray-500 hover:text-gray-700',
              ]"
              @click="isLogin = false"
            >
              ✨ 去注册
            </button>
          </div>
        </div>
      </div>
      <div class="my-auto w-full md:w-1/2 border-l-0 md:border-l border-white/30 p-8 rounded-r-2xl">
        <!-- 登录表单 -->
        <form
          v-if="isLogin"
          @submit.prevent="handleLogin"
          class="space-y-6 transition-all duration-500 ease-in-out"
        >
          <h2 class="mb-2 text-center text-2xl font-bold text-gray-800">
            <span class="inline-block">👋</span> 欢迎回来
          </h2>
          <p class="mb-6 text-center text-gray-500">请输入您的账号信息</p>

          <div class="form-control">
            <label class="label">
              <span
                class="label-text font-semibold whitespace-nowrap text-gray-700"
              >
                <span class="inline-flex items-center gap-2">
                  <span
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600"
                    >👤</span
                  >
                  账号
                </span>
              </span>
            </label>
            <input
              type="text"
              v-model="loginForm.id"
              placeholder="请输入数字账号"
              class="input-bordered input transition-all duration-300 input-primary hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/50"
              :class="{ 'input-error': loginError }"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span
                class="label-text font-semibold whitespace-nowrap text-gray-700"
              >
                <span class="inline-flex items-center gap-2">
                  <span
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs text-red-600"
                    >🔒</span
                  >
                  密码
                </span>
              </span>
            </label>
            <input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              class="input-bordered input transition-all duration-300 input-primary hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/50"
              :class="{ 'input-error': loginError }"
              required
            />
          </div>

          <button
            type="submit"
            :class="[
              'btn w-full transition-all duration-300 btn-primary hover:btn-secondary',
              { 'btn-disabled loading': loginLoading },
            ]"
            :disabled="loginLoading"
          >
            <span
              v-if="!loginLoading"
              class="flex items-center justify-center gap-2"
            >
              <span class="animate-pulse">🚀</span>
              登录
            </span>
            <span v-else>登录中...</span>
          </button>

          <div
            v-if="loginError"
            class="mt-4 alert alert-error transition-opacity duration-300 shadow-lg"
          >
            <span>❌ {{ loginError }}</span>
          </div>
        </form>

        <!-- 注册表单 -->
        <form
          v-if="!isLogin"
          @submit.prevent="handleRegister"
          class="space-y-4 transition-all duration-500 ease-in-out"
        >
          <h2 class="mb-2 text-center text-2xl font-bold text-gray-800">
            <span class="inline-block animate-bounce">✨</span> 创建账号
          </h2>
          <p class="mb-6 text-center text-gray-500">加入我们，开启视觉之旅</p>

          <div class="form-control">
            <label class="label">
              <span
                class="label-text min-w-[80px] font-semibold whitespace-nowrap text-gray-700"
              >
                <span class="inline-flex items-center gap-2">
                  <span
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600"
                    >👤</span
                  >
                  账号
                </span>
              </span>
              <span class="label-text-alt text-gray-400"> 6位以上数字 </span>
            </label>
            <input
              type="text"
              v-model="registerForm.id"
              @input="registerErrors.id = ''"
              placeholder="请输入数字账号"
              class="input-bordered input transition-all duration-300 input-primary hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:input-primary"
              :class="{ 'input-error': registerErrors.id }"
              required
            />
            <label
              class="label transition-opacity duration-300"
              v-if="registerErrors.id"
            >
              <span class="label-text-alt flex items-center gap-1 text-error">
                <span>⚠️</span>
                {{ registerErrors.id }}
              </span>
            </label>
            <label class="label" v-if="!registerErrors.id && registerForm.id">
              <span class="label-text-alt text-success"> ✅ 账号格式正确 </span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span
                class="label-text min-w-[80px] font-semibold whitespace-nowrap text-gray-700"
              >
                <span class="inline-flex items-center gap-2">
                  <span
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-600"
                    >🌟</span
                  >
                  用户名
                </span>
              </span>
              <span class="label-text-alt text-gray-400">
                2-20位中英文、数字、下划线
              </span>
            </label>
            <input
              type="text"
              v-model="registerForm.username"
              @input="registerErrors.username = ''"
              placeholder="请输入用户名"
              class="input-bordered input transition-all duration-300 input-primary hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:input-primary"
              :class="{ 'input-error': registerErrors.username }"
              required
            />
            <label
              class="label transition-opacity duration-300"
              v-if="registerErrors.username"
            >
              <span class="label-text-alt flex items-center gap-1 text-error">
                <span>⚠️</span>
                {{ registerErrors.username }}
              </span>
            </label>
            <label
              class="label"
              v-if="!registerErrors.username && registerForm.username"
            >
              <span class="label-text-alt text-success">
                ✅ 用户名格式正确
              </span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span
                class="label-text min-w-[80px] font-semibold whitespace-nowrap text-gray-700"
              >
                <span class="inline-flex items-center gap-2">
                  <span
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs text-red-600"
                    >🔒</span
                  >
                  密码
                </span>
              </span>
              <span class="label-text-alt text-gray-400">
                8-20位，包含大小写字母和数字
              </span>
            </label>
            <input
              type="password"
              v-model="registerForm.password"
              @input="registerErrors.password = ''"
              placeholder="请输入密码"
              class="input-bordered input transition-all duration-300 input-primary hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:input-primary"
              :class="{ 'input-error': registerErrors.password }"
              required
            />
            <label
              class="label transition-opacity duration-300"
              v-if="registerErrors.password"
            >
              <span class="label-text-alt flex items-center gap-1 text-error">
                <span>⚠️</span>
                {{ registerErrors.password }}
              </span>
            </label>
            <label
              class="label"
              v-if="
                !registerErrors.password &&
                registerForm.password &&
                registerForm.password.length >= 8 &&
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)
              "
            >
              <span class="label-text-alt text-success"> ✅ 密码强度良好 </span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span
                class="label-text min-w-[80px] font-semibold whitespace-nowrap text-gray-700"
              >
                <span class="inline-flex items-center gap-2">
                  <span
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs text-red-600"
                    >🔒</span
                  >
                  确认密码
                </span>
              </span>
              <span class="label-text-alt text-gray-400">
                请再次输入密码进行确认
              </span>
            </label>
            <input
              type="password"
              v-model="registerForm.confirmPassword"
              @input="registerErrors.confirmPassword = ''"
              placeholder="请再次输入密码"
              class="input-bordered input transition-all duration-300 input-primary hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:input-primary"
              :class="{ 'input-error': registerErrors.confirmPassword }"
              required
            />
            <label
              class="label transition-opacity duration-300"
              v-if="registerErrors.confirmPassword"
            >
              <span class="label-text-alt flex items-center gap-1 text-error">
                <span>⚠️</span>
                {{ registerErrors.confirmPassword }}
              </span>
            </label>
            <label
              class="label"
              v-if="
                !registerErrors.confirmPassword &&
                registerForm.confirmPassword &&
                registerForm.password === registerForm.confirmPassword
              "
            >
              <span class="label-text-alt text-success"> ✅ 密码匹配成功 </span>
            </label>
          </div>

          <button
            type="submit"
            :class="[
              'btn w-full transition-all duration-300 btn-primary hover:btn-secondary',
              { 'btn-disabled loading': registerLoading },
            ]"
            :disabled="registerLoading"
          >
            <span
              v-if="!registerLoading"
              class="flex items-center justify-center gap-2"
            >
              <span class="animate-pulse">✨</span>
              注册
            </span>
            <span v-else>注册中...</span>
          </button>

          <div
            v-if="registerError"
            class="mt-4 alert animate-bounce alert-error transition-opacity duration-300 shadow-lg"
          >
            <span>❌ {{ registerError }}</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore, type RegisterDto } from "@/stores";

const router = useRouter();
const userStore = useUserStore();

// 登录/注册切换 - 根据当前路由决定初始状态
const isLogin = ref(router.currentRoute.value.name === "Login");

// 监听路由变化，确保切换时表单状态正确
router.afterEach((to) => {
  if (to.name === "Login" || to.name === "Register") {
    isLogin.value = to.name === "Login";
    // 清空错误信息
    loginError.value = "";
    registerError.value = "";
  }
});

// 登录表单
const loginForm = reactive({
  id: "",
  password: "",
});
const loginLoading = ref(false);
const loginError = ref("");

// 注册表单
const registerForm = reactive({
  id: undefined as number | undefined,
  username: "",
  password: "",
  confirmPassword: "",
});
const registerErrors = reactive({
  id: "",
  username: "",
  password: "",
  confirmPassword: "",
});
const registerLoading = ref(false);
const registerError = ref("");

// 登录处理
const handleLogin = async () => {
  loginError.value = "";
  loginLoading.value = true;

  try {
    const res = await userStore.login({
      ...loginForm,
      id: Number(loginForm.id),
    });
    console.log("登录成功", res);
    router.push("/");
  } catch (error: any) {
    console.error("登录失败:", error);
    loginError.value = error.message || "登录失败，请重试";
  } finally {
    loginLoading.value = false;
  }
};

// 注册验证
const validateRegister = (): boolean => {
  let isValid = true;

  // 重置错误信息
  registerErrors.id = "";
  registerErrors.username = "";
  registerErrors.password = "";
  registerErrors.confirmPassword = "";

  // 账号验证
  if (!registerForm.id) {
    registerErrors.id = "请输入账号";
    isValid = false;
  } else if (registerForm.id.toString().length < 6) {
    registerErrors.id = "账号长度至少6位";
    isValid = false;
  }

  // 用户名验证
  if (!registerForm.username.trim()) {
    registerErrors.username = "请输入用户名";
    isValid = false;
  } else if (registerForm.username.trim().length < 2) {
    registerErrors.username = "用户名至少2个字符";
    isValid = false;
  } else if (registerForm.username.trim().length > 20) {
    registerErrors.username = "用户名不能超过20个字符";
    isValid = false;
  } else if (
    !/^[\u4e00-\u9fa5a-zA-Z0-9_\-]+$/.test(registerForm.username.trim())
  ) {
    registerErrors.username = "用户名只能包含中文、英文、数字、下划线和减号";
    isValid = false;
  }

  // 密码验证
  if (!registerForm.password) {
    registerErrors.password = "请输入密码";
    isValid = false;
  } else if (registerForm.password.length < 6) {
    registerErrors.password = "密码至少6位";
    isValid = false;
  } else if (registerForm.password.length > 20) {
    registerErrors.password = "密码不能超过20位";
    isValid = false;
  }

  // 确认密码验证
  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = "请确认密码";
    isValid = false;
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = "两次输入的密码不一致";
    isValid = false;
  }

  return isValid;
};

// 注册处理
const handleRegister = async () => {
  if (!validateRegister()) return;

  registerError.value = "";
  registerLoading.value = true;

  try {
    const registerData: RegisterDto = {
      id: Number(registerForm.id),
      username: registerForm.username.trim(),
      password: registerForm.password,
    };

    const res = await userStore.register(registerData);
    console.log("注册成功", res);

    // 注册成功后自动切换到登录页
    isLogin.value = true;
    // 清空注册表单
    Object.assign(registerForm, {
      id: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  } catch (error: any) {
    console.error("注册失败:", error);
    registerError.value = error.response?.data?.message || "注册失败，请重试";
  } finally {
    registerLoading.value = false;
  }
};
</script>

<style scoped>
/* 自定义卡片悬停效果 */
.card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-2px);
}
</style>
