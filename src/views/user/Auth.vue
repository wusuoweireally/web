<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4"
  >
    <div class="relative w-full max-w-6xl">
      <div
        class="relative grid gap-0 overflow-hidden rounded-[32px] border border-purple-100/60 bg-white/95 shadow-2xl backdrop-blur-[60px] md:grid-cols-2"
      >
        <div
          class="relative flex flex-col items-center justify-center gap-10 overflow-hidden bg-gradient-to-br from-purple-700 via-purple-500 to-sky-500 p-8 text-white sm:p-12"
        >
          <div class="relative text-center">
            <div
              class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/30 bg-white/15 shadow-2xl backdrop-blur-2xl"
            >
              <svg class="h-14 w-14 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12c0 .64.1 1.26.27 1.85l6.73-6.73L12 2zM21 12c0-.64-.1-1.26-.27-1.85l-6.73 6.73 6.73 6.73c.17-.59.27-1.21.27-1.85zM8.88 2.46L2.15 9.19c.59-.17 1.21-.27 1.85-.27 4.41 0 8 3.59 8 8 0 .64-.1 1.26-.27 1.85l6.73-6.73L8.88 2.46z"
                />
                <circle cx="7" cy="17" r="2.5" fill="#FF6B6B" />
                <circle cx="17" cy="7" r="2.5" fill="#4ECDC4" />
                <circle cx="17" cy="17" r="2.5" fill="#FFE66D" />
                <circle cx="7" cy="7" r="2.5" fill="#95E1D3" />
              </svg>
            </div>
            <h1 class="text-4xl font-bold drop-shadow-lg">随心壁纸</h1>
            <p class="mt-3 text-xl font-medium text-white/90">发现属于你的视觉盛宴</p>
          </div>
        </div>

        <div class="relative bg-white">
          <div class="pointer-events-none absolute inset-0">
            <div class="pattern-grid-sm absolute inset-0 opacity-30"></div>
            <div class="gradient-blob gradient-blob--one"></div>
            <div class="gradient-blob gradient-blob--two"></div>
          </div>

          <div class="relative space-y-8 p-6 sm:p-10 md:p-12">
            <div class="flex flex-col gap-2 text-center md:text-left">
              <p class="text-xs font-semibold uppercase tracking-[0.35em] text-purple-500/80">
                WALLPAPER MUSE
              </p>
              <h2 class="text-3xl font-extrabold text-gray-900 md:text-4xl">{{ formTitle }}</h2>
            </div>

            <div
              class="relative flex items-center rounded-full border border-gray-200 bg-gray-100/80 p-1"
            >
              <span :class="['tab-pill', { 'tab-pill--register': !isLogin }]"></span>
              <button
                type="button"
                class="tab-btn"
                :class="{ 'tab-btn--active': isLogin }"
                :aria-pressed="isLogin"
                @click="switchForm('login')"
              >
                登录
              </button>
              <button
                type="button"
                class="tab-btn"
                :class="{ 'tab-btn--active': !isLogin }"
                :aria-pressed="!isLogin"
                @click="switchForm('register')"
              >
                注册
              </button>
            </div>

            <Transition name="fade-slide" mode="out-in">
              <form v-if="isLogin" key="login" @submit.prevent="handleLogin" class="space-y-5">
                <div class="space-y-3">
                  <label class="text-sm font-semibold text-gray-600">账号</label>
                  <div class="relative">
                    <span class="field-icon">
                      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      v-model="loginForm.id"
                      placeholder="请输入数字账号"
                      class="enhanced-input"
                      :class="{ 'enhanced-input--error': loginError }"
                      required
                    />
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="text-sm font-semibold text-gray-600">密码</label>
                  <div class="relative">
                    <span class="field-icon">
                      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                        />
                      </svg>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      v-model="loginForm.password"
                      placeholder="请输入密码"
                      class="enhanced-input pr-14"
                      :class="{ 'enhanced-input--error': loginError }"
                      required
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-purple-600"
                      aria-label="切换密码显示"
                    >
                      <svg
                        v-if="showPassword"
                        class="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zm-2 4.82c.36-.57.6-1.22.6-1.82 0-1.39-1.16-2.58-2.6-2.78l2.01 4.6zm3.6 5.76l-1.07-1.07-7.49 7.49C5.61 20.38 3 17.5 3 14c0-4.28 6.06-8.52 13.47-9.09L21 9.5C16.64 10.06 13 12.88 13 17c0 .91.13 1.79.33 2.63l1.27 1.27z"
                        />
                      </svg>
                      <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-3.459 0-6-2.382-6-5.26 0-2.879 2.541-5.26 6-5.26 3.458 0 6 2.381 6 5.26 0 2.878-2.542 5.26-6 5.26z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-3">
                  <label class="flex cursor-pointer items-center gap-3 text-sm text-gray-600">
                    <input type="checkbox" v-model="rememberMe" class="peer sr-only" />
                    <span
                      class="flex h-5 w-5 items-center justify-center rounded-md border-2 border-gray-200 transition-all duration-200 peer-checked:border-transparent peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-blue-500"
                    >
                      <svg
                        v-if="rememberMe"
                        class="h-3.5 w-3.5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </span>
                    记住我
                  </label>
                  <a
                    href="#"
                    class="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
                    >忘记密码？</a
                  >
                </div>

                <button
                  type="submit"
                  :class="[
                    'flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-bold text-white shadow-xl transition-all duration-300',
                    'bg-gradient-to-r from-purple-600 to-blue-500 hover:-translate-y-1 hover:from-purple-700 hover:to-blue-600',
                    { 'cursor-not-allowed opacity-70 saturate-50': loginLoading },
                  ]"
                  :disabled="loginLoading"
                >
                  <span v-if="!loginLoading" class="flex items-center gap-3">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 2l2.09 6.26L20 9l-5.91 1.74L12 16l-2.09-5.26L4 9l5.91-1.74L12 2z"
                      />
                      <path d="M19 10l-2 6-2-6 2-2 2 2zM7 8l2 6-2-6-2 6-2-6 2-2 2 2z" />
                    </svg>
                    立即登录
                  </span>
                  <span v-else class="flex items-center gap-2">
                    <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    登录中...
                  </span>
                </button>

                <div class="text-center text-sm text-gray-600">
                  还没有账号？
                  <button
                    type="button"
                    class="font-semibold text-purple-600 hover:text-purple-700"
                    @click="switchForm('register')"
                  >
                    立即注册
                  </button>
                </div>

                <div v-if="loginError" class="glass-error" role="alert">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                    />
                  </svg>
                  <span>{{ loginError }}</span>
                </div>
              </form>

              <form v-else key="register" @submit.prevent="handleRegister" class="space-y-4">
                <div class="space-y-3">
                  <label class="text-sm font-semibold text-gray-600">账号</label>
                  <div class="relative">
                    <span class="field-icon">
                      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      v-model="registerForm.id"
                      @input="registerErrors.id = ''"
                      placeholder="请输入数字账号 (6位以上)"
                      class="enhanced-input"
                      :class="{ 'enhanced-input--error': registerErrors.id }"
                      required
                    />
                  </div>
                  <p v-if="registerErrors.id" class="text-sm text-red-500">
                    {{ registerErrors.id }}
                  </p>
                </div>

                <div class="space-y-3">
                  <label class="text-sm font-semibold text-gray-600">用户名</label>
                  <div class="relative">
                    <span class="field-icon">
                      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M12 12c2.7 0 4.93-2.2 4.93-4.9 0-2.7-2.22-4.88-4.93-4.88S7.07 4.4 7.07 7.1C7.07 9.8 9.3 12 12 12zm0 2c-3.42 0-10.2 1.72-10.2 5.15V22h20.4v-2.85C22.2 15.72 15.42 14 12 14z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      v-model="registerForm.username"
                      @input="registerErrors.username = ''"
                      placeholder="请输入用户名"
                      class="enhanced-input"
                      :class="{ 'enhanced-input--error': registerErrors.username }"
                      required
                    />
                  </div>
                  <p v-if="registerErrors.username" class="text-sm text-red-500">
                    {{ registerErrors.username }}
                  </p>
                </div>

                <div class="space-y-3">
                  <label class="text-sm font-semibold text-gray-600">设置密码</label>
                  <div class="relative">
                    <span class="field-icon">
                      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                        />
                      </svg>
                    </span>
                    <input
                      type="password"
                      v-model="registerForm.password"
                      @input="registerErrors.password = ''"
                      placeholder="输入6-20位密码"
                      class="enhanced-input"
                      :class="{ 'enhanced-input--error': registerErrors.password }"
                      required
                    />
                  </div>
                  <p v-if="registerErrors.password" class="text-sm text-red-500">
                    {{ registerErrors.password }}
                  </p>
                </div>

                <div class="space-y-3">
                  <label class="text-sm font-semibold text-gray-600">确认密码</label>
                  <div class="relative">
                    <span class="field-icon">
                      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        />
                      </svg>
                    </span>
                    <input
                      type="password"
                      v-model="registerForm.confirmPassword"
                      @input="registerErrors.confirmPassword = ''"
                      placeholder="再次确认密码"
                      class="enhanced-input"
                      :class="{ 'enhanced-input--error': registerErrors.confirmPassword }"
                      required
                    />
                  </div>
                  <p v-if="registerErrors.confirmPassword" class="text-sm text-red-500">
                    {{ registerErrors.confirmPassword }}
                  </p>
                  <p
                    v-else-if="
                      registerForm.confirmPassword &&
                      registerForm.password === registerForm.confirmPassword
                    "
                    class="text-sm text-emerald-500"
                  >
                    密码匹配成功
                  </p>
                </div>

                <div
                  class="flex items-start gap-3 rounded-2xl bg-gray-50/80 p-4 text-sm text-gray-600"
                >
                  <input type="checkbox" class="checkbox checkbox-primary mt-1" required />
                  <p>
                    我已阅读并同意
                    <a href="#" class="font-semibold text-purple-600 hover:text-purple-700"
                      >《用户协议》</a
                    >
                    和
                    <a href="#" class="font-semibold text-purple-600 hover:text-purple-700"
                      >《隐私政策》</a
                    >
                  </p>
                </div>

                <button
                  type="submit"
                  :class="[
                    'flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-bold text-white shadow-xl transition-all duration-300',
                    'bg-gradient-to-r from-purple-600 to-blue-500 hover:-translate-y-1 hover:from-purple-700 hover:to-blue-600',
                    { 'cursor-not-allowed opacity-70 saturate-50': registerLoading },
                  ]"
                  :disabled="registerLoading"
                >
                  <span v-if="!registerLoading" class="flex items-center gap-3">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M5 13l1.5-3L10 8l-1.5-3L13 8l3.5 2 1.5 3L13 16l-1.5 3-3.5-2-3.5 2-1.5-3 4.5-2L5 13z"
                      />
                    </svg>
                    立即注册
                  </span>
                  <span v-else class="flex items-center gap-2">
                    <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    注册中...
                  </span>
                </button>

                <div class="text-center text-sm text-gray-600">
                  已有账号？
                  <button
                    type="button"
                    class="font-semibold text-purple-600 hover:text-purple-700"
                    @click="switchForm('login')"
                  >
                    立即登录
                  </button>
                </div>

                <div v-if="registerError" class="glass-error" role="alert">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                    />
                  </svg>
                  <span>{{ registerError }}</span>
                </div>
              </form>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, type RegisterDto } from '@/stores'

