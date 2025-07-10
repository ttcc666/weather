<template>
  <div class="weather-icon" :class="{ 'weather-icon--large': large }">
    <img 
      :src="iconSrc" 
      :alt="iconAlt" 
      :class="iconClass"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    <div v-if="showLoading && isLoading" class="weather-icon__loading">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getWeatherIcon, getIconPath, SVG_ICON_MAP } from '../utils/weatherIconMapping';

interface Props {
  /** WeatherAPI天气代码 */
  weatherCode: number;
  /** 是否为白天 (1为白天，0为夜间) */
  isDay: number;
  /** 天气描述文本 */
  description?: string;
  /** 是否显示大尺寸图标 */
  large?: boolean;
  /** 是否显示加载状态 */
  showLoading?: boolean;
  /** 自定义CSS类名 */
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  large: false,
  showLoading: true,
  customClass: ''
});

const isLoading = ref(true);
const hasError = ref(false);

// 计算图标源路径
const iconSrc = computed(() => {
  if (hasError.value) {
    // 如果加载失败，使用默认图标
    const defaultIcon = props.isDay ? '1baitianqing' : '2yejianqing';
    return getIconPath(defaultIcon);
  }
  
  const iconName = getWeatherIcon(props.weatherCode, props.isDay);
  return getIconPath(iconName);
});

// 计算图标alt文本
const iconAlt = computed(() => {
  if (props.description) {
    return props.description;
  }
  
  const iconName = getWeatherIcon(props.weatherCode, props.isDay);
  return SVG_ICON_MAP[iconName as keyof typeof SVG_ICON_MAP] || '天气图标';
});

// 计算图标CSS类名
const iconClass = computed(() => {
  const classes = ['weather-icon__image'];
  
  if (props.large) {
    classes.push('weather-icon__image--large');
  }
  
  if (props.customClass) {
    classes.push(props.customClass);
  }
  
  if (isLoading.value) {
    classes.push('weather-icon__image--loading');
  }
  
  return classes.join(' ');
});

// 处理图片加载错误
const handleImageError = () => {
  console.warn(`Weather icon failed to load: ${iconSrc.value}`);
  hasError.value = true;
  isLoading.value = false;
};

// 处理图片加载完成
const handleImageLoad = () => {
  isLoading.value = false;
  hasError.value = false;
};
</script>

<style scoped>
.weather-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.weather-icon--large {
  width: 80px;
  height: 80px;
}

.weather-icon__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease;
}

.weather-icon__image--large {
  width: 100%;
  height: 100%;
}

.weather-icon__image--loading {
  opacity: 0;
}

.weather-icon__loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e3e3e3;
  border-top: 2px solid #74b9ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.weather-icon--large .loading-spinner {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .weather-icon {
    width: 40px;
    height: 40px;
  }
  
  .weather-icon--large {
    width: 64px;
    height: 64px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .loading-spinner {
    border-color: #4a4a4a;
    border-top-color: #74b9ff;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .weather-icon__image {
    filter: contrast(1.2);
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .weather-icon__image {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
}
</style>
