<template>
  <div class="min-h-screen bg-base-200">
    <!-- 导航栏 -->
    <nav class="navbar bg-base-100 shadow-sm">
      <div class="flex-1">
        <h1 class="text-xl font-bold">社区论坛</h1>
      </div>
      <div class="flex-none">
        <button 
          class="btn btn-primary"
          @click="showCreateModal = true"
          v-if="userStore.isLoggedIn"
        >
          <i class="i-mdi-plus text-lg"></i>
          发帖
        </button>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <!-- 论坛分类 -->
      <div class="tabs tabs-boxed mb-6">
        <button 
          class="tab"
          :class="{ 'tab-active': activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          全部
        </button>
        <button 
          class="tab"
          :class="{ 'tab-active': activeCategory === 'discussion' }"
          @click="activeCategory = 'discussion'"
        >
          讨论
        </button>
        <button 
          class="tab"
          :class="{ 'tab-active': activeCategory === 'help' }"
          @click="activeCategory = 'help'"
        >
          求助
        </button>
        <button 
          class="tab"
          :class="{ 'tab-active': activeCategory === 'share' }"
          @click="activeCategory = 'share'"
        >
          分享
        </button>
      </div>

      <!-- 帖子列表 -->
      <div class="space-y-4">
        <div 
          v-for="post in filteredPosts" 
          :key="post.id"
          class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          @click="viewPost(post.id)"
        >
          <div class="card-body">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h2 class="card-title text-lg">{{ post.title }}</h2>
                <p class="text-gray-700 line-clamp-2">{{ post.content }}</p>
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <i class="i-mdi-comment"></i>
                  {{ post.commentCount }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="i-mdi-heart"></i>
                  {{ post.likeCount }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center gap-2">
                <div class="avatar">
                  <div class="w-6 h-6 rounded-full">
                    <img :src="post.author.avatar" :alt="post.author.name" />
                  </div>
                </div>
                <span>{{ post.author.name }}</span>
                <span>•</span>
                <span>{{ formatTime(post.createTime) }}</span>
              </div>
              
              <span class="badge badge-outline">{{ post.category }}</span>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredPosts.length === 0" class="text-center py-12">
          <i class="i-mdi-forum-outline text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">暂无帖子</p>
          <button 
            class="btn btn-primary mt-4"
            @click="showCreateModal = true"
            v-if="userStore.isLoggedIn"
          >
            发布第一个帖子
          </button>
          <div v-else class="mt-4">
            <p class="text-gray-500">登录后可以发帖和参与讨论</p>
            <button 
              class="btn btn-primary mt-2"
              @click="$router.push('/auth/login')"
            >
              立即登录
            </button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center mt-8" v-if="filteredPosts.length > 0">
        <div class="join">
          <button class="join-item btn" :disabled="currentPage === 1" @click="currentPage--">
            «
          </button>
          <button class="join-item btn" v-for="page in totalPages" :key="page" 
            :class="{ 'btn-active': page === currentPage }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button class="join-item btn" :disabled="currentPage === totalPages" @click="currentPage++">
            »
          </button>
        </div>
      </div>
    </div>

    <!-- 发帖模态框 -->
    <div class="modal" :class="{ 'modal-open': showCreateModal }">
      <div class="modal-box">
        <h3 class="font-bold text-lg">发布新帖子</h3>
        
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text">标题</span>
          </label>
          <input
            type="text"
            v-model="newPost.title"
            placeholder="请输入帖子标题"
            class="input input-bordered"
            :class="{ 'input-error': postErrors.title }"
          />
          <label class="label" v-if="postErrors.title">
            <span class="label-text-alt text-error">{{ postErrors.title }}</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">内容</span>
          </label>
          <textarea
            v-model="newPost.content"
            placeholder="请输入帖子内容..."
            class="textarea textarea-bordered h-32"
            :class="{ 'textarea-error': postErrors.content }"
          ></textarea>
          <label class="label" v-if="postErrors.content">
            <span class="label-text-alt text-error">{{ postErrors.content }}</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">分类</span>
          </label>
          <select 
            v-model="newPost.category"
            class="select select-bordered"
            :class="{ 'select-error': postErrors.category }"
          >
            <option value="" disabled>请选择分类</option>
            <option value="discussion">讨论</option>
            <option value="help">求助</option>
            <option value="share">分享</option>
          </select>
          <label class="label" v-if="postErrors.category">
            <span class="label-text-alt text-error">{{ postErrors.category }}</span>
          </label>
        </div>

        <div class="modal-action">
          <button class="btn btn-ghost" @click="showCreateModal = false">取消</button>
          <button 
            class="btn btn-primary"
            :class="{ 'loading': postLoading }"
            @click="createPost"
          >
            发布
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

const activeCategory = ref('all')
const currentPage = ref(1)
const showCreateModal = ref(false)
const postLoading = ref(false)

// 模拟帖子数据
const posts = ref([
  {
    id: 1,
    title: '分享一些4K壁纸制作技巧',
    content: '最近在研究4K壁纸制作，发现了一些不错的技巧和大家分享。首先要选择合适的原始素材，分辨率要足够高...',
    category: 'share',
    author: {
      id: 1,
      name: '星空爱好者',
      avatar: 'https://picsum.photos/100/100?random=1'
    },
    createTime: '2024-01-15T10:30:00',
    commentCount: 8,
    likeCount: 15
  },
  {
    id: 2,
    title: '求推荐适合编程的暗色系壁纸',
    content: '长时间编程需要保护眼睛，大家有没有好的暗色系壁纸推荐？最好是深色背景，对比度适中的...',
    category: 'help',
    author: {
      id: 2,
      name: '程序员小张',
      avatar: 'https://picsum.photos/100/100?random=2'
    },
    createTime: '2024-01-14T15:20:00',
    commentCount: 12,
    likeCount: 23
  },
  {
    id: 3,
    title: '大家最喜欢哪种风格的壁纸？',
    content: '想了解一下大家都喜欢什么风格的壁纸？是风景、抽象、动漫还是其他风格？一起来讨论吧！',
    category: 'discussion',
    author: {
      id: 3,
      name: '壁纸收藏家',
      avatar: 'https://picsum.photos/100/100?random=3'
    },
    createTime: '2024-01-13T09:45:00',
    commentCount: 25,
    likeCount: 34
  }
])

// 新帖子数据
const newPost = reactive({
  title: '',
  content: '',
  category: ''
})

// 错误信息
const postErrors = reactive({
  title: '',
  content: '',
  category: ''
})

// 过滤后的帖子
const filteredPosts = computed(() => {
  let filtered = posts.value
  
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(post => post.category === activeCategory.value)
  }
  
  // 简单的分页逻辑
  const start = (currentPage.value - 1) * 10
  const end = start + 10
  return filtered.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  let filtered = posts.value
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(post => post.category === activeCategory.value)
  }
  return Math.ceil(filtered.length / 10)
})

