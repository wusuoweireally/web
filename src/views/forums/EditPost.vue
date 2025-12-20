<template>
  <div class="relative min-h-screen bg-[#f5f6fa]">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-24 top-6 h-72 w-72 rounded-full bg-[#dceafe] blur-3xl opacity-60"></div>
      <div class="absolute right-[-80px] top-16 h-80 w-80 rounded-full bg-[#fde2c5] blur-3xl opacity-70"></div>
      <div class="absolute left-1/3 top-52 h-56 w-56 rounded-full bg-[#e8e7ff] blur-3xl opacity-60"></div>
    </div>
    <div class="relative mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div class="overflow-hidden rounded-[36px] border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/50 relative">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
        <div class="relative">
          <div class="h-2 w-full bg-gradient-to-r from-slate-900 via-indigo-600 to-emerald-500"></div>
          <div class="flex flex-col gap-5 p-7 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div class="space-y-3">
              <div class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-1.5 border border-emerald-200">
                <i class="i-mdi-pencil-circle text-emerald-600"></i>
                <p class="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">Update</p>
              </div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                编辑帖子
              </h1>
              <p class="text-base text-slate-600 max-w-xl">
                修正、补充或更新内容，保存后会记录最新编辑时间。
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <button class="btn btn-ghost hover:bg-slate-100 shadow-sm hover:shadow-md transition-all" @click="handleCancel">
                <i class="i-mdi-close text-lg"></i>
                取消
              </button>
              <button
                class="group btn btn-outline hover:bg-amber-50 border-amber-300 hover:border-amber-400 shadow-sm hover:shadow-md transition-all"
                @click="resetToOriginal"
                :disabled="!hasChanges"
              >
                <i class="i-mdi-restore text-lg group-hover:rotate-180 transition-transform duration-500"></i>
                恢复原始
              </button>
              <button
                class="group btn btn-outline hover:bg-slate-50 border-slate-300 hover:border-slate-400 shadow-sm hover:shadow-md transition-all"
                @click="previewPost"
                :disabled="!hasContent"
              >
                <i class="i-mdi-eye text-lg group-hover:scale-110 transition-transform"></i>
                预览
              </button>
              <button
                class="group btn btn-primary shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all overflow-hidden relative"
                @click="submitUpdate"
                :disabled="isSubmitting || !isFormValid"
              >
                <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <i class="i-mdi-content-save text-lg relative z-10 group-hover:-translate-y-0.5 transition-transform" v-if="!isSubmitting"></i>
                <span class="loading loading-sm loading-spinner relative z-10" v-else></span>
                <span class="font-medium relative z-10">{{ isSubmitting ? "更新中..." : "保存修改" }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="loading"
        class="flex min-h-[40vh] items-center justify-center rounded-2xl border border-slate-200/70 bg-white/90 shadow"
      >
        <div class="flex flex-col items-center gap-3 text-slate-500">
          <span class="loading loading-lg loading-spinner text-primary"></span>
          <p class="text-sm">正在加载帖子...</p>
        </div>
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-error/30 bg-error/5 p-6 text-error shadow"
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
        <div class="rounded-[32px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-200/50 backdrop-blur-sm relative overflow-hidden">
          <div class="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-full blur-3xl"></div>
          <div class="relative space-y-7">
            <div class="grid gap-5 md:grid-cols-2">
              <div class="form-control group">
                <label class="label mb-2">
                  <span class="label-text font-semibold text-slate-800 flex items-center gap-2">
                    <i class="i-mdi-format-title text-blue-600"></i>
                    标题 <span class="text-error">*</span>
                  </span>
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  placeholder="请输入帖子标题，建议不超过50字"
                  class="input input-bordered w-full transition-all hover:border-slate-400 focus:border-slate-900"
                  :class="{ 'input-error': errors.title }"
                  @input="validateTitle"
                  maxlength="100"
                />
                <label class="label mt-1">
                  <span class="label-text-alt text-error" v-if="errors.title">{{ errors.title }}</span>
                  <span class="label-text-alt ml-auto text-slate-500">{{ (formData.title || "").length }}/100</span>
                </label>
              </div>

              <div class="form-control group">
                <label class="label mb-2">
                  <span class="label-text font-semibold text-slate-800 flex items-center gap-2">
                    <i class="i-mdi-shape-outline text-indigo-600"></i>
                    分类 <span class="text-error">*</span>
                  </span>
                </label>
                <select
                  v-model="formData.category"
                  class="select select-bordered w-full transition-all hover:border-slate-400 focus:border-slate-900 cursor-pointer"
                  :class="{ 'select-error': errors.category }"
                  @change="validateCategory"
                >
                  <option value="" disabled>请选择分类</option>
                  <option value="tech_discussion">💡 技术讨论</option>
                  <option value="experience_sharing">✨ 经验分享</option>
                  <option value="q_a">❓ 问答求助</option>
                  <option value="resource_sharing">🎁 资源分享</option>
                </select>
                <label class="label mt-1">
                  <span class="label-text-alt text-error" v-if="errors.category">{{ errors.category }}</span>
                </label>
              </div>
            </div>

            <div class="form-control group">
              <label class="label mb-2">
                <span class="label-text font-semibold text-slate-800 flex items-center gap-2">
                  <i class="i-mdi-text text-emerald-600"></i>
                  内容 <span class="text-error">*</span>
                </span>
              </label>
              <div class="rounded-2xl border border-slate-200 focus-within:border-slate-900 transition-colors overflow-hidden">
                <RichTextEditor
                  v-model="formData.content"
                  placeholder="请输入帖子内容，支持富文本格式..."
                  :maxlength="10000"
                  height="400px"
                  @change="validateContent"
                />
              </div>
              <label class="label mt-1">
                <span class="label-text-alt text-error" v-if="errors.content">{{ errors.content }}</span>
              </label>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <div class="form-control group">
                <label class="label mb-2">
                  <span class="label-text font-semibold text-slate-800 flex items-center gap-2">
                    <i class="i-mdi-text-short text-amber-600"></i>
                    摘要 <span class="text-xs text-slate-500">(可选)</span>
                  </span>
                </label>
                <textarea
                  v-model="formData.summary"
                  placeholder="请输入帖子摘要，有助于其他用户快速了解内容"
                  class="textarea textarea-bordered h-28 w-full resize-none transition-all hover:border-slate-400 focus:border-slate-900"
                  maxlength="200"
                ></textarea>
                <label class="label mt-1">
                  <span class="label-text-alt text-slate-500">{{ (formData.summary || "").length }}/200</span>
                </label>
              </div>

              <div class="form-control group">
                <label class="label mb-2">
                  <span class="label-text font-semibold text-slate-800 flex items-center gap-2">
                    <i class="i-mdi-tag-outline text-purple-600"></i>
                    标签 <span class="text-xs text-slate-500">(可选)</span>
                  </span>
                </label>
                <div class="mb-3 flex flex-wrap gap-2">
                  <div
                    v-for="(tag, index) in tagList"
                    :key="index"
                    class="group badge gap-2 border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    #{{ tag }}
                    <button
                      @click="removeTag(index)"
                      class="btn btn-ghost btn-xs h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-600"
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
                    class="input input-bordered input-sm flex-1 transition-all hover:border-slate-400 focus:border-slate-900"
                    @keydown.enter.prevent="addTag"
                    maxlength="20"
                  />
                  <button
                    @click="addTag"
                    class="btn btn-sm btn-primary shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:hover:scale-100"
                    :disabled="!newTag.trim()"
                  >
                    <i class="i-mdi-plus"></i>
                    添加
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-5">
          <div class="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-200/30 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div class="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div class="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-2 shadow-md shadow-amber-500/30">
                    <i class="i-mdi-information text-white text-lg"></i>
                  </div>
                  <h3 class="text-base font-bold text-slate-900">编辑说明</h3>
                </div>
                <span class="badge badge-sm font-medium" :class="hasChanges ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'">
                  {{ hasChanges ? "⚠️ 有未保存更改" : "✓ 已保存" }}
                </span>
              </div>
              <ul class="space-y-2.5 text-sm">
                <li class="flex items-start gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
                  <span class="text-emerald-600">✓</span>
                  <span class="text-slate-700">帖子最后编辑时间将同步更新</span>
                </li>
                <li class="flex items-start gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
                  <span class="text-blue-600">✓</span>
                  <span class="text-slate-700">修改范围较大时，可在开头写一段 "更新日志"</span>
                </li>
                <li class="flex items-start gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
                  <span class="text-indigo-600">✓</span>
                  <span class="text-slate-700">保持格式整洁，去除外部水印或广告</span>
                </li>
              </ul>
              <div class="mt-5 flex flex-col gap-2">
                <button
                  class="btn btn-outline btn-sm shadow-md hover:shadow-lg transition-all hover:scale-105"
                  @click="previewPost"
                  :disabled="!hasContent"
                >
                  <i class="i-mdi-eye text-base"></i>
                  预览效果
                </button>
                <button class="btn btn-ghost btn-sm hover:bg-slate-100 transition-colors" @click="handleCancel">
                  <i class="i-mdi-arrow-left text-base"></i>
                  返回详情页
                </button>
              </div>
            </div>
          </div>

          <div class="rounded-[24px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-lg shadow-slate-200/30 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i class="i-mdi-eye-outline text-emerald-600"></i>
                  实时预览
                </h3>
                <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{{ getCategoryName(formData.category) }}</span>
              </div>
              <div class="space-y-3">
                <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p class="text-lg font-bold text-slate-900 line-clamp-2 min-h-[3.5rem]">
                    {{ formData.title || "请输入标题" }}
                  </p>
                  <p class="text-sm text-slate-600 line-clamp-3 mt-2 min-h-[3.75rem]" v-if="formData.summary || formData.content" v-html="formData.summary || formData.content"></p>
                  <div class="flex flex-wrap gap-1.5 mt-3">
                    <span
                      v-for="tag in tagList"
                      :key="tag"
                      class="badge badge-ghost badge-xs text-xs"
                    >
                      #{{ tag }}
                    </span>
                    <span v-if="tagList.length === 0" class="text-xs text-slate-400">添加标签帮助推荐</span>
                  </div>
                </div>
              </div>
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
import { ref, computed, reactive, onMounted } from "vue";
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

onMounted(() => {
  loadPost();
});
</script>

<style>
.custom-prose img {
  max-width: 100%;
  border-radius: 8px;
}
</style>
