<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-6xl px-4 py-8">
      <!-- Header -->
      <div class="mb-6 bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">发布新帖子</h1>
            <p class="mt-1 text-sm text-gray-600">
              把灵感、案例或技巧写下来，让更多壁纸爱好者看到你的创意
            </p>
          </div>
          <div class="flex gap-3">
            <button class="btn btn-ghost" @click="router.back()">
              取消
            </button>
            <button class="btn btn-primary" @click="publishPost" :disabled="isSubmitting || !isFormValid">
              {{ isSubmitting ? '发布中...' : '发布帖子' }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              标题 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="请输入帖子标题，建议不超过50字"
              class="input input-bordered w-full"
              maxlength="100"
              @input="validateTitle"
            />
            <div class="mt-2 flex justify-between text-xs text-gray-500">
              <span v-if="errors.title" class="text-red-500">{{ errors.title }}</span>
              <span class="ml-auto">{{ formData.title.length }}/100</span>
            </div>
          </div>

          <!-- Category -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              分类 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.category"
              class="select select-bordered w-full"
              @change="validateCategory"
            >
              <option value="">请选择分类</option>
              <option value="tech_discussion">💡 技术讨论</option>
              <option value="experience_sharing">✨ 经验分享</option>
              <option value="q_a">❓ 问答求助</option>
              <option value="resource_sharing">🎁 资源分享</option>
            </select>
            <div class="mt-2 text-xs text-red-500" v-if="errors.category">{{ errors.category }}</div>
          </div>

          <!-- Content -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              内容 <span class="text-red-500">*</span>
            </label>
            <RichTextEditor
              v-model="formData.content"
              placeholder="请输入帖子内容，支持富文本格式..."
              :maxlength="10000"
              height="400px"
              @change="validateContent"
            />
            <div class="mt-2 text-xs text-red-500" v-if="errors.content">{{ errors.content }}</div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Publishing Guide -->
          <div class="bg-white rounded-lg border border-gray-200 p-5">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <span class="text-orange-600 text-lg">💡</span>
              </div>
              <h3 class="font-bold text-gray-900">发布指南</h3>
            </div>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start gap-2">
                <span class="text-blue-600 mt-0.5">✓</span>
                <span class="text-gray-700">标题突出主题，便于检索</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-600 mt-0.5">✓</span>
                <span class="text-gray-700">内容可包含创作思路、配色方案或技术要点</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-purple-600 mt-0.5">✓</span>
                <span class="text-gray-700">标签最多 5 个，帮助系统推荐给合适的人</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-amber-600 mt-0.5">✓</span>
                <span class="text-gray-700">随时预览或保存草稿，稍后继续编辑</span>
              </li>
            </ul>
            <div class="mt-5 flex flex-col gap-2">
              <button class="btn btn-outline btn-sm" @click="saveDraft" :disabled="isSubmitting || !hasContent">
                存为草稿
              </button>
              <button class="btn btn-ghost btn-sm" @click="router.back()">
                返回上一页
              </button>
            </div>
          </div>

          <!-- Live Preview -->
          <div class="bg-white rounded-lg border border-gray-200 p-5">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="text-blue-600">👁</span>
              实时预览
            </h3>
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 class="font-bold text-gray-900 text-lg">
                {{ formData.title || '请输入标题' }}
              </h4>
              <div class="mt-2 text-sm text-gray-600">
                <span class="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {{ getCategoryName(formData.category) }}
                </span>
              </div>
              <div class="mt-3 text-sm text-gray-700 line-clamp-3" v-if="formData.content" v-html="formData.content"></div>
              <div class="mt-3 text-xs text-gray-400" v-else>
                预览内容将在这里显示
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <dialog ref="previewModal" class="modal">
      <div class="modal-box max-w-4xl">
        <h3 class="mb-4 text-lg font-bold">帖子预览</h3>
        <div class="prose prose-sm max-w-none">
          <h2>{{ formData.title || '无标题' }}</h2>
          <div class="badge badge-outline">{{ getCategoryName(formData.category) }}</div>
          <div class="mt-4" v-html="formData.content || '<p>无内容</p>'"></div>
        </div>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closePreview">关闭</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { forumService, type CreatePostDto } from "@/services/forum";
import { useUserStore } from "@/stores";
import RichTextEditor from "@/components/RichTextEditor.vue";

const router = useRouter();
const userStore = useUserStore();

const isSubmitting = ref(false);
const previewModal = ref<HTMLDialogElement>();

const formData = reactive<Omit<CreatePostDto, "category"> & {
  category: CreatePostDto["category"] | "";
}>({
  title: "",
  content: "",
  category: "" as CreatePostDto["category"] | "",
});

const errors = reactive({
  title: "",
  category: "",
  content: "",
});

const hasContent = computed(() => {
  return formData.title.trim() || formData.content.trim();
});

const isFormValid = computed(() => {
  return (
    formData.title.trim() &&
    formData.content.trim() &&
    formData.category &&
    !errors.title &&
    !errors.category &&
    !errors.content
  );
});

const validateTitle = () => {
  if (!formData.title.trim()) {
    errors.title = "标题不能为空";
  } else if (formData.title.trim().length < 5) {
    errors.title = "标题至少需要5个字符";
  } else {
    errors.title = "";
  }
};

const validateCategory = () => {
  errors.category = formData.category ? "" : "请选择帖子分类";
};

const validateContent = () => {
  if (!formData.content.trim()) {
    errors.content = "内容不能为空";
  } else if (stripHtml(formData.content).length < 10) {
    errors.content = "内容至少需要10个字符";
  } else {
    errors.content = "";
  }
};

const stripHtml = (html: string): string => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    tech_discussion: "技术讨论",
    experience_sharing: "经验分享",
    q_a: "问答求助",
    resource_sharing: "资源分享",
  };
  return categoryMap[category] || "未分类";
};

const saveDraft = () => {
  localStorage.setItem("forum_post_draft", JSON.stringify(formData));
  alert("草稿已保存");
};

const previewPost = () => {
  previewModal.value?.showModal();
};

const closePreview = () => {
  previewModal.value?.close();
};

const publishPost = async () => {
  validateTitle();
  validateCategory();
  validateContent();

  if (!isFormValid.value) {
    alert("请填写所有必填字段");
    return;
  }

  if (!userStore.isLoggedIn) {
    alert("请先登录后再发布帖子");
    router.push("/auth/login");
    return;
  }

  try {
    isSubmitting.value = true;

    const postData: CreatePostDto = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category as CreatePostDto["category"],
    };

    const newPost = await forumService.createPost(postData);

    localStorage.removeItem("forum_post_draft");

    alert("帖子发布成功！");
    router.push(`/forums/post/${newPost.id}`);
  } catch (error: any) {
    console.error("发布帖子失败:", error);
    alert(error.message || "发布帖子失败，请稍后重试");
  } finally {
    isSubmitting.value = false;
  }
};

// Save draft before page unload (only if has content)
window.addEventListener("beforeunload", (e) => {
  if (hasContent.value) {
    localStorage.setItem("forum_post_draft", JSON.stringify(formData));
  }
});
</script>
