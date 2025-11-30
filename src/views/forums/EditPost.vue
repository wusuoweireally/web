<template>
  <div
    class="min-h-screen bg-gradient-to-b from-base-100 via-base-200 to-base-300"
  >
        <div class="mx-auto max-w-5xl px-4 py-10">
      <div class="mb-8 rounded-3xl bg-base-100/80 p-6 shadow">
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p class="text-sm tracking-[0.4em] text-primary/70 uppercase">
              Update
            </p>
            <h1 class="text-3xl font-bold text-base-content">编辑帖子</h1>
            <p class="text-base-content/60">
              完善内容或修正信息，帖子历史会保留最新更新记录。
            </p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-ghost" @click="handleCancel">
              <i class="i-mdi-close text-lg"></i>
              取消
            </button>
            <button
              class="btn btn-outline"
              @click="resetToOriginal"
              :disabled="!hasChanges"
            >
              <i class="i-mdi-restore text-lg"></i>
              恢复原始
            </button>
            <button
              class="btn btn-primary"
              @click="submitUpdate"
              :disabled="isSubmitting || !isFormValid"
            >
              <i class="i-mdi-content-save text-lg" v-if="!isSubmitting"></i>
              <span class="loading loading-sm loading-spinner" v-else></span>
              {{ isSubmitting ? "更新中..." : "保存修改" }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="loading"
        class="flex min-h-[50vh] items-center justify-center rounded-2xl bg-base-100/80 shadow"
      >
        <div class="loading loading-lg loading-spinner"></div>
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl bg-error/10 p-6 text-error shadow"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <i class="i-mdi-alert-circle text-2xl"></i>
            <span>{{ error }}</span>
          </div>
          <button class="btn btn-sm" @click="router.back()">返回</button>
        </div>
      </div>

      <div v-else-if="originalPost" class="grid gap-6 lg:grid-cols-[2fr_1fr]">
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
                <span class="label-text-alt text-error">{{
                  errors.title
                }}</span>
              </label>
              <div class="label">
                <span class="label-text-alt"
                  >{{ (formData.title || "").length }}/100</span
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
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-2xl bg-base-100 p-5 shadow">
            <h3 class="text-lg font-semibold">编辑说明</h3>
            <ul class="mt-3 space-y-2 text-sm text-base-content/70">
              <li>• 帖子最后编辑时间将同步更新。</li>
              <li>• 若修改范围较大，建议在正文开头写明更新内容。</li>
              <li>• 请确保内容遵守社区规范，避免外部水印或广告。</li>
            </ul>
          </div>

          <div class="rounded-2xl bg-base-100 p-5 shadow">
            <h3 class="text-lg font-semibold">快捷操作</h3>
            <div class="mt-3 flex flex-col gap-2">
              <button
                class="btn btn-outline btn-sm"
                @click="previewPost"
                :disabled="!hasContent"
              >
                <i class="i-mdi-eye text-lg"></i>
                预览效果
              </button>
              <button class="btn btn-ghost btn-sm" @click="handleCancel">
                <i class="i-mdi-arrow-left text-lg"></i>
                返回详情页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog ref="previewModal" class="modal">
      <div class="modal-box max-w-4xl">
        <h3 class="text-lg font-bold">帖子预览</h3>
        <div class="custom-prose mt-4">
          <h2 class="text-xl font-bold">
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
import { useRoute, useRouter } from "vue-router";
import { forumService, type UpdatePostDto } from "@/services/forum";
import RichTextEditor from "@/components/RichTextEditor.vue";

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const error = ref<string | null>(null);
const originalPost = ref<any>(null);
const isSubmitting = ref(false);
const newTag = ref("");
const tagList = ref<string[]>([]);
const previewModal = ref<HTMLDialogElement>();

type EditablePostForm = {
  title: string;
  content: string;
  category: UpdatePostDto["category"] | "";
  summary: string;
  tags: string;
};

const formData = reactive<EditablePostForm>({
  title: "",
  content: "",
  category: "",
  summary: "",
  tags: "",
});

const errors = reactive({
  title: "",
  category: "",
  content: "",
});

const hasContent = computed(
  () => formData.title.trim() || formData.content.trim(),
);
const hasChanges = computed(() => {
  if (!originalPost.value) return false;
  return (
    formData.title !== originalPost.value.title ||
    formData.content !== originalPost.value.content ||
    formData.category !== originalPost.value.category ||
    (formData.summary || "") !== (originalPost.value.summary || "") ||
    tagList.value.join(",") !== (originalPost.value.tags || "")
  );
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

const getCategoryName = (category: string | "" | undefined): string => {
  if (!category) {
    return "未分类";
  }
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

const loadPost = async () => {
  try {
    const id = Number(route.params.id);
    const post = await forumService.getPost(id);
    originalPost.value = post;
    formData.title = post.title;
    formData.content = post.content;
    formData.category = post.category;
    formData.summary = post.summary || "";
    formData.tags = post.tags || "";
    tagList.value = (post.tags || "")
      .split(",")
      .filter((tag: string) => tag.trim());
  } catch (err: any) {
    error.value = err.message || "加载帖子失败";
  } finally {
    loading.value = false;
  }
};

const resetToOriginal = () => {
  if (!originalPost.value) return;
  formData.title = originalPost.value.title;
  formData.content = originalPost.value.content;
  formData.category = originalPost.value.category;
  formData.summary = originalPost.value.summary || "";
  tagList.value = (originalPost.value.tags || "")
    .split(",")
    .filter((tag: string) => tag.trim());
  errors.title = "";
  errors.category = "";
  errors.content = "";
};

const previewPost = () => {
  previewModal.value?.showModal();
};

const closePreview = () => {
  previewModal.value?.close();
};

const handleCancel = () => {
  router.back();
};

const submitUpdate = async () => {
  validateTitle();
  validateCategory();
  validateContent();
  if (!isFormValid.value) {
    alert("请填写所有必填字段");
    return;
  }
  try {
    isSubmitting.value = true;
    const id = Number(route.params.id);
    const updateData: UpdatePostDto = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category as UpdatePostDto["category"],
      summary: formData.summary?.trim(),
      tags: tagList.value.join(","),
    };
    const updatedPost = await forumService.updatePost(id, updateData);
    alert("帖子更新成功");
    router.push(`/forums/post/${updatedPost.id}`);
  } catch (err: any) {
    console.error("更新帖子失败:", err);
    alert(err.message || "更新失败，请稍后重试");
  } finally {
    isSubmitting.value = false;
  }
};

loadPost();
</script>

<style>
.custom-prose img {
  max-width: 100%;
  border-radius: 8px;
}
</style>
