<template>
  <div class="min-h-screen bg-gradient-to-b from-base-100 via-base-200 to-base-300">
        <div class="mx-auto max-w-5xl px-4 py-10">
      <div class="mb-8 rounded-3xl bg-base-100/80 p-6 shadow">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.4em] text-primary/70">Create</p>
            <h1 class="text-3xl font-bold text-base-content">发布新帖子</h1>
            <p class="text-base-content/60">分享你的灵感、案例或技巧，帮助更多壁纸爱好者。</p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-ghost" @click="handleCancel">
              <i class="i-mdi-close text-lg"></i>
              取消
            </button>
            <button class="btn btn-outline" @click="previewPost" :disabled="!hasContent">
              <i class="i-mdi-eye text-lg"></i>
              预览
            </button>
            <button class="btn btn-primary" @click="publishPost" :disabled="isSubmitting || !isFormValid">
              <i class="i-mdi-send text-lg" v-if="!isSubmitting"></i>
              <span class="loading loading-sm loading-spinner" v-else></span>
              {{ isSubmitting ? "发布中..." : "发布帖子" }}
            </button>
          </div>
        </div>
      </div>

      <!-- 发布表单 -->
      <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <!-- 帖子标题 -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text font-medium"
                >标题 <span class="text-error">*</span></span
              >
            </label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="请输入帖子标题，建议不超过50字"
              class="input-bordered input"
              :class="{ 'input-error': errors.title }"
              @input="validateTitle"
              maxlength="100"
            />
            <label class="label" v-if="errors.title">
              <span class="label-text-alt text-error">{{ errors.title }}</span>
            </label>
            <div class="label">
              <span class="label-text-alt"
                >{{ formData.title.length }}/100</span
              >
            </div>
          </div>

          <!-- 帖子分类 -->
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text font-medium"
                >分类 <span class="text-error">*</span></span
              >
            </label>
            <select
              v-model="formData.category"
              class="select-bordered select"
              :class="{ 'select-error': errors.category }"
              @change="validateCategory"
            >
              <option value="" disabled>请选择分类</option>
              <option value="tech_discussion">技术讨论</option>
              <option value="experience_sharing">经验分享</option>
              <option value="q_a">问答求助</option>
              <option value="resource_sharing">资源分享</option>
            </select>
            <label class="label" v-if="errors.category">
              <span class="label-text-alt text-error">{{
                errors.category
              }}</span>
            </label>
          </div>

          <!-- 帖子内容 -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text font-medium"
                >内容 <span class="text-error">*</span></span
              >
            </label>
            <RichTextEditor
              v-model="formData.content"
              placeholder="请输入帖子内容，支持富文本格式..."
              :maxlength="10000"
              height="400px"
              @change="validateContent"
            />
            <label class="label" v-if="errors.content">
              <span class="label-text-alt text-error">{{
                errors.content
              }}</span>
            </label>
          </div>

          <!-- 帖子摘要 -->
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text font-medium"
                >摘要 <span class="text-xs">(可选)</span></span
              >
            </label>
            <textarea
              v-model="formData.summary"
              placeholder="请输入帖子摘要，有助于其他用户快速了解内容"
              class="textarea-bordered textarea h-20"
              maxlength="200"
            ></textarea>
            <div class="label">
              <span class="label-text-alt"
                >{{ (formData.summary || "").length }}/200</span
              >
            </div>
          </div>

          <!-- 标签 -->
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text font-medium"
                >标签 <span class="text-xs">(可选)</span></span
              >
            </label>
            <div class="mb-2 flex flex-wrap gap-2">
              <div
                v-for="(tag, index) in tagList"
                :key="index"
                class="badge gap-1 badge-outline badge-primary"
              >
                {{ tag }}
                <button
                  @click="removeTag(index)"
                  class="btn h-4 min-h-0 w-4 p-0 btn-ghost btn-xs"
                >
                  <i class="i-mdi-close text-xs"></i>
                </button>
              </div>
            </div>
            <div class="flex gap-2">
              <input
                v-model="newTag"
                type="text"
                placeholder="添加标签（按回车确认）"
                class="input-bordered input input-sm flex-1"
                @keydown.enter.prevent="addTag"
                maxlength="20"
              />
              <button
                @click="addTag"
                class="btn btn-sm btn-primary"
                :disabled="!newTag.trim()"
              >
                添加
              </button>
            </div>
          </div>

          <!-- 发布选项 -->
          <div class="form-control mb-6">
            <label class="label cursor-pointer">
              <span class="label-text">允许评论</span>
              <input
                v-model="formData.allowComments"
                type="checkbox"
                class="checkbox checkbox-primary"
                checked
              />
            </label>
          </div>
        </div>
        </div>
        <div class="space-y-6">
          <div class="rounded-2xl bg-base-100 p-5 shadow">
            <h3 class="text-lg font-semibold">发布指南</h3>
            <ul class="mt-3 space-y-2 text-sm text-base-content/70">
              <li>• 标题突出主题，便于他人检索。</li>
              <li>• 内容建议包含配色方案、创作思路或技术要点。</li>
              <li>• 标签最多 5 个，可帮助系统推荐。</li>
              <li>• 预览确认无误后再发布，支持草稿保存。</li>
            </ul>
          </div>
          <div class="rounded-2xl bg-base-100 p-5 shadow">
            <h3 class="text-lg font-semibold">快捷操作</h3>
            <div class="mt-3 flex flex-col gap-2">
              <button class="btn btn-outline btn-sm" @click="saveDraft" :disabled="isSubmitting || !hasContent">
                <i class="i-mdi-content-save text-lg"></i>
                存为草稿
              </button>
              <button class="btn btn-ghost btn-sm" @click="handleCancel">
                <i class="i-mdi-arrow-left text-lg"></i>
                返回上一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览模态框 -->
    <dialog ref="previewModal" class="modal">
      <div class="modal-box max-w-4xl">
        <h3 class="mb-4 text-lg font-bold">帖子预览</h3>
        <div class="custom-prose">
          <h2 class="mb-2 text-xl font-bold">
            {{ formData.title || "无标题" }}
          </h2>
          <div class="mb-4 badge badge-outline">
            {{ getCategoryName(formData.category) }}
          </div>
          <div
            class="prose prose-sm mb-4 max-w-none"
            v-html="formData.content || '<p>无内容</p>'"
          ></div>
          <p v-if="formData.summary" class="text-gray-600 italic">
            {{ formData.summary }}
          </p>
        </div>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closePreview">关闭</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { forumService, type CreatePostDto } from "@/services/forum";