type AuthMode = 'login' | 'register'

const router = useRouter()
const userStore = useUserStore()

const isLogin = ref(router.currentRoute.value.name === 'Login')

const formTitle = computed(() => (isLogin.value ? '欢迎回来' : '你好，新朋友'))

const switchForm = (mode: AuthMode) => {
  const targetName = mode === 'login' ? 'Login' : 'Register'
  if (router.currentRoute.value.name !== targetName) {
    router.push({ name: targetName })
  }
  isLogin.value = mode === 'login'
}

router.afterEach((to) => {
  if (to.name === 'Login' || to.name === 'Register') {
    isLogin.value = to.name === 'Login'
    loginError.value = ''
    registerError.value = ''
  }
})

const loginForm = reactive({
  id: '',
  password: '',
})
const loginLoading = ref(false)
const loginError = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const registerForm = reactive({
  id: undefined as number | undefined,
  username: '',
  password: '',
  confirmPassword: '',
})
const registerErrors = reactive({
  id: '',
  username: '',
  password: '',
  confirmPassword: '',
})
const registerLoading = ref(false)
const registerError = ref('')

const handleLogin = async () => {
  loginError.value = ''
  loginLoading.value = true

  try {
    const res = await userStore.login({
      ...loginForm,
      id: Number(loginForm.id),
    })
    console.log('登录成功', res)
    router.push('/')
  } catch (error: any) {
    console.error('登录失败:', error)
    loginError.value = error.message || '登录失败，请重试'
  } finally {
    loginLoading.value = false
  }
}

