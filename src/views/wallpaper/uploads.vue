<template>
  <div class="min-h-screen bg-base-200">
    <!-- 导航栏 -->
    <nav class="navbar bg-base-100 shadow-sm">
      <div class="flex-1">
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
          <div class="card-body">
            <!-- 图片上传区域 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">选择壁纸图片</span>
              </label>
              <div
                class="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-primary"
                :class="{
                  'border-primary': isDragging,
                  'border-error': errors.image,
                }"
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
                  <p class="text-sm text-gray-500">
                    支持 JPG, PNG, WEBP 格式，最大 10MB
                  </p>
                </div>

                <div v-else class="relative">
                  <img
                    :src="previewImage"
                    alt="预览图"
                    class="mx-auto max-h-64 rounded-lg"
                  />
                  <button
                    class="btn absolute -top-2 -right-2 btn-circle btn-sm btn-error"
                    @click.stop="removeImage"
                  >
                    <i class="i-mdi-close"></i>
                  </button>
                </div>
              </div>
              <label class="label" v-if="errors.image">
                <span class="label-text-alt text-error">{{
                  errors.image
                }}</span>
              </label>
            </div>

            <!-- 图片信息显示 -->
            <div v-if="imageInfo" class="mt-4 rounded-lg bg-gray-50 p-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">文件名:</span>
                  <span class="ml-2 font-medium">{{ imageInfo.name }}</span>
                </div>
                <div>
                  <span class="text-gray-600">文件大小:</span>
                  <span class="ml-2 font-medium">{{ imageInfo.size }}</span>
                </div>
                <div>
                  <span class="text-gray-600">尺寸:</span>
                  <span class="ml-2 font-medium"
                    >{{ imageInfo.width }} × {{ imageInfo.height }}</span
                  >
                </div>
                <div>
                  <span class="text-gray-600">格式:</span>
                  <span class="ml-2 font-medium">{{ imageInfo.type }}</span>
                </div>
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
                  :class="{
                    'badge-primary': selectedTags.includes(tag),
                    'badge-outline': !selectedTags.includes(tag),
                  }"
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
                class="select-bordered select"
                :class="{ 'select-error': errors.category }"
              >
                <option value="" disabled>请选择分类</option>
                <option
                  v-for="category in categories"
                  :key="category.value"
                  :value="category.value"
                >
                  {{ category.label }}
                </option>
              </select>
              <label class="label" v-if="errors.category">
                <span class="label-text-alt text-error">{{
                  errors.category
                }}</span>
              </label>
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
              <button class="btn mt-2 btn-ghost" @click="$router.back()">
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { wallpaperService } from "@/services/wallpaper";
import { useUserStore } from "@/stores/index";

const router = useRouter();
const userStore = useUserStore();
const fileInput = ref<HTMLInputElement | null>(null);
const loading = ref(false);
const isDragging = ref(false);
const previewImage = ref<string>("");

// 当前用户ID
const currentUserId = computed(() => userStore.user?.id || 0);

// 表单数据
const formData = reactive({
  imageFile: null as File | null,
  category: "",
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
  "4K",
  "8K",
  "高清",
  "超清",
  "风景",
  "星空",
  "海洋",
  "森林",
  "城市",
  "动漫",
  "游戏",
  "电影",
  "艺术",
  "暗色",
  "亮色",
  "渐变",
  "抽象",
  "自然",
  "动物",
  "植物",
  "建筑",
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
  // 验证文件类型
  if (!file.type.startsWith("image/")) {
    errors.image = "请选择图片文件";
    return;
  }

  // 验证文件大小 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    errors.image = "图片大小不能超过 10MB";
    return;
  }

  formData.imageFile = file;
  errors.image = "";

  // 创建预览图
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string;

    // 获取图片尺寸信息
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

  // 清空错误信息
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  // 验证图片
  if (!formData.imageFile) {
    errors.image = "请选择要上传的图片";
    isValid = false;
  }

  // 验证分类
  if (!formData.category) {
    errors.category = "请选择分类";
    isValid = false;
  }

  // 验证标签
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

  try {
    if (!formData.imageFile) {
      throw new Error("请选择要上传的图片");
    }

    if (!currentUserId.value) {
      throw new Error("请先登录");
    }

    // 调用上传服务
    const response = await wallpaperService.uploadWallpaper({
      file: formData.imageFile,
      category: formData.category,
      tags: formData.tags,
    });

    if ((response as any).success) {
      // 上传成功，跳转到用户中心或壁纸详情页
      alert("壁纸上传成功！");
      router.push("/user/uploads");
    } else {
      throw new Error((response as any).message || "上传失败");
    }
  } catch (error: any) {
    console.error("上传失败:", error);
    alert(error.message || "上传失败，请重试");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 拖拽区域样式 */
.border-dashed {
  transition: all 0.3s ease;
}

.border-dashed:hover {
  border-color: hsl(var(--p));
  background-color: hsl(var(--b1) / 0.5);
}

/* 图片预览样式 */
img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
