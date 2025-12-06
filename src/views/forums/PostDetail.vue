<template>
  <div class="min-h-screen bg-base-200 p-4 lg:p-6">
    <div class="mx-auto max-w-4xl">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex min-h-[50vh] items-center justify-center">
        <div class="loading loading-lg loading-spinner"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="py-12 text-center">
        <div class="mx-auto mb-4 alert max-w-md alert-error">
          <i class="i-mdi-alert-circle"></i>
          <span>{{ error }}</span>
        </div>
        <button @click="router.back()" class="btn btn-primary">返回</button>
      </div>

      <!-- 帖子内容 -->
      <template v-else-if="post">
        <!-- 顶部导航 -->
        <div class="mb-6 flex items-center justify-between">
          <button class="btn btn-ghost" @click="router.back()">
            <i class="i-mdi-arrow-left text-lg"></i>
            返回
          </button>

          <div class="flex gap-2">
            <!-- 分享按钮 -->
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost">
                <i class="i-mdi-share text-lg"></i>
                分享
              </label>
              <ul
                tabindex="0"
                class="dropdown-content menu w-32 rounded-box bg-base-100 p-2 shadow"
              >
                <li><a @click="shareToWeChat">微信</a></li>
                <li><a @click="shareToWeibo">微博</a></li>
                <li><a @click="copyLink">复制链接</a></li>
              </ul>
            </div>

            <!-- 举报按钮 -->
            <button
              class="btn btn-ghost"
              @click="openReportModal"
              :disabled="!userStore.isLoggedIn"
              title="举报帖子"
            >
              <i class="i-mdi-flag text-lg"></i>
              举报
            </button>
          </div>
        </div>

        <!-- 帖子主体 -->
        <div class="card mb-6 bg-base-100 shadow-md">
          <div class="card-body">
            <!-- 帖子头部信息 -->
            <div class="mb-6 flex items-start gap-4">
              <!-- 用户头像 -->
              <div class="avatar">
                <div
                  v-if="authorAvatar"
                  class="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden border border-base-200 bg-base-100"
                >
                  <img
                    :src="authorAvatar"
                    :alt="post.author?.username || '用户头像'"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                >
                  <span class="text-lg font-semibold text-primary">
                    {{ post.author?.username?.charAt(0)?.toUpperCase() || "U" }}
                  </span>
                </div>
              </div>

              <!-- 用户信息 -->
              <div class="flex-1">
                <div class="mb-2 flex items-center gap-3">
                  <h3 class="font-semibold">
                    {{ post.author?.username || "未知用户" }}
                  </h3>
                  <span class="badge badge-outline">{{
                    getCategoryName(post.category)
                  }}</span>
                  <span class="text-sm text-gray-500">{{
                    formatTime(post.createdAt)
                  }}</span>
                  <!-- 编辑标识 -->
                  <span
                    v-if="post.updatedAt && post.updatedAt !== post.createdAt"
                    class="text-xs text-gray-400"
                  >
                    (已编辑)
                  </span>
                </div>

                <!-- 标签 -->
                <div v-if="post.tags" class="mb-3 flex flex-wrap gap-2">
                  <span
                    v-for="tag in getTagList(post.tags)"
                    :key="tag"
                    class="badge badge-outline badge-sm badge-primary"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- 作者操作 -->
              <div v-if="isAuthor" class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-circle btn-ghost btn-sm">
                  <i class="i-mdi-dots-horizontal"></i>
                </label>
                <ul
                  tabindex="0"
                  class="dropdown-content menu w-32 rounded-box bg-base-100 p-2 shadow"
                >
                  <li><a @click="editPost">编辑</a></li>
                  <li><a class="text-error" @click="deletePost">删除</a></li>
                </ul>
              </div>
            </div>

            <!-- 帖子标题和内容 -->
            <h1 class="mb-4 text-2xl font-bold lg:text-3xl">
              {{ post.title }}
            </h1>

            <!-- 帖子摘要 -->
            <p v-if="post.summary" class="mb-4 text-gray-600 italic">
              {{ post.summary }}
            </p>

            <!-- 帖子内容 -->
            <div
              class="prose mb-6 max-w-none text-base-content"
              v-html="post.content"
            ></div>

            <!-- 帖子统计信息 -->
            <div
              class="flex items-center justify-between border-t border-base-200 pt-4"
            >
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span
                  ><i class="i-mdi-eye"></i>
                  {{ post.viewCount || 0 }} 浏览</span
                >
                <span
                  ><i class="i-mdi-comment"></i>
                  {{ post.commentCount || 0 }} 评论</span
                >
                <span
                  ><i class="i-mdi-heart"></i>
                  {{ post.likeCount || 0 }} 点赞</span
                >
              </div>

              <!-- 点赞按钮 -->
              <button
                class="btn btn-sm"
                :class="isLiked ? 'btn-error' : 'btn-outline'"
                @click="toggleLike"
                :disabled="!userStore.isLoggedIn || likeLoading"
              >
                <span
                  class="loading loading-xs loading-spinner"
                  v-if="likeLoading"
                ></span>
                <i
                  class="i-mdi-heart"
                  :class="isLiked ? 'fill-current' : ''"
                ></i>
                {{ isLiked ? "已点赞" : "点赞" }}
                <span
                  v-if="post.likeCount > 0"
                  class="ml-1 badge badge-outline badge-sm"
                >
                  {{ post.likeCount }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- 评论区域 -->
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="card-title">
                <i class="i-mdi-comment"></i>
                评论 ({{ comments.length }})
              </h2>

              <!-- 评论排序 -->
              <select
                v-model="commentSort"
                class="select-bordered select select-sm"
                @change="() => loadComments()"
              >
                <option value="newest">最新</option>
                <option value="oldest">最早</option>
                <option value="popular">最热</option>
              </select>
            </div>

            <!-- 发表评论 -->
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text font-medium">发表评论</span>
              </label>
              <textarea
                v-model="newComment"
                placeholder="写下你的想法..."
                class="textarea-bordered textarea h-24"
                maxlength="1000"
              ></textarea>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-xs text-gray-500"
                  >{{ newComment.length }}/1000</span
                >
                <button
                  class="btn btn-sm btn-primary"
                  @click="submitComment"
                  :disabled="
                    !userStore.isLoggedIn ||
                    !newComment.trim() ||
                    commentSubmitting
                  "
                >
                  <span
                    class="loading loading-xs loading-spinner"
                    v-if="commentSubmitting"
                  ></span>
                  {{ commentSubmitting ? "发布中..." : "发表评论" }}
                </button>
              </div>
            </div>

            <!-- 评论列表 -->
            <div
              v-if="comments.length === 0 && !loading"
              class="py-8 text-center text-gray-500"
            >
              暂无评论，快来发表第一条评论吧！
            </div>

            <div v-else-if="comments.length > 0" class="space-y-4">
              <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @like="handleCommentLike"
                @edit="handleCommentEdit"
                @delete="handleCommentDelete"
                @reply="handleCommentReply"
                @refresh="loadComments"
              />
            </div>

            <!-- 加载更多 -->
            <div v-if="hasMoreComments" class="mt-6 text-center">
              <button
                class="btn btn-outline"
                @click="loadMoreComments"
                :disabled="loadingMore"
              >
                <span
                  class="loading loading-sm loading-spinner"
                  v-if="loadingMore"
                ></span>
                {{ loadingMore ? "加载中..." : "加载更多评论" }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- 举报模态框 -->
      <ReportModal
        ref="reportModalRef"
        :target-type="'post'"
        :target-id="postId"
        @success="handleReportSuccess"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { forumService } from "@/services/forum";
import { useUserStore } from "@/stores";
import type { Post, Comment } from "@/stores/forum";
import CommentItem from "@/components/CommentItem.vue";
import ReportModal from "@/components/ReportModal.vue";
import { resolveAvatarUrl } from "@/utils/avatar";

// 路由和状态管理
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 响应式数据
const loading = ref(true);
const error = ref("");
const post = ref<Post | null>(null);
const comments = ref<Comment[]>([]);
const newComment = ref("");
const commentSubmitting = ref(false);
const likeLoading = ref(false);
const isLiked = ref(false);
const commentSort = ref("newest");
const currentPage = ref(1);
const hasMoreComments = ref(false);
const loadingMore = ref(false);
const reportModalRef = ref<InstanceType<typeof ReportModal>>();

// 计算属性
const postId = computed(() => parseInt(route.params.id as string));

const isAuthor = computed(() => {
  return post.value?.authorId === userStore.user?.id;
});

const authorAvatar = computed(() => {
  const raw =
    post.value?.author?.avatarUrl ||
    post.value?.author?.profilePicture ||
    undefined;
  return resolveAvatarUrl(raw);
});

const updateCommentTree = (
  list: Comment[],
  targetId: number,
  updater: (comment: Comment) => void,
): boolean => {
  for (const comment of list) {
    if (comment.id === targetId) {
      updater(comment);
      return true;
    }
    if (comment.replies && updateCommentTree(comment.replies, targetId, updater)) {
      return true;
    }
  }
  return false;
};

const removeCommentFromTree = (list: Comment[], targetId: number): boolean => {
  const index = list.findIndex((comment) => comment.id === targetId);
  if (index !== -1) {
    list.splice(index, 1);
    return true;
  }
  for (const comment of list) {
    if (comment.replies && removeCommentFromTree(comment.replies, targetId)) {
      return true;
    }
  }
  return false;
};

// 方法
const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    tech_discussion: "技术讨论",
    experience_sharing: "经验分享",
    q_a: "问答求助",
    resource_sharing: "资源分享",
  };
  return categoryMap[category] || "未分类";
};