const validateRegister = (): boolean => {
  let isValid = true

  registerErrors.id = ''
  registerErrors.username = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''

  if (!registerForm.id) {
    registerErrors.id = '请输入账号'
    isValid = false
  } else if (registerForm.id.toString().length < 6) {
    registerErrors.id = '账号长度至少6位'
    isValid = false
  }

  if (!registerForm.username.trim()) {
    registerErrors.username = '请输入用户名'
    isValid = false
  } else if (registerForm.username.trim().length < 2) {
    registerErrors.username = '用户名至少2个字符'
    isValid = false
  } else if (registerForm.username.trim().length > 20) {
    registerErrors.username = '用户名不能超过20个字符'
    isValid = false
  } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9_\-]+$/.test(registerForm.username.trim())) {
    registerErrors.username = '用户名只能包含中文、英文、数字、下划线和减号'
    isValid = false
  }

  if (!registerForm.password) {
    registerErrors.password = '请输入密码'
    isValid = false
  } else if (registerForm.password.length < 6) {
    registerErrors.password = '密码至少6位'
    isValid = false
  } else if (registerForm.password.length > 20) {
    registerErrors.password = '密码不能超过20位'
    isValid = false
  }

  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = '请确认密码'
    isValid = false
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateRegister()) return

  registerError.value = ''
  registerLoading.value = true

  try {
    const registerData: RegisterDto = {
      id: Number(registerForm.id),
      username: registerForm.username.trim(),
      password: registerForm.password,
    }

    const res = await userStore.register(registerData)
    console.log('注册成功', res)

    switchForm('login')
    Object.assign(registerForm, {
      id: undefined,
      username: '',
      password: '',
      confirmPassword: '',
    })
  } catch (error: any) {
    console.error('注册失败:', error)
    registerError.value = error.response?.data?.message || '注册失败，请重试'
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped>
.pattern-grid {
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
  background-size:
    140px 140px,
    140px 140px;
}

.pattern-grid-sm {
  background-image:
    linear-gradient(rgba(226, 232, 240, 0.6) 1px, transparent 1px),
    linear-gradient(90deg, rgba(226, 232, 240, 0.45) 1px, transparent 1px);
  background-size:
    60px 60px,
    60px 60px;
}

.hero-noise {
  background-image: radial-gradient(rgba(255, 255, 255, 0.35) 1px, transparent 1px);
  background-size: 3px 3px;
}

.tab-pill {
  position: absolute;
  inset: 0.25rem;
  width: calc(50% - 0.25rem);
  height: calc(100% - 0.5rem);
  border-radius: 9999px;
  background: linear-gradient(120deg, #a855f7, #3b82f6);
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.35);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-pill--register {
  transform: translateX(100%);
}

.tab-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  border: none;
  background: transparent;
  padding: 0.85rem 0;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #9ca3af;
  transition: color 0.3s ease;
}

.tab-btn--active {
  color: #111827;
}

.field-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  background: rgba(229, 231, 235, 0.5);
  color: #7c3aed;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.12);
}

