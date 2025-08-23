<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-8 text-gray-800">账号设置</h2>
    
    <!-- 个人信息设置 -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body">
        <h3 class="card-title text-xl mb-4">个人信息</h3>
        
        <!-- 头像上传 -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">头像</span>
          </label>
          <div class="flex items-center gap-4">
            <div class="avatar">
              <div class="w-20 h-20 rounded-full ring-2 ring-primary ring-offset-2">
                <img :src="userStore.userAvatar" :alt="userStore.user?.username" />
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
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">用户名</span>
          </label>
          <input
            type="text"
            v-model="profileForm.username"
            placeholder="请输入用户名"
            class="input input-bordered"
          />
        </div>

        <!-- 邮箱 -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">邮箱</span>
            <span class="label-text-alt text-gray-400">可选</span>
          </label>
          <input
            type="email"
            v-model="profileForm.email"
            placeholder="请输入邮箱（可选）"
            class="input input-bordered"
          />
        </div>

        <!-- 个人简介 -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">个人简介</span>
          </label>
          <textarea
            v-model="profileForm.bio"
            placeholder="简单介绍一下自己..."
            class="textarea textarea-bordered h-24"
            maxlength="500"
          ></textarea>
          <label class="label">
            <span class="label-text-alt text-gray-500">{{ profileForm.bio?.length || 0 }}/500</span>
          </label>
        </div>

        <div class="card-actions justify-end">
          <button
            @click="updateProfile"
            :class="['btn btn-primary', { 'btn-disabled loading': profileLoading }]"
            :disabled="profileLoading"
          >
            {{ profileLoading ? '保存中...' : '保存个人信息' }}
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="profileError" class="alert alert-error mt-4">
          <span>❌ {{ profileError }}</span>
        </div>

        <!-- 成功提示 -->
        <div v-if="profileSuccess" class="alert alert-success mt-4">
          <span>✅ {{ profileSuccess }}</span>
        </div>
      </div>
    </div>

    <!-- 修改密码 -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body">
        <h3 class="card-title text-xl mb-4">修改密码</h3>
        
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">当前密码</span>
          </label>
          <input
            type="password"
            v-model="passwordForm.currentPassword"
            placeholder="请输入当前密码"
            class="input input-bordered"
          />
        </div>

        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">新密码</span>
          </label>
          <input
            type="password"
            v-model="passwordForm.newPassword"
            placeholder="请输入新密码"
            class="input input-bordered"
          />
        </div>

        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">确认新密码</span>
          </label>
          <input
            type="password"
            v-model="passwordForm.confirmPassword"
            placeholder="请再次输入新密码"
            class="input input-bordered"
          />
        </div>

        <div class="card-actions justify-end">
          <button
            @click="updatePassword"
            :class="['btn btn-primary', { 'btn-disabled loading': passwordLoading }]"
            :disabled="passwordLoading"
          >
            {{ passwordLoading ? '保存中...' : '修改密码' }}
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="passwordError" class="alert alert-error mt-4">
          <span>❌ {{ passwordError }}</span>
        </div>

        <!-- 成功提示 -->
        <div v-if="passwordSuccess" class="alert alert-success mt-4">
          <span>✅ {{ passwordSuccess }}</span>
        </div>
      </div>
    </div>

    <!-- 账号注销 -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h3 class="card-title text-xl mb-4 text-error">账号注销</h3>
        <p class="text-gray-600 mb-4">
          注销账号将永久删除您的所有数据，包括上传的壁纸、收藏、点赞等。此操作无法撤销。
        </p>
        <div class="card-actions justify-end">
          <button class="btn btn-error" @click="showDeleteConfirm = true">
            注销账号
          </button>
        </div>
      </div>
    </div>

    <!-- 注销确认模态框 -->
    <div v-if="showDeleteConfirm" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-error">确认注销账号</h3>
        <p class="py-4">
          您确定要注销账号吗？此操作将永久删除您的所有数据，无法恢复！
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="showDeleteConfirm = false">取消</button>
          <button class="btn btn-error" @click="deleteAccount">确认注销</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '@/stores';

const userStore = useUserStore();

// 个人信息表单
const profileForm = reactive({
  username: '',
  email: '',
  bio: '',
});

// 密码表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// 头像相关
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);

