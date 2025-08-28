<template>
  <div class="flex-1 relative group">
    <div class="relative">
      <!-- 搜索图标 -->
      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- 输入框 -->
      <input
        ref="searchInputRef"
        v-model="searchQuery"
        type="text"
        placeholder="搜索城市或地区..."
        class="w-full pl-12 pr-16 py-4 border-2 border-gray-200/80 rounded-2xl font-medium outline-none transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-input focus:border-primary-500 focus:shadow-input-focus focus:bg-white focus:-translate-y-0.5 placeholder:text-gray-400 placeholder:font-normal hover:border-gray-300 hover:shadow-md dark:bg-gray-800/95 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <!-- 加载状态 -->
      <div v-if="isLoading" class="absolute right-12 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <div class="loading-spinner"></div>
      </div>

      <!-- 清除按钮 -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 dark:hover:bg-gray-700 dark:hover:text-gray-300"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- 建议下拉框 -->
    <div v-if="showSuggestions && suggestions.length > 0" class="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-floating border border-white/40 max-h-80 overflow-y-auto z-50 animate-slide-down dark:bg-gray-800/95 dark:border-gray-600/40">
      <div
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.id"
        :class="[
          'flex items-center justify-between p-4 cursor-pointer transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl group',
          index === activeIndex
            ? 'bg-gradient-to-r from-primary-50 to-blue-50 text-primary-700 shadow-inner dark:from-primary-900/30 dark:to-blue-900/30 dark:text-primary-300'
            : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/50'
        ]"
        @click="selectSuggestion(suggestion)"
        @mouseenter="activeIndex = index"
      >
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex flex-col">
            <span class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ suggestion.name }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ suggestion.region }}</span>
          </div>
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500 font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">{{ suggestion.country }}</div>
      </div>
    </div>

    <!-- 无结果状态 -->
    <div v-if="showSuggestions && searchQuery && suggestions.length === 0 && !isLoading" class="absolute top-full left-0 right-0 mt-3 p-6 text-center bg-white/95 backdrop-blur-xl rounded-2xl shadow-floating border border-white/40 animate-slide-down dark:bg-gray-800/95 dark:border-gray-600/40">
      <div class="text-4xl mb-3 opacity-60">🔍</div>
      <p class="text-gray-500 dark:text-gray-400 font-medium">未找到匹配的地点</p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">请尝试其他关键词</p>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="mt-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border border-red-200 rounded-2xl text-sm shadow-md animate-shake dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800 dark:text-red-400">
      <div class="flex items-center gap-2">
        <span class="text-lg">⚠️</span>
        <span class="font-medium">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { weatherService } from '../services/weather';
import type { SearchLocation } from '../types/weather';

interface Props {
  placeholder?: string;
  debounceMs?: number;
}

interface Emits {
  (e: 'select', location: SearchLocation): void;
  (e: 'clear'): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索城市或地区...',
  debounceMs: 300
});

const emit = defineEmits<Emits>();

const searchInputRef = ref<HTMLInputElement>();
const searchQuery = ref('');
const suggestions = ref<SearchLocation[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const showSuggestions = ref(false);
const activeIndex = ref(-1);
let debounceTimer: number | null = null;

const handleInput = () => {
  error.value = null;
  
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  if (!searchQuery.value.trim()) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }
  
  debounceTimer = window.setTimeout(() => {
    searchLocations();
  }, props.debounceMs);
};

const searchLocations = async () => {
  if (!searchQuery.value.trim()) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    const results = await weatherService.searchLocations(searchQuery.value.trim());
    suggestions.value = results;
    showSuggestions.value = true;
    activeIndex.value = -1;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '搜索失败';
    suggestions.value = [];
    showSuggestions.value = false;
  } finally {
    isLoading.value = false;
  }
};

const handleFocus = () => {
  if (suggestions.value.length > 0) {
    showSuggestions.value = true;
  }
};

const handleBlur = () => {
  // 延迟隐藏建议，以便点击建议项能正常工作
  setTimeout(() => {
    showSuggestions.value = false;
    activeIndex.value = -1;
  }, 200);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!showSuggestions.value || suggestions.value.length === 0) return;
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      activeIndex.value = Math.min(activeIndex.value + 1, suggestions.value.length - 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      activeIndex.value = Math.max(activeIndex.value - 1, -1);
      break;
    case 'Enter':
      event.preventDefault();
      if (activeIndex.value >= 0 && activeIndex.value < suggestions.value.length) {
        selectSuggestion(suggestions.value[activeIndex.value]);
      }
      break;
    case 'Escape':
      showSuggestions.value = false;
      activeIndex.value = -1;
      searchInputRef.value?.blur();
      break;
  }
};

const selectSuggestion = (suggestion: SearchLocation) => {
  searchQuery.value = `${suggestion.name}, ${suggestion.region}, ${suggestion.country}`;
  showSuggestions.value = false;
  activeIndex.value = -1;
  emit('select', suggestion);
};

const clearSearch = () => {
  searchQuery.value = '';
  suggestions.value = [];
  showSuggestions.value = false;
  activeIndex.value = -1;
  error.value = null;
  emit('clear');
  nextTick(() => {
    searchInputRef.value?.focus();
  });
};

// 暴露方法给父组件
defineExpose({
  focus: () => searchInputRef.value?.focus(),
  clear: clearSearch
});
</script>
