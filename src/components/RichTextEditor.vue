<template>
  <div class="rich-text-editor">
    <!-- 工具栏 -->
    <div class="toolbar flex flex-wrap items-center gap-1 p-2 bg-base-100 border border-b-0 rounded-t-lg">
      <!-- 基础格式 -->
      <div class="toolbar-group">
        <button
          class="toolbar-btn"
          :class="{ active: isFormatActive('bold') }"
          @click="formatText('bold')"
          title="粗体 (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          class="toolbar-btn"
          :class="{ active: isFormatActive('italic') }"
          @click="formatText('italic')"
          title="斜体 (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          class="toolbar-btn"
          :class="{ active: isFormatActive('underline') }"
          @click="formatText('underline')"
          title="下划线 (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          class="toolbar-btn"
          :class="{ active: isFormatActive('strikeThrough') }"
          @click="formatText('strikeThrough')"
          title="删除线"
        >
          <s>S</s>
        </button>
      </div>

      <div class="divider divider-horizontal"></div>

      <!-- 标题级别 -->
      <div class="toolbar-group">
        <select
          class="select select-sm select-bordered"
          @change="formatHeading"
          :value="currentHeading"
        >
          <option value="">正文</option>
          <option value="h1">标题 1</option>
          <option value="h2">标题 2</option>
          <option value="h3">标题 3</option>
          <option value="h4">标题 4</option>
        </select>
      </div>

      <div class="divider divider-horizontal"></div>

      <!-- 列表 -->
      <div class="toolbar-group">
        <button
          class="toolbar-btn"
          :class="{ active: isFormatActive('insertUnorderedList') }"
          @click="formatText('insertUnorderedList')"
          title="无序列表"
        >
          • 列表
        </button>
        <button
          class="toolbar-btn"
          :class="{ active: isFormatActive('insertOrderedList') }"
          @click="formatText('insertOrderedList')"
          title="有序列表"
        >
          1. 列表
        </button>
      </div>

      <div class="divider divider-horizontal"></div>

      <!-- 对齐 -->
      <div class="toolbar-group">
        <button
          class="toolbar-btn"
          @click="formatText('justifyLeft')"
          title="左对齐"
        >
          ⬅️
        </button>
        <button
          class="toolbar-btn"
          @click="formatText('justifyCenter')"
          title="居中对齐"
        >
          ⬌
        </button>
        <button
          class="toolbar-btn"
          @click="formatText('justifyRight')"
          title="右对齐"
        >
          ➡️
        </button>
      </div>

      <div class="divider divider-horizontal"></div>

      <!-- 链接和图片 -->
      <div class="toolbar-group">
        <button
          class="toolbar-btn"
          @click="insertLink"
          title="插入链接"
        >
          🔗
        </button>
        <button
          class="toolbar-btn"
          @click="insertImage"
          title="插入图片"
        >
          🖼️
        </button>
      </div>

      <div class="divider divider-horizontal"></div>

      <!-- 代码 -->
      <div class="toolbar-group">
        <button
          class="toolbar-btn"
          @click="formatCode"
          title="插入代码"
        >
          &lt;/&gt;
        </button>
        <button
          class="toolbar-btn"
          @click="formatBlockquote"
          title="引用"
        >
          ❝
        </button>
      </div>

      <!-- 其他操作 -->
      <div class="toolbar-group ml-auto">
        <button
          class="toolbar-btn"
          @click="undo"
          title="撤销 (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          class="toolbar-btn"
          @click="redo"
          title="重做 (Ctrl+Y)"
        >
          ↷
        </button>
        <button
          class="toolbar-btn"
          @click="clearFormat"
          title="清除格式"
        >
          🧹
        </button>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-container relative">
      <div
        ref="editorRef"
        class="editor-content min-h-[300px] p-4 bg-base-50 border border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
        contenteditable="true"
        @input="handleInput"
        @keydown="handleKeydown"
        @paste="handlePaste"
        @focus="isFocused = true"
        @blur="isFocused = false"
      ></div>

      <!-- 占位符 -->
      <div
        v-if="showPlaceholder"
        class="absolute inset-0 p-4 pointer-events-none text-gray-400"
      >
        {{ placeholder }}
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="editor-status flex items-center justify-between p-2 text-xs text-gray-500">
      <div class="flex items-center gap-4">
        <!-- 字数统计 -->
        <span>{{ wordCount }} 字</span>
        <!-- 字符统计 -->
        <span>{{ charCount }} 字符</span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Markdown提示 -->
        <span class="text-xs">支持 Markdown 语法</span>
      </div>
    </div>

    <!-- 插入链接对话框 -->
    <dialog
      ref="linkModal"
      class="modal"
    >
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">插入链接</h3>
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">链接文字</span>
          </label>
          <input
            v-model="linkText"
            type="text"
            class="input input-bordered"
            placeholder="请输入链接文字"
          />
        </div>
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">链接地址</span>
          </label>
          <input
            v-model="linkUrl"
            type="url"
            class="input input-bordered"
            placeholder="https://example.com"
          />
        </div>
        <div class="modal-action">
          <button
            class="btn btn-ghost"
            @click="closeLinkModal"
          >
            取消
          </button>
          <button
            class="btn btn-primary"
            @click="confirmInsertLink"
            :disabled="!linkUrl.trim()"
          >
            插入
          </button>
        </div>
      </div>
    </dialog>

    <!-- 插入图片对话框 -->
    <dialog
      ref="imageModal"
      class="modal"
    >
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">插入图片</h3>
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">图片地址</span>
          </label>
          <input
            v-model="imageUrl"
            type="url"
            class="input input-bordered"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">图片描述</span>
          </label>
          <input
            v-model="imageAlt"
            type="text"
            class="input input-bordered"
            placeholder="图片描述（可选）"
          />
        </div>
        <div class="modal-action">
          <button
            class="btn btn-ghost"
            @click="closeImageModal"
          >
            取消
          </button>
          <button
            class="btn btn-primary"
            @click="confirmInsertImage"
            :disabled="!imageUrl.trim()"
          >
            插入
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