// 加载状态
const profileLoading = ref(false);
const passwordLoading = ref(false);

// 提示信息
const profileError = ref('');
const profileSuccess = ref('');
const passwordError = ref('');
const passwordSuccess = ref('');

// 注销确认
const showDeleteConfirm = ref(false);

// 初始化表单数据
onMounted(() => {
  if (userStore.user) {
    profileForm.username = userStore.user.username || '';
    profileForm.email = userStore.user.email || '';
    profileForm.bio = userStore.user.bio || '';
  }
});

// 头像选择处理
const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    // 验证文件类型和大小
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      profileError.value = '请选择有效的图片文件 (JPEG, PNG, GIF, WebP)';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      profileError.value = '图片大小不能超过 5MB';
      input.value = '';
      return;
    }

    avatarFile.value = file;
    profileError.value = '';
    
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// 单独的头像上传方法
const uploadAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch(`/api/users/${userStore.user?.id}/avatar`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '头像上传失败');
    }
    
    const result = await response.json();
    
    // 更新本地用户信息中的头像URL
    if (userStore.user && result.data?.avatarUrl) {
      userStore.user.avatarUrl = result.data.avatarUrl;
    }
    
    return result;
  } catch (error: any) {
    throw new Error(error.message || '头像上传失败');
  }
};

// 更新个人信息
const updateProfile = async () => {
  profileLoading.value = true;
  profileError.value = '';
  profileSuccess.value = '';

  try {
    const updateData: any = {};
    
    if (profileForm.username !== userStore.user?.username) {
      updateData.username = profileForm.username;
    }
    
    // 邮箱可以为空字符串，不进行严格比较
    if (profileForm.email !== userStore.user?.email) {
      updateData.email = profileForm.email || '';
    }
    
    if (profileForm.bio !== userStore.user?.bio) {
      updateData.bio = profileForm.bio;
    }
    
    if (avatarFile.value) {
      // 使用专门的头像上传接口
      await uploadAvatar(avatarFile.value);
      avatarFile.value = null;
      avatarPreview.value = null;
    }

    // 如果没有需要更新的字段
    if (Object.keys(updateData).length === 0 && !avatarFile.value) {
      profileSuccess.value = '没有需要更新的信息';
      return;
    }

    // 如果有其他字段需要更新
    if (Object.keys(updateData).length > 0) {
      await userStore.updateUserInfo(updateData);
    } else if (avatarFile.value) {
      // 如果只有头像更新，也需要调用更新
      await userStore.updateUserInfo({});
    }
    
    profileSuccess.value = '个人信息更新成功';
    
    // 3秒后清除成功提示
    setTimeout(() => {
      profileSuccess.value = '';
    }, 3000);
    
  } catch (error: any) {
    profileError.value = error.message || '更新失败';
  } finally {
    profileLoading.value = false;
  }
};

// 更新密码
const updatePassword = async () => {
  passwordLoading.value = true;
  passwordError.value = '';
  passwordSuccess.value = '';

  try {
    // 验证密码
    if (!passwordForm.currentPassword) {
      throw new Error('请输入当前密码');
    }
    
    if (!passwordForm.newPassword) {
      throw new Error('请输入新密码');
    }
    
    if (passwordForm.newPassword.length < 6) {
      throw new Error('新密码长度至少6位');
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      throw new Error('两次输入的密码不一致');
    }

    // 这里需要调用后端的密码更新接口
    // 由于后端目前没有专门的密码更新接口，暂时使用通用的更新接口
    await userStore.updateUserInfo({
      password: passwordForm.newPassword
    });
    
    passwordSuccess.value = '密码修改成功';
    
    // 清空密码表单
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    
    // 3秒后清除成功提示
    setTimeout(() => {
      passwordSuccess.value = '';
    }, 3000);
    
  } catch (error: any) {
    passwordError.value = error.message || '密码修改失败';
  } finally {
    passwordLoading.value = false;
  }
};

// 注销账号
const deleteAccount = async () => {
  try {
    // 这里需要调用后端的账号删除接口
    // 由于后端目前没有账号删除接口，暂时提示用户
    alert('账号注销功能暂未开放，请联系管理员');
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('注销账号失败:', error);
    alert('注销账号失败，请重试');
  }
};
</script>