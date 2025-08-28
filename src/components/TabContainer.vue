<template>
  <div class="w-full h-full animate-fade-in flex flex-col">
    <!-- 等宽Tab导航栏 -->
    <div class="grid grid-cols-3 bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-xl rounded-xl md:rounded-2xl p-1.5 md:p-2 shadow-floating border border-white/40 mb-3 md:mb-4 dark:from-gray-800/90 dark:to-gray-700/90 dark:border-gray-600/40 flex-shrink-0 gap-1">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :class="[
          'flex items-center justify-center gap-1 md:gap-2 px-2 md:px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl font-semibold transition-colors duration-300 relative group text-xs md:text-sm text-center w-full h-full',
          activeTab === tab.id
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-button'
            : 'text-gray-600 hover:text-gray-800 hover:bg-white/80 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-600/60'
        ]"
        @click="setActiveTab(tab.id)"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <!-- 活跃状态背景 -->
        <div
          v-if="activeTab === tab.id"
          class="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-600/20 rounded-xl animate-pulse"
        ></div>

        <!-- 图标和文本 -->
        <span class="text-base md:text-lg transition-colors duration-200 relative z-10 flex-shrink-0">{{ tab.icon }}</span>
        <span class="text-xs md:text-sm font-bold relative z-10 truncate flex-shrink-0">{{ tab.label }}</span>

        <!-- 悬停光晕效果 -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>

    <!-- 无滚动条的内容区域 -->
    <div class="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl rounded-xl md:rounded-2xl p-2 md:p-3 shadow-floating border border-white/40 dark:from-gray-800/95 dark:to-gray-700/95 dark:border-gray-600/40 flex-1 flex flex-col min-h-0">
      <div class="animate-fade-in flex-1 flex flex-col min-h-0 overflow-hidden">
        <slot :name="activeTab" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface Props {
  tabs: Tab[];
  defaultTab?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultTab: ''
});

const emit = defineEmits<{
  (e: 'tab-change', tabId: string): void;
}>();

// 设置默认激活的标签页
const activeTab = ref(props.defaultTab || props.tabs[0]?.id || '');

// 切换标签页
const setActiveTab = (tabId: string) => {
  console.log('Tab clicked:', tabId);
  activeTab.value = tabId;
  emit('tab-change', tabId);
};

// 暴露方法给父组件
defineExpose({
  setActiveTab,
  activeTab: computed(() => activeTab.value)
});
</script>