// 组件属性
interface Props {
  modelValue?: string;
  placeholder?: string;
  maxLength?: number;
  height?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  maxLength: 10000,
  height: '300px',
  readonly: false,
});

// 组件事件
const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
}>();

// 组件引用
const editorRef = ref<HTMLDivElement>();
const linkModal = ref<HTMLDialogElement>();
const imageModal = ref<HTMLDialogElement>();

// 响应式数据
const isFocused = ref(false);
const linkText = ref('');
const linkUrl = ref('');
const imageUrl = ref('');
const imageAlt = ref('');
const currentHeading = ref('');

// 计算属性
const content = computed(() => props.modelValue);

const showPlaceholder = computed(() => {
  return !content.value && !isFocused.value;
});

const wordCount = computed(() => {
  const text = editorRef.value?.innerText || '';
  return text.replace(/\s+/g, '').length;
});

const charCount = computed(() => {
  const text = editorRef.value?.innerText || '';
  return text.length;
});

// 方法
const formatText = (command: string, value?: string) => {
  if (props.readonly) return;

  document.execCommand(command, false, value);
  updateValue();
  checkFormatState();
};

const formatHeading = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;

  if (value) {
    formatText('formatBlock', value);
  } else {
    formatText('formatBlock', 'p');
  }

  currentHeading.value = value;
};

