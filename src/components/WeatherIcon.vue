<template>
  <div :class="[
    'relative inline-flex items-center justify-center',
    large ? 'w-20 h-20' : 'w-12 h-12'
  ]">
    <img
      :src="iconSrc"
      :alt="iconAlt"
      :class="[
        'object-contain transition-opacity duration-300',
        large ? 'w-20 h-20' : 'w-12 h-12',
        customClass,
        isLoading ? 'opacity-0' : 'opacity-100'
      ]"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    <div v-if="showLoading && isLoading" class="absolute inset-0 flex items-center justify-center">
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
