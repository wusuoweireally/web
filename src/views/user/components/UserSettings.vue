<template>
  <div class="mx-auto max-w-4xl p-6">
    <h2 class="mb-8 text-3xl font-bold text-gray-800">账号设置</h2>

    <!-- 个人信息设置 -->
    <div class="card mb-6 bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="card-body">
        <h3 class="mb-4 card-title text-xl">个人信息</h3>

        <div class="space-y-4">
          <!-- 头像上传 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">头像</span>
            </label>
            <div class="flex flex-col items-center gap-4">
              <div class="avatar">
                <div
                  class="h-24 w-24 rounded-full ring-2 ring-primary ring-offset-2"
                >
                  <img
                    :src="userStore.userAvatar"
                    :alt="userStore.user?.username"
                  />
                </div>
              </div>
              <label class="btn btn-outline btn-primary">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleAvatarChange"
                  class="hidden"
                />
                更换头像
              </label>
            </div>
            <label class="label" v-if="avatarPreview">
              <span class="label-text-alt text-success">✅ 新头像预览</span>
            </label>
          </div>

          <!-- 用户名 -->
          <div class="form-control">
            <label class="label flex">
              <span class="label-text font-semibold w-24">用户名</span>
              <input
                type="text"
                v-model="profileForm.username"
                placeholder="请输入用户名"
                class="input-bordered input focus:input-primary flex-1"
              />
            </label>
          </div>

          <!-- 邮箱 -->
          <div class="form-control">
            <label class="label flex">
              <span class="label-text font-semibold w-24">邮箱</span>
              <input
                type="email"
                v-model="profileForm.email"
                placeholder="请输入邮箱（可选）"
                class="input-bordered input focus:input-primary flex-1"
              />
            </label>
          </div>

          <!-- 个人简介 -->
          <div class="form-control">
            <label class="label flex">
              <span class="label-text font-semibold w-24">个人简介</span>
              <textarea
                v-model="profileForm.bio"
                placeholder="简单介绍一下自己..."
                class="textarea-bordered textarea h-24 focus:textarea-primary flex-1"
                maxlength="500"
              ></textarea>
            </label>
            <label class="label">
              <span class="label-text-alt text-gray-500"
                >{{ profileForm.bio?.length || 0 }}/500</span
              >
            </label>
          </div>
        </div>

        <div class="card-actions justify-end mt-6">
          <button
            @click="updateProfile"
            :class="[
              'btn btn-primary hover:btn-secondary transition-all duration-300',
              { 'btn-disabled loading': profileLoading },
            ]"
            :disabled="profileLoading"
          >
            {{ profileLoading ? "保存中..." : "保存个人信息" }}
          </button>
        </div>

        <!-- 头像上传状态提示 -->
        <div v-if="profileLoading && avatarFile" class="mt-2 text-sm text-info">
          正在上传头像...
        </div>

        <!-- 错误提示 -->
        <div v-if="profileError" class="mt-4 alert alert-error shadow-lg">
          <span>❌ {{ profileError }}</span>
        </div>

        <!-- 成功提示 -->
        <div v-if="profileSuccess" class="mt-4 alert alert-success shadow-lg">
          <span>✅ {{ profileSuccess }}</span>
        </div>
      </div>
    </div>

    <!-- 修改密码 -->
    <div class="card mb-6 bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="card-body">
        <h3 class="mb-4 card-title text-xl">修改密码</h3>

        <div class="space-y-4">
          <div class="form-control">
            <label class="label flex">
              <span class="label-text font-semibold w-24">当前密码</span>
              <input
                type="password"
                v-model="passwordForm.currentPassword"
                placeholder="请输入当前密码"
                class="input-bordered input focus:input-primary flex-1"
              />
            </label>
          </div>

          <div class="form-control">
            <label class="label flex">
              <span class="label-text font-semibold w-24">新密码</span>
              <input
                type="password"
                v-model="passwordForm.newPassword"
                placeholder="请输入新密码"
                class="input-bordered input focus:input-primary flex-1"
              />
            </label>
          </div>

          <div class="form-control">
            <label class="label flex">
              <span class="label-text font-semibold w-24">确认新密码</span>
              <input
                type="password"
                v-model="passwordForm.confirmPassword"
                placeholder="请再次输入新密码"
                class="input-bordered input focus:input-primary flex-1"
              />
            </label>
          </div>
        </div>

        <div class="card-actions justify-end mt-6">
          <button
            @click="updatePassword"
            :class="[
              'btn btn-primary hover:btn-secondary transition-all duration-300',
              { 'btn-disabled loading': passwordLoading },
            ]"
            :disabled="passwordLoading"
          >
            {{ passwordLoading ? "保存中..." : "修改密码" }}
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="passwordError" class="mt-4 alert alert-error shadow-lg">
          <span>❌ {{ passwordError }}</span>
        </div>

        <!-- 成功提示 -->
        <div v-if="passwordSuccess" class="mt-4 alert alert-success shadow-lg">
          <span>✅ {{ passwordSuccess }}</span>
        </div>
      </div>
    </div>

    <!-- 账号注销 -->
    <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="card-body">
        <h3 class="mb-4 card-title text-xl text-error">账号注销</h3>
        <p class="mb-4 text-gray-600">
          注销账号将永久删除您的所有数据，包括上传的壁纸、收藏、点赞等。此操作无法撤销。
        </p>
        <div class="card-actions justify-end">
          <button class="btn btn-error hover:btn-error/80 transition-all duration-300" @click="showDeleteConfirm = true">
            注销账号
          </button>
        </div>
      </div>
    </div>

    <!-- 注销确认模态框 -->
    <div v-if="showDeleteConfirm" class="modal modal-open">
      <div class="modal-box bg-error text-error-content">
        <h3 class="text-2xl font-bold">
          <i class="i-mdi-alert-circle mr-2"></i>确认注销账号
        </h3>
        <p class="py-4 text-lg">
          ⚠️ 此操作将永久删除您的所有数据，包括：
          <ul class="list-disc list-inside mt-2 space-y-1">
            <li>所有上传的壁纸</li>
            <li>收藏和点赞记录</li>
            <li>个人资料和设置</li>
          </ul>
        </p>
        <p class="font-bold text-xl">此操作无法撤销！</p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="showDeleteConfirm = false">
            取消
          </button>
          <button class="btn btn-error btn-outline" @click="deleteAccount">
            确认注销
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "@/stores";