// 格式化时间
const formatTime = (timeString: string) => {
  const time = new Date(timeString)
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
  
  return time.toLocaleDateString()
}

// 查看帖子详情
const viewPost = (postId: number) => {
  router.push(`/forums/post/${postId}`)
}

// 验证发帖表单
const validatePost = () => {
  let isValid = true
  
  // 清空错误信息
  Object.keys(postErrors).forEach(key => {
    postErrors[key as keyof typeof postErrors] = ''
  })
  
  // 验证标题
  if (!newPost.title.trim()) {
    postErrors.title = '标题不能为空'
    isValid = false
  } else if (newPost.title.length > 100) {
    postErrors.title = '标题不能超过100个字符'
    isValid = false
  }
  
  // 验证内容
  if (!newPost.content.trim()) {
    postErrors.content = '内容不能为空'
    isValid = false
  } else if (newPost.content.length > 2000) {
    postErrors.content = '内容不能超过2000个字符'
    isValid = false
  }
  
  // 验证分类
  if (!newPost.category) {
    postErrors.category = '请选择分类'
    isValid = false
  }
  
  return isValid
}

// 创建帖子
const createPost = async () => {
  if (!validatePost()) return
  
  postLoading.value = true
  
  try {
    // 这里应该调用创建帖子的API
    // const response = await api.post('/forums/posts', newPost)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 添加到帖子列表
    posts.value.unshift({
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author: {
        id: userStore.user?.id || 0,
        name: userStore.user?.username || '匿名用户',
        avatar: userStore.userAvatar
      },
      createTime: new Date().toISOString(),
      commentCount: 0,
      likeCount: 0
    })
    
    // 重置表单
    newPost.title = ''
    newPost.content = ''
    newPost.category = ''
    showCreateModal.value = false
    
    alert('帖子发布成功！')
  } catch (error: any) {
    console.error('发布失败:', error)
    alert(error.message || '发布失败，请重试')
  } finally {
    postLoading.value = false
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 卡片悬停效果 */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-1px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .tabs {
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
