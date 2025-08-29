<template>
  <div class="min-h-screen bg-base-200">
    <!-- 导航栏 -->
    <nav class="navbar bg-base-100 shadow-sm px-4">
      <div class="flex items-center">
        <button class="btn btn-ghost btn-sm" @click="$router.back()">
          <i class="i-mdi-arrow-left text-lg"></i>
          返回
        </button>
        <h1 class="ml-4 text-xl font-bold">上传壁纸</h1>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <div class="mx-auto max-w-4xl">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body space-y-4">
            <!-- 上传状态显示 -->
            <div
              v-if="uploadStatus"
              class="alert"
              :class="{
                'alert-success': uploadStatus.type === 'success',
                'alert-error': uploadStatus.type === 'error',
                'alert-info': uploadStatus.type === 'info',
              }"
            >
              <div>
                <i class="i-mdi-check-circle" v-if="uploadStatus.type === 'success'"></i>
                <i class="i-mdi-alert-circle" v-else-if="uploadStatus.type === 'error'"></i>
                <i class="i-mdi-information" v-else></i>
                <span>{{ uploadStatus.message }}</span>
              </div>
            </div>

            <!-- 上传表单区域 -->
            <div v-if="!uploadStatus">
              <!-- 图片上传区域 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">选择壁纸图片</span>
                </label>
                <div
                  class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-primary hover:bg-base-200/50"
                  :class="{ 'border-primary': isDragging, 'border-error': errors.image }"
                  @click="fileInput?.click()"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop="handleDrop"
                >
                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileSelect"
                  />

                  <div v-if="!previewImage">
                    <i class="i-mdi-cloud-upload mb-4 text-4xl text-gray-400"></i>
                    <p class="mb-2 text-gray-600">点击选择图片或拖拽到此处</p>
                    <p class="text-sm text-gray-500">支持 JPG, PNG, WEBP 格式，最大 10MB</p>
                  </div>

                  <div v-else class="relative">
                    <img
                      :src="previewImage"
                      alt="预览图"
                      class="mx-auto max-h-64 rounded-lg object-contain"
                    />
                    <button
                      class="btn btn-circle btn-sm btn-error absolute -right-2 -top-2"
                      @click.stop="removeImage"
                    >
                      <i class="i-mdi-close"></i>
                    </button>
                  </div>
                </div>
                <label class="label" v-if="errors.image">
                  <span class="label-text-alt text-error">{{ errors.image }}</span>
                </label>
              </div>

              <!-- 图片信息显示 -->
              <div v-if="imageInfo" class="rounded-lg bg-base-200 p-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div><span class="text-gray-600">文件名:</span> <span class="font-medium">{{ imageInfo.name }}</span></div>
                  <div><span class="text-gray-600">文件大小:</span> <span class="font-medium">{{ imageInfo.size }}</span></div>
                  <div><span class="text-gray-600">尺寸:</span> <span class="font-medium">{{ imageInfo.width }} × {{ imageInfo.height }}</span></div>
                  <div><span class="text-gray-600">格式:</span> <span class="font-medium">{{ imageInfo.type }}</span></div>
                </div>
              </div>

              <!-- 标签选择 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">标签</span>
                  <span class="label-text-alt">最多选择5个标签</span>
                </label>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in availableTags"
                    :key="tag"
                    class="badge cursor-pointer"
                    :class="{ 'badge-primary': selectedTags.includes(tag), 'badge-outline': !selectedTags.includes(tag) }"
                    @click="toggleTag(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
                <label class="label" v-if="errors.tags">
                  <span class="label-text-alt text-error">{{ errors.tags }}</span>
                </label>
              </div>

              <!-- 分类选择 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">分类</span>
                </label>
                <select
                  v-model="formData.category"
                  class="select select-bordered"
                  :class="{ 'select-error': errors.category }"
                >
                  <option v-for="category in categories" :key="category.value" :value="category.value">
                    {{ category.label }}
                  </option>
                </select>
                <label class="label" v-if="errors.category">
                  <span class="label-text-alt text-error">{{ errors.category }}</span>
                </label>
              </div>

              <!-- 上传进度条 -->
              <div v-if="isUploading" class="form-control">
                <div class="mb-1 flex justify-between">
                  <span class="text-sm font-medium">上传进度</span>
                  <span class="text-sm font-medium">{{ uploadProgress }}%</span>
                </div>
                <div class="h-2 w-full rounded-full bg-gray-200">
                  <div
                    class="h-2 rounded-full bg-primary transition-all duration-300"
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                </div>
                <button
                  class="btn btn-sm btn-error mt-2"
                  @click="cancelUpload"
                  :disabled="!currentRequestId"
                >
                  <i class="i-mdi-close"></i>
                  取消上传
                </button>
              </div>

              <!-- 操作按钮 -->
              <div class="form-control mt-6">
                <button
                  class="btn btn-primary"
                  :class="{ loading: loading }"
                  :disabled="loading || !formData.imageFile"
                  @click="handleSubmit"
                >
                  <i class="i-mdi-upload text-lg"></i>
                  上传壁纸
                </button>
                <button class="btn btn-ghost mt-2" @click="$router.back()">
                  返回
                </button>
              </div>
            </div>

            <!-- 上传成功后的信息展示 -->
            <div v-if="uploadStatus?.type === 'success'" class="space-y-4">
              <div class="rounded-lg bg-base-200 p-4">
                <h3 class="mb-3 text-lg font-bold">上传成功</h3>
                <div v-if="imageInfo" class="grid grid-cols-2 gap-4 text-sm">
                  <div><span class="text-gray-600">文件名:</span> <span class="font-medium">{{ imageInfo.name }}</span></div>
                  <div><span class="text-gray-600">文件大小:</span> <span class="font-medium">{{ imageInfo.size }}</span></div>
                  <div><span class="text-gray-600">尺寸:</span> <span class="font-medium">{{ imageInfo.width }} × {{ imageInfo.height }}</span></div>
                  <div><span class="text-gray-600">格式:</span> <span class="font-medium">{{ imageInfo.type }}</span></div>
                </div>
                <div v-if="previewImage" class="mt-3">
                  <img
                    :src="previewImage"
                    alt="上传的壁纸"
                    class="mx-auto max-h-32 rounded-lg object-contain"
                  />
                </div>
                <div class="mt-4 flex justify-center">
                  <button class="btn btn-primary" @click="resetForm">
                    <i class="i-mdi-plus"></i>
                    继续上传
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 固定在右下角的我的上传按钮 -->
    <div class="fixed bottom-6 right-6">
      <button
        class="btn btn-circle btn-lg btn-primary shadow-lg"
        @click="$router.push('/user/uploads')"
        title="我的上传"
      >
        <i class="i-mdi-image-multiple"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import axios from "axios";