const userStore = useUserStore();

// 用户信息表单
const profileForm = reactive({
  username: "",
  email: "",
  bio: "",
});

// 密码表单
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 头像相关状态
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);

// 加载状态
const profileLoading = ref(false);
const passwordLoading = ref(false);

// 个人信息表单提示信息
const profileError = ref("");
const profileSuccess = ref("");

// 密码表单提示信息
const passwordError = ref("");
const passwordSuccess = ref("");

// 注销确认
// 注销确认弹窗显示状态
const showDeleteConfirm = ref(false);

// 初始化表单数据
onMounted(() => {
  if (userStore.user) {
    profileForm.username = userStore.user.username || "";
    profileForm.email = userStore.user.email || "";
    profileForm.bio = userStore.user.bio || "";
  }
});

// 头像选择处理
const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    // 验证文件类型和大小
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      profileError.value = "请选择有效的图片文件 (JPEG, PNG, GIF, WebP)";
      input.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      profileError.value = "图片大小不能超过 5MB";
      input.value = "";
      return;
    }

    avatarFile.value = file;
    profileError.value = "";

    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // 自动上传头像
    uploadAvatar(file);
  }
};

// 单独的头像上传方法
const uploadAvatar = async (file: File) => {
  profileLoading.value = true;
  profileError.value = "";
  profileSuccess.value = "";

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`/api/users/${userStore.user?.id}/avatar`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "头像上传失败");
    }

    const result = await response.json();

    // 更新本地用户信息中的头像URL
    if (userStore.user && result.data?.avatarUrl) {
      userStore.user.avatarUrl = result.data.avatarUrl;
    }

    profileSuccess.value = "头像更新成功";
    
    // 3秒后清除成功提示
    setTimeout(() => {
      profileSuccess.value = "";
    }, 3000);

    // 清除预览和文件引用
    avatarFile.value = null;
    avatarPreview.value = null;

    return result;
  } catch (error: any) {
    profileError.value = error.message || "头像上传失败";
    throw new Error(error.message || "头像上传失败");
  } finally {
    profileLoading.value = false;
  }
};