const formatCode = () => {
  if (props.readonly) return;

  const selection = window.getSelection();
  if (selection && selection.toString()) {
    const selectedText = selection.toString();
    const codeElement = `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">${selectedText}</code>`;
    document.execCommand('insertHTML', false, codeElement);
  } else {
    document.execCommand('insertHTML', false, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">代码</code>');
  }
  updateValue();
};

const formatBlockquote = () => {
  if (props.readonly) return;

  const selection = window.getSelection();
  if (selection && selection.toString()) {
    document.execCommand('formatBlock', false, 'blockquote');
  } else {
    document.execCommand('insertHTML', false, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">引用文本</blockquote>');
  }
  updateValue();
};

const insertLink = () => {
  if (props.readonly) return;

  const selection = window.getSelection();
  if (selection && selection.toString()) {
    linkText.value = selection.toString();
  }

  linkModal.value?.showModal();
};

const confirmInsertLink = () => {
  if (!linkUrl.value.trim()) return;

  const linkHTML = `<a href="${linkUrl.value}" target="_blank" class="text-blue-500 hover:underline">${linkText.value || linkUrl.value}</a>`;
  document.execCommand('insertHTML', false, linkHTML);

  closeLinkModal();
  updateValue();
};

const closeLinkModal = () => {
  linkModal.value?.close();
  linkText.value = '';
  linkUrl.value = '';
};

const insertImage = () => {
  if (props.readonly) return;
  imageModal.value?.showModal();
};

const confirmInsertImage = () => {
  if (!imageUrl.value.trim()) return;

  const imageHTML = `<img src="${imageUrl.value}" alt="${imageAlt.value || ''}" class="max-w-full h-auto rounded" />`;
  document.execCommand('insertHTML', false, imageHTML);

  closeImageModal();
  updateValue();
};

const closeImageModal = () => {
  imageModal.value?.close();
  imageUrl.value = '';
  imageAlt.value = '';
};

const undo = () => {
  if (props.readonly) return;
  document.execCommand('undo');
  updateValue();
};

const redo = () => {
  if (props.readonly) return;
  document.execCommand('redo');
  updateValue();
};

const clearFormat = () => {
  if (props.readonly) return;
  document.execCommand('removeFormat');
  document.execCommand('formatBlock', false, 'p');
  updateValue();
};

const isFormatActive = (command: string) => {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
};

const checkFormatState = () => {
  // 检查当前标题级别
  const formatBlock = document.queryCommandValue('formatBlock');
  currentHeading.value = formatBlock.toLowerCase();
};

const updateValue = () => {
  if (!editorRef.value) return;

  const html = editorRef.value.innerHTML;
  emit('update:modelValue', html);
  emit('change', html);

  // 检查字符限制
  if (wordCount.value > props.maxLength) {
    // 这里可以截断内容或显示警告
  }
};

const handleInput = () => {
  updateValue();
  checkFormatState();
};

const handleKeydown = (event: KeyboardEvent) => {
  // 快捷键支持
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'b':
        event.preventDefault();
        formatText('bold');
        break;
      case 'i':
        event.preventDefault();
        formatText('italic');
        break;
      case 'u':
        event.preventDefault();
        formatText('underline');
        break;
      case 'z':
        if (!event.shiftKey) {
          event.preventDefault();
          undo();
        }
        break;
      case 'y':
        event.preventDefault();
        redo();
        break;
    }
  }

  // Tab键处理
  if (event.key === 'Tab') {
    event.preventDefault();
    document.execCommand('insertText', false, '  ');
  }
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();

  const text = event.clipboardData?.getData('text/plain') || '';
  const html = event.clipboardData?.getData('text/html') || '';

  // 优先粘贴纯文本
  if (text) {
    document.execCommand('insertText', false, text);
  } else if (html) {
    document.execCommand('insertHTML', false, html);
  }

  updateValue();
};

const setContent = (value: string) => {
  if (editorRef.value) {
    editorRef.value.innerHTML = value;
    updateValue();
  }
};

// 监听器
watch(() => props.modelValue, (newValue) => {
  if (newValue !== editorRef.value?.innerHTML) {
    setContent(newValue);
  }
});

// 生命周期
onMounted(() => {
  setContent(props.modelValue);

  // 设置编辑器高度
  if (editorRef.value && props.height) {
    editorRef.value.style.minHeight = props.height;
  }

  // 监听选区变化
  document.addEventListener('selectionchange', checkFormatState);
});

onUnmounted(() => {
  document.removeEventListener('selectionchange', checkFormatState);
});

// 暴露方法给父组件
defineExpose({
  setContent,
  getContent: () => editorRef.value?.innerHTML || '',
  focus: () => editorRef.value?.focus(),
  blur: () => editorRef.value?.blur(),
});
</script>

<style>
/* 基础富文本编辑器样式 - 使用标准 CSS 而非 Tailwind 类 */
.rich-text-editor {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  min-height: 32px;
  height: 32px;
  width: 32px;
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  transition-duration: 200ms;
  border-radius: 4px;
  border: 1px solid transparent;
  background-color: transparent;
  cursor: pointer;
}

.toolbar-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.toolbar-btn.active {
  background-color: hsl(var(--p));
  color: hsl(var(--pc));
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.editor-content {
  max-width: none;
}

.editor-content:focus {
  outline: none;
}

.editor-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.editor-content blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 16px;
  font-style: italic;
}

.editor-content code {
  background-color: #f3f4f6;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 14px;
}

.editor-content pre {
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

.editor-content pre code {
  background-color: transparent;
  padding: 0;
}

.editor-content a {
  color: #3b82f6;
  text-decoration: underline;
}

/* 自定义滚动条 */
.editor-content::-webkit-scrollbar {
  width: 8px;
}

.editor-content::-webkit-scrollbar-track {
  background-color: hsl(var(--b1));
}

.editor-content::-webkit-scrollbar-thumb {
  background-color: hsl(var(--b3));
  border-radius: 4px;
}

.editor-content::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--b4));
}
</style>