import { wallpaperService } from "@/services/wallpaper";
import { useUserStore } from "@/stores/index";
import { cancelRequest } from "@/config/api";

const userStore = useUserStore();
const fileInput = ref<HTMLInputElement | null>(null);
const loading = ref(false);
const isDragging = ref(false);
const previewImage = ref<string>("");
const uploadProgress = ref<number>(0);
const isUploading = ref<boolean>(false);
const currentRequestId = ref<string>("");
const uploadStatus = ref<{ type: string; message: string } | null>(null);

// 当前用户ID
const currentUserId = computed(() => userStore.user?.id || 0);

// 表单数据
const formData = reactive({
  imageFile: null as File | null,
  category: "general",
  tags: [] as string[],
});

// 图片信息
const imageInfo = ref<{
  name: string;
  size: string;
  width: number;
  height: number;
  type: string;
} | null>(null);

// 错误信息
const errors = reactive({
  image: "",
  category: "",
  tags: "",
});

// 可用标签
const availableTags = [
  "4K", "8K", "高清", "超清", "风景", "星空", "海洋", "森林", "城市", 
  "动漫", "游戏", "电影", "艺术", "暗色", "亮色", "渐变", "抽象", 
  "自然", "动物", "植物", "建筑"
];

// 可用分类
const categories = [
  { value: "general", label: "全部" },
  { value: "anime", label: "动漫" },
  { value: "people", label: "人物" },
];

// 选中的标签
const selectedTags = ref<string[]>([]);

// 切换标签选择
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    if (selectedTags.value.length < 5) {
      selectedTags.value.push(tag);
    }
  } else {
    selectedTags.value.splice(index, 1);
  }
  formData.tags = selectedTags.value;
};

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    processImageFile(input.files[0]);
  }
};

// 处理拖拽放置
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processImageFile(event.dataTransfer.files[0]);
  }
};

// 处理图片文件
const processImageFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    errors.image = "请选择图片文件";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    errors.image = "图片大小不能超过 10MB";
    return;
  }

  formData.imageFile = file;
  errors.image = "";

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string;

    const img = new Image();
    img.onload = () => {
      imageInfo.value = {
        name: file.name,
        size: formatFileSize(file.size),
        width: img.width,
        height: img.height,
        type: file.type.split("/")[1].toUpperCase(),
      };
    };
    img.src = previewImage.value;
  };
  reader.readAsDataURL(file);
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 移除图片
const removeImage = () => {
  formData.imageFile = null;
  previewImage.value = "";
  imageInfo.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// 验证表单
const validateForm = (): boolean => {
  let isValid = true;

  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  if (!formData.imageFile) {
    errors.image = "请选择要上传的图片";
    isValid = false;
  }

  if (selectedTags.value.length === 0) {
    errors.tags = "请至少选择一个标签";
    isValid = false;
  }

  return isValid;
};

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  isUploading.value = true;
  uploadProgress.value = 0;
  uploadStatus.value = null;

  try {
    if (!formData.imageFile) {
      throw new Error("请选择要上传的图片");
    }

    if (!currentUserId.value) {
      throw new Error("请先登录");
    }

    const { response, requestId } = await wallpaperService.uploadWallpaper(
      {
        file: formData.imageFile,
        category: formData.category,
        tags: formData.tags,
      },
      (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          uploadProgress.value = progress;
        }
      }
    );

    currentRequestId.value = requestId;

    if ((response as any).success) {
      uploadStatus.value = { type: "success", message: "壁纸上传成功！" };
      clearInputForm();
    } else {
      throw new Error((response as any).message || "上传失败");
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("上传已取消");
      uploadStatus.value = { type: "info", message: "上传已取消" };
    } else {
      console.error("上传失败:", error);
      uploadStatus.value = { type: "error", message: error.message || "上传失败，请重试" };
    }
  } finally {
    loading.value = false;
    isUploading.value = false;
    currentRequestId.value = "";
  }
};

// 取消上传
const cancelUpload = () => {
  if (currentRequestId.value) {
    cancelRequest(currentRequestId.value);
  }
};

// 清空输入表单（保留上传成功的信息）
const clearInputForm = () => {
  formData.imageFile = null;
  formData.category = "general";
  formData.tags = [];

  if (fileInput.value) {
    fileInput.value.value = "";
  }

  errors.image = "";
  errors.tags = "";
  errors.category = "";

  selectedTags.value = [];
};

// 重置表单（完全重置所有状态）
const resetForm = () => {
  clearInputForm();
  previewImage.value = "";
  imageInfo.value = null;
  uploadStatus.value = null;
};
</script>