import { useUserStore } from "@/stores";
import RichTextEditor from "@/components/RichTextEditor.vue";

// 路由和状态管理
const router = useRouter();
const userStore = useUserStore();

// 响应式数据
const isSubmitting = ref(false);
const newTag = ref("");
const tagList = ref<string[]>([]);
const previewModal = ref<HTMLDialogElement>();

// 表单数据
const formData = reactive<
  Omit<CreatePostDto, "category"> & {
    category: CreatePostDto["category"] | "";
    allowComments: boolean;
  }
>({
  title: "",
  content: "",
  category: "" as CreatePostDto["category"] | "",
  summary: "",
  tags: "",
  allowComments: true,
});

// 表单错误
const errors = reactive({
  title: "",
  category: "",
  content: "",
});

// 计算属性
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

// 方法
const validateTitle = () => {
  if (!formData.title.trim()) {
    errors.title = "标题不能为空";
  } else if (formData.title.trim().length < 5) {
    errors.title = "标题至少需要5个字符";
  } else if (formData.title.trim().length > 100) {
    errors.title = "标题不能超过100个字符";
  } else {
    errors.title = "";
  }
};

const validateCategory = () => {
  if (!formData.category) {
    errors.category = "请选择帖子分类";
  } else {
    errors.category = "";
  }
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

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !tagList.value.includes(tag) && tagList.value.length < 5) {
    tagList.value.push(tag);
    newTag.value = "";
  }
};

const removeTag = (index: number) => {
  tagList.value.splice(index, 1);
};

const handleCancel = () => {
  if (hasContent.value) {
    if (confirm("确定要取消发布吗？内容将不会被保存。")) {
      router.back();
    }
  } else {
    router.back();
  }
};

const saveDraft = () => {
  // 存储草稿到 localStorage
  localStorage.setItem(
    "forum_post_draft",
    JSON.stringify({
      ...formData,
      tags: tagList.value.join(","),
    }),
  );

  alert("草稿已保存");
};

const loadDraft = () => {
  const draft = localStorage.getItem("forum_post_draft");
  if (draft) {
    try {
      const draftData = JSON.parse(draft);
      Object.assign(formData, draftData);
      if (draftData.tags) {
        tagList.value = draftData.tags
          .split(",")
          .filter((tag: string) => tag.trim());
      }
    } catch (error) {
      console.error("加载草稿失败:", error);
    }
  }
};

const previewPost = () => {
  previewModal.value?.showModal();
};

const closePreview = () => {
  previewModal.value?.close();
};

const publishPost = async () => {
  // 验证表单
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

    // 准备发布数据
    if (!formData.category) {
      alert("请选择帖子分类");
      return;
    }

    const postData: CreatePostDto = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category as CreatePostDto["category"],
    };

    // 只添加有值的可选字段
    if (formData.summary?.trim()) {
      postData.summary = formData.summary.trim();
    }
    if (tagList.value.length > 0) {
      postData.tags = tagList.value.join(",");
    }

    // 调用发布API
    const newPost = await forumService.createPost(postData);

    // 清除草稿
    localStorage.removeItem("forum_post_draft");

    // 显示成功消息
    alert("帖子发布成功！");

    // 跳转到帖子详情页
    router.push(`/forums/post/${newPost.id}`);
  } catch (error: any) {
    console.error("发布帖子失败:", error);
    alert(error.message || "发布帖子失败，请稍后重试");
  } finally {
    isSubmitting.value = false;
  }
};

// 生命周期
loadDraft();
</script>

<style>
/* 帖子预览样式 */
.content-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.content-preview blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 16px;
  font-style: italic;
}

.content-preview code {
  background-color: #f3f4f6;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 14px;
}

.content-preview pre {
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

.content-preview a {
  color: #3b82f6;
  text-decoration: underline;
}

.custom-prose {
  max-width: none;
}
</style>