// 表单验证和更新逻辑

// 验证表单数据
const validateProfileForm = (): boolean => {
  // 验证邮箱格式
  if (profileForm.email && !validateEmail(profileForm.email)) {
    profileError.value = "请输入有效的邮箱地址";
    return false;
  }
  
  return true;
};

// 验证邮箱格式
const validateEmail = (email: string) => {
  if (!email) return true; // 邮箱为空时跳过验证
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 检查是否有需要更新的字段
const hasProfileChanges = (): boolean => {
  if (!userStore.user) return false;
  
  return (
    profileForm.username !== userStore.user.username ||
    profileForm.email !== userStore.user.email ||
    profileForm.bio !== userStore.user.bio
  );
};

// 更新个人信息
const updateProfile = async () => {
  profileLoading.value = true;
  profileError.value = "";
  profileSuccess.value = "";

  try {
    // 表单验证
    if (!validateProfileForm()) {
      profileLoading.value = false;
      return;
    }

    // 检查是否有更改
    if (!hasProfileChanges()) {
      profileSuccess.value = "没有需要更新的信息";
      profileLoading.value = false;
      // 3秒后清除成功提示
      setTimeout(() => {
        profileSuccess.value = "";
      }, 3000);
      return;
    }

    const updateData: any = {};

    if (profileForm.username !== userStore.user?.username) {
      updateData.username = profileForm.username;
    }

    // 邮箱可以为空字符串，允许更新为空
    if (profileForm.email !== userStore.user?.email) {
      updateData.email = profileForm.email; // 保留原始值，包括空字符串
    }

    if (profileForm.bio !== userStore.user?.bio) {
      updateData.bio = profileForm.bio;
    }

    // 更新用户信息
    await userStore.updateUserInfo(updateData);

    profileSuccess.value = "个人信息更新成功";

    // 3秒后清除成功提示
    setTimeout(() => {
      profileSuccess.value = "";
    }, 3000);
  } catch (error: any) {
    profileError.value = error.message || "更新失败";
  } finally {
    profileLoading.value = false;
  }
};

// 密码表单验证和更新逻辑

// 验证密码表单
const validatePasswordForm = (): boolean => {
  // 验证当前密码
  if (!passwordForm.currentPassword) {
    passwordError.value = "请输入当前密码";
    return false;
  }

  // 验证新密码
  if (!passwordForm.newPassword) {
    passwordError.value = "请输入新密码";
    return false;
  }

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = "新密码长度至少6位";
    return false;
  }

  // 验证确认密码
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = "两次输入的密码不一致";
    return false;
  }

  return true;
};

// 更新密码
const updatePassword = async () => {
  passwordLoading.value = true;
  passwordError.value = "";
  passwordSuccess.value = "";

  try {
    // 表单验证
    if (!validatePasswordForm()) {
      passwordLoading.value = false;
      return;
    }

    // 这里需要调用后端的密码更新接口
    // 由于后端目前没有专门的密码更新接口，暂时使用通用的更新接口
    await userStore.updateUserInfo({
      password: passwordForm.newPassword,
    });

    passwordSuccess.value = "密码修改成功";

    // 清空密码表单
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";

    // 3秒后清除成功提示
    setTimeout(() => {
      passwordSuccess.value = "";
    }, 3000);
  } catch (error: any) {
    passwordError.value = error.message || "密码修改失败";
  } finally {
    passwordLoading.value = false;
  }
};

// 注销账号
const deleteAccount = async () => {
  try {
    // 这里需要调用后端的账号删除接口
    // 由于后端目前没有账号删除接口，暂时提示用户
    alert("账号注销功能暂未开放，请联系管理员");
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error("注销账号失败:", error);
    alert("注销账号失败，请重试");
  }
};
</script>
