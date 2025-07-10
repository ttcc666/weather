<template>
  <div class="search-input">
    <div class="search-container">
      <input
        ref="searchInputRef"
        v-model="searchQuery"
        type="text"
        placeholder="搜索城市或地区..."
        class="search-field"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      <div v-if="isLoading" class="search-loading">
        <div class="loading-spinner"></div>
      </div>
      <button v-if="searchQuery" @click="clearSearch" class="clear-button">
        ✕
      </button>
    </div>
    
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions">
      <div
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.id"
        :class="['suggestion-item', { 'suggestion-item--active': index === activeIndex }]"
        @click="selectSuggestion(suggestion)"
        @mouseenter="activeIndex = index"
      >
        <div class="suggestion-main">
          <span class="suggestion-name">{{ suggestion.name }}</span>
          <span class="suggestion-region">{{ suggestion.region }}</span>
        </div>
        <div class="suggestion-country">{{ suggestion.country }}</div>
      </div>
    </div>
    
    <div v-if="showSuggestions && searchQuery && suggestions.length === 0 && !isLoading" class="no-results">
      未找到匹配的地点
    </div>
    
    <div v-if="error" class="search-error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
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

<style scoped>
.search-input {
  position: relative;
  width: 100%;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-field {
  width: 100%;
  padding: 12px 16px;
  padding-right: 60px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  letter-spacing: -0.025em;
}

.search-field::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.search-field:focus {
  border-color: #667eea;
  box-shadow:
    0 8px 24px rgba(102, 126, 234, 0.15),
    0 4px 12px rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
}

.search-loading {
  position: absolute;
  right: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  filter: drop-shadow(0 1px 2px rgba(102, 126, 234, 0.3));
}

.clear-button {
  position: absolute;
  right: 16px;
  width: 28px;
  height: 28px;
  border: none;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.clear-button:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(239, 68, 68, 0.4);
}

.suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.5);
  border-radius: 16px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.06);
  padding: 8px;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
  position: relative;
  overflow: hidden;
}

.suggestion-item:last-child {
  margin-bottom: 0;
}

.suggestion-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(116, 70, 162, 0.03));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.suggestion-item:hover,
.suggestion-item--active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(116, 70, 162, 0.05));
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.1);
}

.suggestion-item:hover::before,
.suggestion-item--active::before {
  opacity: 1;
}

.suggestion-main {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.suggestion-name {
  font-weight: 500;
  color: #2d3436;
  margin-bottom: 2px;
}

.suggestion-region {
  font-size: 14px;
  color: #636e72;
}

.suggestion-country {
  font-size: 12px;
  color: #b2bec3;
  text-align: right;
}

.no-results {
  padding: 16px;
  text-align: center;
  color: #636e72;
  font-style: italic;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
}

.search-error {
  margin-top: 8px;
  padding: 8px 12px;
  background: #ffe6e6;
  color: #e74c3c;
  border-radius: 4px;
  font-size: 14px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-field {
    font-size: 16px; /* 防止iOS缩放 */
  }
  
  .suggestions {
    max-height: 200px;
  }
  
  .suggestion-item {
    padding: 10px 12px;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .search-field {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
  
  .suggestion-item {
    transition: none;
  }
}
</style>
