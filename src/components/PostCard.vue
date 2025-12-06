<template>
  <div
    class="group rounded-2xl bg-base-100/90 border border-base-200/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    @click="handlePostClick"
  >
    <div class="p-5">
      <!-- 帖子头部：分类、置顶/精华和发布时间 -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2 flex-wrap">
          <span
            :class="`badge badge-sm ${forumStore.categoryColor(post.category)} badge-outline`"
          >
            {{ forumStore.categoryLabel(post.category) }}
          </span>
          <span
            v-if="post.isPinned"
            class="badge badge-sm badge-warning/80 badge-outline"
          >
            <i class="i-mdi-pin text-xs mr-1"></i>
            置顶
          </span>
          <span
            v-if="post.isFeatured"
            class="badge badge-sm badge-primary/80 badge-outline"
          >
            <i class="i-mdi-star text-xs mr-1"></i>
            精华
          </span>
        </div>
        <div class="text-xs text-base-content/60">
          {{ formatTime(post.createdAt) }}
        </div>
      </div>

      <!-- 帖子标题 -->
      <h3 class="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {{ post.title }}
      </h3>

      <!-- 帖子摘要 -->
      <p
        v-if="post.summary"
        class="text-sm text-base-content/70 mb-3 line-clamp-2"
      >
        {{ post.summary }}
      </p>
      <p
        v-else
        class="text-sm text-base-content/70 mb-3 line-clamp-2"
        v-html="stripHtml(post.content)"
      ></p>

      <!-- 标签 -->
      <div
        v-if="post.tags"
        class="flex flex-wrap gap-1.5 mb-3"
      >
        <span
          v-for="tag in post.tags.split(',').slice(0, 3)"
          :key="tag.trim()"
          class="badge badge-ghost badge-xs text-xs"
        >
          {{ tag.trim() }}
        </span>
        <span
          v-if="post.tags.split(',').length > 3"
          class="badge badge-ghost badge-xs text-xs"
        >
          +{{ post.tags.split(',').length - 3 }}
        </span>
      </div>

      <!-- 帖子底部：作者和统计信息 -->
      <div class="flex items-center justify-between pt-3 mt-3 border-t border-base-200/60">
        <!-- 作者信息 -->
        <div class="flex items-center gap-2">
          <div class="avatar avatar-xs">
            <div
              v-if="authorAvatar"
              class="w-7 h-7 rounded-full overflow-hidden border border-base-200 bg-base-100"
            >
              <img :src="authorAvatar" :alt="post.author?.username || '用户头像'" class="h-full w-full object-cover" />
            </div>
            <div
              v-else
              class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <span class="text-xs font-semibold text-primary">
                {{ post.author?.username?.charAt(0)?.toUpperCase() || 'U' }}
              </span>
            </div>
          </div>
          <span class="text-xs text-base-content/70">
            {{ post.author?.username || '匿名用户' }}
          </span>
        </div>

        <!-- 统计信息和操作 -->
        <div class="flex items-center gap-4">
          <!-- 浏览数 -->
          <div class="flex items-center gap-1 text-xs text-base-content/50">
            <i class="i-mdi-eye text-sm"></i>
            <span>{{ formatNumber(post.viewCount) }}</span>
          </div>

          <!-- 点赞数 -->
          <button
            class="flex items-center gap-1 text-xs transition-colors"
            :class="post.isLiked ? 'text-primary' : 'text-base-content/50 hover:text-primary'"
            @click.stop="handleLike"
            :disabled="loading"
          >
            <i class="i-mdi-heart text-sm"></i>
            <span>{{ formatNumber(post.likeCount) }}</span>
          </button>

          <!-- 评论数 -->
          <button
            class="flex items-center gap-1 text-xs text-base-content/50 hover:text-primary transition-colors"
            @click.stop="handleComment"
          >
            <i class="i-mdi-comment-outline text-sm"></i>
            <span>{{ formatNumber(post.commentCount) }}</span>
          </button>

          <!-- 分享 -->
          <button
            class="btn btn-xs btn-ghost btn-circle text-base-content/50 hover:text-primary"
            @click.stop="handleShare"
          >
            <i class="i-mdi-share-variant text-sm"></i>
          </button>

          <!-- 作者操作菜单 -->
          <div
            v-if="isAuthor"
            class="dropdown dropdown-end"
            @click.stop
          >
            <label
              tabindex="0"
              class="btn btn-xs btn-ghost btn-circle text-base-content/50 hover:text-primary"
            >
              <i class="i-mdi-dots-horizontal text-sm"></i>
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu p-1.5 shadow-lg bg-base-100 rounded-box w-36 border border-base-200"
            >
              <li>
                <a
                  class="text-sm"
                  @click="handleEdit"
                >
                  <i class="i-mdi-pencil-outline"></i>
                  编辑
                </a>
              </li>
              <li>
                <a
                  class="text-sm text-error"
                  @click="handleDelete"
                >
                  <i class="i-mdi-delete-outline"></i>
                  删除
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 最后评论信息 -->
      <div
        v-if="post.lastCommentAt"
        class="flex items-center gap-1 mt-2 text-xs text-base-content/40"
      >
        <i class="i-mdi-clock-outline text-xs"></i>
        <span>最后回复于 {{ formatTime(post.lastCommentAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForumStore } from '@/stores/forum';
import { useUserStore } from '@/stores';
import { forumService } from '@/services/forum';
import type { Post } from '@/stores/forum';
import { resolveAvatarUrl } from '@/utils/avatar';

// 组件属性
interface Props {
  post: Post;
  showActions?: boolean; // 是否显示操作按钮
  compact?: boolean; // 是否为紧凑模式
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  compact: false,
});

// 组件事件
const emit = defineEmits<{
  like: [post: Post];
  comment: [post: Post];
  edit: [post: Post];
  delete: [post: Post];
  share: [post: Post];
}>();

// 组合式API
const router = useRouter();
const forumStore = useForumStore();
const userStore = useUserStore();

// 响应式数据
const loading = ref(false);

// 计算属性
const isAuthor = computed(() => {
  return props.post.authorId === userStore.user?.id;
});

const authorAvatar = computed(() => {
  const raw =
    props.post.author?.avatarUrl ||
    props.post.author?.profilePicture ||
    undefined;
  return resolveAvatarUrl(raw);
});

// 注意：categoryLabel 和 categoryColor 是 store 中的计算属性，返回函数
// 在模板中可以直接使用 forumStore.categoryLabel 和 forumStore.categoryColor

// 方法
const handlePostClick = () => {
  router.push(`/forums/post/${props.post.id}`);
};

const handleLike = async () => {
  if (!userStore.isLoggedIn) {
    router.push('/auth/login');
    return;
  }

  try {
    loading.value = true;
    const postId = props.post.id;

    if (props.post.isLiked) {
      await forumService.unlikePost(postId);
      forumStore.togglePostLike(postId, false);
    } else {
      await forumService.likePost(postId);
      forumStore.togglePostLike(postId, true);
    }

    emit('like', props.post);
  } catch (error) {
    console.error('点赞操作失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleComment = () => {
  emit('comment', props.post);
  router.push(`/forums/post/${props.post.id}#comments`);
};

const handleEdit = () => {
  emit('edit', props.post);
  router.push(`/forums/edit/${props.post.id}`);
};

const handleDelete = async () => {
  if (!confirm('确定要删除这个帖子吗？')) {
    return;
  }

  try {
    loading.value = true;
    await forumService.deletePost(props.post.id);
    emit('delete', props.post);

    // 显示成功提示
    // 这里可以添加 toast 或其他提示组件
  } catch (error) {
    console.error('删除帖子失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleShare = () => {
  emit('share', props.post);

  // 实现分享功能
  const shareUrl = `${window.location.origin}/forums/post/${props.post.id}`;

  if (navigator.share) {
    navigator.share({
      title: props.post.title,
      text: props.post.summary || props.post.title,
      url: shareUrl,
    });
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(shareUrl);
    // 这里可以添加 toast 提示
  }
};

// 辅助函数
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const stripHtml = (html: string) => {
  // 简单的HTML标签移除
  return html.replace(/<[^>]*>/g, '').substring(0, 200);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
