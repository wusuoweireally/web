<template>
  <div
    class="min-h-screen bg-gradient-to-b from-base-100 via-base-200 to-base-300"
  >
    
    <section class="mx-auto w-full max-w-6xl px-4 py-8">
      <div
        class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-lg"
      >
        <div class="space-y-2">
          <p class="text-xs font-semibold tracking-[0.3em] text-white/80 uppercase">
            壁纸社区
          </p>
          <h1 class="text-2xl font-bold">发现与分享</h1>
          <p class="max-w-3xl text-sm text-white/80">
            记录创意、交流经验、寻找灵感
          </p>
        </div>
      </div>
    </section>

    <div
      class="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-12 lg:grid-cols-[3fr_1fr]"
    >
      <section class="space-y-4">
        <div class="rounded-2xl bg-base-100/80 p-4 shadow-sm">
          <div
            class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <h2 class="text-xl font-semibold text-base-content">全部讨论</h2>
              <p class="text-xs text-base-content/60">发现精彩内容</p>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label class="input-bordered input input-sm flex items-center gap-2 w-full sm:w-auto">
                <i class="i-mdi-magnify text-base-content/60"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索帖子..."
                  class="grow"
                  @input="handleSearch"
                />
              </label>
              <button class="btn btn-sm btn-primary gap-1" @click="handleCreatePost">
                <i class="i-mdi-plus text-base"></i>
                <span>发帖</span>
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-base-100/80 p-3 shadow-sm">
          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="tabs tabs-boxed bg-transparent gap-1 p-1">
              <button
                v-for="category in forumStore.postCategories"
                :key="category.value"
                class="tab tab-sm"
                :class="{
                  'tab-active': forumStore.filters.category === category.value,
                }"
                @click="handleCategoryChange(category.value)"
              >
                {{ category.label }}
              </button>
            </div>
            <div class="flex gap-2">
              <select
                v-model="forumStore.filters.sortBy"
                class="select-bordered select select-sm min-w-[120px]"
                @change="handleSortChange"
              >
                <option value="createdAt">最新</option>
                <option value="viewCount">最热</option>
                <option value="likeCount">点赞</option>
                <option value="commentCount">评论</option>
              </select>
            </div>
          </div>
        </div>

        <div
          v-if="forumStore.loading"
          class="flex min-h-[40vh] items-center justify-center rounded-2xl bg-base-100/80 shadow"
        >
          <span class="loading loading-lg loading-spinner text-primary"></span>
        </div>
        <div
          v-else-if="forumStore.error"
          class="rounded-2xl bg-error/10 p-6 text-error shadow"
        >
          <div class="flex items-center gap-3">
            <i class="i-mdi-alert-circle text-2xl"></i>
            <span>{{ forumStore.error }}</span>
            <button class="btn btn-sm" @click="fetchPosts">重试</button>
          </div>
        </div>
        <div v-else class="space-y-4">
          <PostCard
            v-for="post in forumStore.filteredPosts"
            :key="post.id"
            :post="post"
            @like="handleLike"
            @comment="handleComment"
            @edit="handleEdit"
            @delete="handleDelete"
            @share="handleShare"
          />
          <div
            v-if="forumStore.filteredPosts.length === 0"
            class="rounded-2xl bg-base-100/80 p-10 text-center shadow"
          >
            <i
              class="i-mdi-forum-outline mb-4 text-6xl text-base-content/20"
            ></i>
            <p class="text-lg text-base-content/70">
              {{
                forumStore.filters.search
                  ? "没有找到相关帖子"
                  : "暂时还没有帖子，来分享第一个吧！"
              }}
            </p>
            <div class="mt-4 flex justify-center gap-2">
              <button class="btn btn-primary" @click="handleCreatePost">
                发布帖子
              </button>
              <button
                class="btn btn-outline"
                v-if="forumStore.filters.search"
                @click="forumStore.resetFilters()"
              >
                清除筛选
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="
            forumStore.filteredPosts.length > 0 &&
            forumStore.postsPagination.totalPages > 1
          "
          class="flex justify-center"
        >
          <div class="join">
            <button
              class="btn join-item btn-sm"
              :disabled="forumStore.postsPagination.currentPage === 1"
              @click="goToPage(forumStore.postsPagination.currentPage - 1)"
            >
              «
            </button>
            <button
              v-for="(page, index) in visiblePages"
              :key="
                typeof page === 'number' ? `page-${page}` : `ellipsis-${index}`
              "
              class="btn join-item btn-sm"
              :class="{
                'btn-active': page === forumStore.postsPagination.currentPage,
                'btn-disabled': typeof page === 'string',
              }"
              @click="typeof page === 'number' ? goToPage(page) : undefined"
            >
              {{ page }}
            </button>
            <button
              class="btn join-item btn-sm"
              :disabled="
                forumStore.postsPagination.currentPage ===
                forumStore.postsPagination.totalPages
              "
              @click="goToPage(forumStore.postsPagination.currentPage + 1)"
            >
              »
            </button>
          </div>
        </div>
      </section>

      <aside class="space-y-4">
        <div class="rounded-2xl bg-base-100/80 p-4 shadow-sm border border-base-200/50">
          <div class="flex items-center gap-2 mb-3">
            <i class="i-mdi-fire text-primary"></i>
            <h3 class="text-sm font-semibold text-base-content">热门帖子</h3>
          </div>
          <ul class="space-y-3">
            <li
              v-for="(post, index) in forumStore.popularPosts"
              :key="`popular-${post.id}`"
              class="group cursor-pointer rounded-xl p-3 transition hover:bg-base-200/50"
              @click="$router.push(`/forums/post/${post.id}`)"
            >
              <div class="flex items-start gap-3">
                <span class="text-xs font-bold text-primary/60 w-4 flex-shrink-0 mt-0.5">
                  {{ index + 1 }}
                </span>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-base-content group-hover:text-primary line-clamp-2 transition-colors"
                  >
                    {{ post.title }}
                  </p>
                  <div
                    class="mt-1.5 flex items-center gap-3 text-xs text-base-content/50"
                  >
                    <div class="flex items-center gap-1">
                      <i class="i-mdi-eye text-xs"></i>
                      <span>{{ formatNumber(post.viewCount) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <i class="i-mdi-heart text-xs"></i>
                      <span>{{ formatNumber(post.likeCount) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useForumStore } from "@/stores/forum";
import { useUserStore } from "@/stores";
import { forumService } from "@/services/forum";
import PostCard from "@/components/PostCard.vue";
import type { Post } from "@/stores/forum";

defineOptions({ name: "ForumIndex" });

const router = useRouter();
const forumStore = useForumStore();
const userStore = useUserStore();

const searchQuery = ref("");
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const visiblePages = computed(() => {
  const current = forumStore.postsPagination.currentPage;
  const total = forumStore.postsPagination.totalPages;
  const delta = 2;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= total; i += 1) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  });

  return rangeWithDots;
});

