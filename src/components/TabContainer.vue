<template>
  <div class="tab-container">
    <!-- Tab 导航栏 -->
    <div class="tab-nav">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :class="['tab-button', { 'tab-button--active': activeTab === tab.id }]"
        @click="setActiveTab(tab.id)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab 内容区域 -->
    <div class="tab-content">
      <div class="tab-content-wrapper">
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

<style scoped>
.tab-container {
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
}

.tab-nav {
  display: flex;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.8));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  padding: 4px;
  gap: 2px;
  position: relative;
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 48px;
  z-index: 1;
  pointer-events: auto;
  border-radius: 12px;
  letter-spacing: -0.025em;
}

.tab-button:hover {
  background: linear-gradient(135deg, rgba(116, 185, 255, 0.08), rgba(116, 185, 255, 0.15));
  color: #3b82f6;
  transform: translateY(-2px);
  box-shadow:
    0 8px 16px rgba(116, 185, 255, 0.15),
    0 4px 8px rgba(116, 185, 255, 0.1);
  border: 1px solid rgba(116, 185, 255, 0.2);
}

.tab-button--active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 700;
  transform: translateY(-1px);
  box-shadow:
    0 12px 24px rgba(102, 126, 234, 0.25),
    0 6px 12px rgba(102, 126, 234, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-button--active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  border-radius: 16px;
  pointer-events: none;
}

.tab-button--active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.tab-icon {
  font-size: 1.3rem;
  line-height: 1;
  transition: all 0.3s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.tab-button--active .tab-icon {
  filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3));
  transform: scale(1.1);
}

.tab-label {
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.tab-button--active .tab-label {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.tab-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  min-height: 320px;
  position: relative;
}

.tab-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.5), transparent);
}

.tab-content-wrapper {
  width: 100%;
  max-width: 90%;
  margin: 0 auto;
  padding: 20px 16px;
  position: relative;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .tab-content-wrapper {
    max-width: 95%;
  }
}

@media (max-width: 768px) {
  .tab-content-wrapper {
    max-width: 100%;
    padding: 16px;
  }
  
  .tab-button {
    flex-direction: column;
    gap: 4px;
    padding: 12px 8px;
    min-height: 70px;
  }
  
  .tab-icon {
    font-size: 1.4rem;
  }
  
  .tab-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .tab-button {
    padding: 10px 4px;
    min-height: 65px;
  }
  
  .tab-icon {
    font-size: 1.2rem;
  }
  
  .tab-label {
    font-size: 0.75rem;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .tab-container {
    background: rgba(26, 32, 44, 0.95);
    backdrop-filter: blur(20px);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .tab-nav {
    background: linear-gradient(135deg, rgba(45, 55, 72, 0.9), rgba(26, 32, 44, 0.8));
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .tab-button {
    color: #a0aec0;
  }

  .tab-button:hover {
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(79, 70, 229, 0.25));
    color: #e2e8f0;
    border-color: rgba(79, 70, 229, 0.3);
  }

  .tab-button--active {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    box-shadow:
      0 12px 24px rgba(79, 70, 229, 0.3),
      0 6px 12px rgba(79, 70, 229, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .tab-button--active::after {
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.5);
  }

  .tab-content {
    background: rgba(26, 32, 44, 0.95);
  }

  .tab-content::before {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .tab-button {
    border: 1px solid transparent;
  }
  
  .tab-button:hover {
    border-color: #74b9ff;
  }
  
  .tab-button--active {
    border-color: #0984e3;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .tab-button {
    transition: none;
  }
}
</style>