.enhanced-input {
  width: 100%;
  height: 3.5rem;
  border-radius: 1.5rem;
  border: 2px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.95);
  padding: 0 1.5rem 0 4.5rem;
  color: #111827;
  font-weight: 500;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease;
}

.enhanced-input:focus {
  border-color: #c084fc;
  box-shadow: 0 25px 45px -20px rgba(79, 70, 229, 0.45);
  outline: none;
  background: #fff;
}

.enhanced-input--error {
  border-color: #f87171;
}

.social-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.75rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  color: #6b7280;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.social-btn:hover {
  transform: translateY(-3px);
  border-color: rgba(196, 181, 253, 0.9);
  box-shadow: 0 15px 35px rgba(79, 70, 229, 0.15);
}

.info-card {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  border-radius: 1.75rem;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(249, 250, 251, 0.95);
  padding: 1.25rem 1.5rem;
}

.info-card__action {
  border-radius: 9999px;
  background: linear-gradient(120deg, #a855f7, #3b82f6);
  color: #fff;
  font-weight: 600;
  padding: 0.65rem 1.5rem;
  border: none;
  box-shadow: 0 18px 35px rgba(79, 70, 229, 0.25);
}

.glass-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(248, 113, 113, 0.3);
  background: rgba(254, 226, 226, 0.75);
  padding: 0.75rem 1rem;
  color: #b91c1c;
}

.gradient-blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.7;
}

.gradient-blob--one {
  top: -3rem;
  right: -4rem;
  width: 18rem;
  height: 18rem;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.6), transparent 60%);
}

.gradient-blob--two {
  bottom: -4rem;
  left: -4rem;
  width: 15rem;
  height: 15rem;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.45), transparent 60%);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 5s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}
</style>