const fetchPosts = async (reset = false) => {
  if (reset) {
    forumStore.setPostsPagination({ currentPage: 1 });
  }

  try {
    forumStore.setLoading(true);
    forumStore.setError(null);

    const { data, pagination } = await forumService.getPosts({
      page: forumStore.postsPagination.currentPage,
      limit: forumStore.postsPagination.pageSize,
      sortBy: forumStore.filters.sortBy,
      sortOrder: forumStore.filters.sortOrder as "ASC" | "DESC",
      category: forumStore.filters.category || undefined,
      search: forumStore.filters.search || undefined,
    });

    forumStore.setPosts(data);
    forumStore.setPostsPagination({
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalCount: pagination.totalCount,
    });
  } catch (error) {
    console.error("获取帖子失败:", error);
    forumStore.setError("获取帖子失败，请稍后重试");
  } finally {
    forumStore.setLoading(false);
  }
};

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    forumStore.updateFilters({ search: searchQuery.value });
    fetchPosts(true);
  }, 500);
};

const handleCategoryChange = (category: string) => {
  const newCategory = forumStore.filters.category === category ? "" : category;
  forumStore.updateFilters({ category: (newCategory as any) || "" });
  fetchPosts(true);
};

const handleSortChange = () => {
  fetchPosts(true);
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= forumStore.postsPagination.totalPages) {
    forumStore.setPostsPagination({ currentPage: page });
    fetchPosts();
  }
};

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const handleCreatePost = () => {
  if (!userStore.isLoggedIn) {
    router.push("/auth/login");
    return;
  }
  router.push("/forums/new");
};

const handleLike = async (post: Post) => {
  if (!userStore.isLoggedIn) {
    router.push("/auth/login");
    return;
  }
  try {
    const hasLiked = post.isLiked;
    if (hasLiked) {
      await forumService.unlikePost(post.id);
      forumStore.togglePostLike(post.id, false);
    } else {
      await forumService.likePost(post.id);
      forumStore.togglePostLike(post.id, true);
    }
  } catch (error) {
    console.error("点赞操作失败:", error);
  }
};

const handleComment = (post: Post) => {
  router.push(`/forums/post/${post.id}#comments`);
};

const handleEdit = (post: Post) => {
  router.push(`/forums/edit/${post.id}`);
};

const handleDelete = async (post: Post) => {
  try {
    await forumService.deletePost(post.id);
    forumStore.setPosts(forumStore.posts.filter((p) => p.id !== post.id));
  } catch (error) {
    console.error("删除帖子失败:", error);
  }
};

const handleShare = (post: Post) => {
  const shareUrl = `${window.location.origin}/forums/post/${post.id}`;
  if (navigator.share) {
    navigator.share({
      title: post.title,
      text: post.summary || post.title,
      url: shareUrl,
    });
  } else {
    navigator.clipboard.writeText(shareUrl);
    alert("链接已复制到剪贴板");
  }
};

onMounted(() => {
  const route = router.currentRoute.value;
  if (route.query.category) {
    forumStore.updateFilters({ category: route.query.category as string });
  }
  if (route.query.search) {
    searchQuery.value = route.query.search as string;
    forumStore.updateFilters({ search: route.query.search as string });
  }
  fetchPosts();
});

onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
    searchTimeout.value = null;
  }
});

watch(
  () => router.currentRoute.value.query,
  (newQuery) => {
    if (newQuery.category !== forumStore.filters.category) {
      forumStore.updateFilters({
        category: (newQuery.category as string) || "",
      });
      fetchPosts(true);
    }
    if (newQuery.search !== forumStore.filters.search) {
      searchQuery.value = (newQuery.search as string) || "";
      forumStore.updateFilters({ search: (newQuery.search as string) || "" });
      fetchPosts(true);
    }
  },
);
</script>