const getTagList = (tags: string): string[] => {
  return tags
    ? tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    : [];
};

const formatTime = (timeStr: string): string => {
  const date = new Date(timeStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const loadPost = async () => {
  try {
    loading.value = true;
    error.value = "";

    post.value = await forumService.getPost(postId.value);

    // 更新页面标题
    document.title = `${post.value.title} - 壁纸论坛`;

    // 检查点赞状态
    if (userStore.isLoggedIn) {
      await checkLikeStatus();
    }
  } catch (err: any) {
    console.error("加载帖子失败:", err);
    error.value = err.message || "帖子加载失败";
  } finally {
    loading.value = false;
  }
};

const loadComments = async (reset: boolean = true) => {
  if (!post.value) return;

  try {
    if (reset) {
      currentPage.value = 1;
      loadingMore.value = false;
      comments.value = []; // 重置评论列表
    }

    const sortOptions: Record<string, any> = {
      newest: { sortBy: "createdAt", sortOrder: "DESC" as const },
      oldest: { sortBy: "createdAt", sortOrder: "ASC" as const },
      popular: { sortBy: "likeCount", sortOrder: "DESC" as const },
    };

    const result = await forumService.getPostComments(post.value.id, {
      page: currentPage.value,
      limit: 20,
      ...sortOptions[commentSort.value],
    });

    console.log("评论加载结果:", result);

    if (result && result.data) {
      if (reset) {
        comments.value = result.data;
      } else {
        comments.value = [...comments.value, ...result.data];
      }

      hasMoreComments.value =
        result.pagination.currentPage < result.pagination.totalPages;
    } else {
      console.warn("评论数据格式不正确:", result);
      if (reset) {
        comments.value = [];
      }
    }
  } catch (err: any) {
    console.error("加载评论失败:", err);
    // 显示错误提示
    if (reset) {
      comments.value = [];
    }
    // 可以在这里添加用户友好的错误提示
    // alert(err.message || "加载评论失败，请稍后重试");
  }
};

const loadMoreComments = async () => {
  if (loadingMore.value || !hasMoreComments.value) return;

  try {
    loadingMore.value = true;
    currentPage.value++;
    await loadComments(false);
  } finally {
    loadingMore.value = false;
  }
};

const checkLikeStatus = async () => {
  try {
    const status = await forumService.checkLikeStatus(postId.value);
    isLiked.value = status.hasLiked;
  } catch (err) {
    console.error("检查点赞状态失败:", err);
  }
};

const toggleLike = async () => {
  if (!userStore.isLoggedIn || !post.value) return;

  try {
    likeLoading.value = true;

    if (isLiked.value) {
      await forumService.unlikePost(postId.value);
      isLiked.value = false;
      post.value.likeCount = Math.max(0, (post.value.likeCount || 0) - 1);
    } else {
      await forumService.likePost(postId.value);
      isLiked.value = true;
      post.value.likeCount = (post.value.likeCount || 0) + 1;
    }
  } catch (err: any) {
    console.error("点赞操作失败:", err);
    alert(err.message || "操作失败");
  } finally {
    likeLoading.value = false;
  }
};

const submitComment = async () => {
  if (!userStore.isLoggedIn || !post.value || !newComment.value.trim()) return;

  try {
    commentSubmitting.value = true;

    const comment = await forumService.createComment({
      content: newComment.value.trim(),
      postId: post.value.id,
    });

    comments.value.unshift(comment);
    newComment.value = "";

    // 更新帖子评论数
    if (post.value) {
      post.value.commentCount = (post.value.commentCount || 0) + 1;
    }
  } catch (err: any) {
    console.error("发表评论失败:", err);
    alert(err.message || "发表评论失败");
  } finally {
    commentSubmitting.value = false;
  }
};

const handleCommentLike = async (comment: Comment) => {
  try {
    const result = await forumService.toggleCommentLike(comment.id);
    updateCommentTree(comments.value, comment.id, (target) => {
      target.likeCount = result.likeCount;
      target.isLiked = result.isLiked;
    });
  } catch (err: any) {
    console.error("评论点赞失败:", err);
    alert(err.message || "操作失败");
  }
};

const handleCommentEdit = (updatedComment: Comment) => {
  updateCommentTree(comments.value, updatedComment.id, (target) => {
    Object.assign(target, updatedComment);
  });
};

const handleCommentDelete = (comment: Comment) => {
  if (removeCommentFromTree(comments.value, comment.id) && post.value) {
    post.value.commentCount = Math.max(0, (post.value.commentCount || 0) - 1);
  }
};

const handleCommentReply = (_comment?: Comment) => {
  // 回复后刷新评论列表
  loadComments();
};

const openReportModal = () => {
  reportModalRef.value?.openModal();
};

const handleReportSuccess = () => {
  // 举报成功后的处理，可以刷新评论列表或显示通知
  console.log("举报成功");
};

const editPost = () => {
  if (post.value) {
    router.push(`/forums/edit/${post.value.id}`);
  }
};

const deletePost = async () => {
  if (!post.value || !confirm("确定要删除这篇帖子吗？删除后无法恢复。")) return;

  try {
    await forumService.deletePost(post.value.id);
    alert("帖子已删除");
    router.push("/forums");
  } catch (err: any) {
    console.error("删除帖子失败:", err);
    alert(err.message || "删除失败");
  }
};

const shareToWeChat = () => {
  alert("请使用微信扫一扫功能分享");
};

const shareToWeibo = () => {
  if (post.value) {
    const url = window.location.href;
    const title = post.value.title;
    window.open(
      `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    );
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert("链接已复制到剪贴板");
  } catch (_err) {
    alert("复制失败，请手动复制链接");
  }
};

// 生命周期
onMounted(async () => {
  await loadPost();
  // 确保帖子加载完成后再加载评论
  if (post.value) {
    await loadComments();
  }
});

// 监听路由参数变化
watch(
  () => route.params.id,
  async () => {
    await loadPost();
    // 确保帖子加载完成后再加载评论
    if (post.value) {
      await loadComments();
    }
  },
);
</script>

<style scoped>
.prose {
  color: inherit;
}

.prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

.prose :deep(blockquote) {
  border-left: 4px solid rgb(209 213 219);
  padding-left: 1rem;
  font-style: italic;
}

.prose :deep(code) {
  background-color: rgb(243 244 246);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.prose :deep(pre) {
  background-color: rgb(243 244 246);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose :deep(pre code) {
  background: transparent;
  padding: 0;
}

.prose :deep(a) {
  color: rgb(59 130 246);
  text-decoration: none;
}

.prose :deep(a:hover) {
  text-decoration: underline;
}

.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid rgb(209 213 219);
}

.prose :deep(th),
.prose :deep(td) {
  border: 1px solid rgb(209 213 219);
  padding: 0.5rem 1rem;
}

.prose :deep(th) {
  background-color: rgb(249 250 251);
  font-weight: 600;
}
</style>
