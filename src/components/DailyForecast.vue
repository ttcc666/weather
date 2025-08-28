<template>
  <div class="py-6 animate-fade-in">
    <!-- 标题区域 -->
    <div class="flex items-center gap-3 mb-6 animate-slide-down">
      <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
        📅
      </div>
      <div>
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100">未来预报</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">7天天气变化趋势</p>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center gap-3 p-8">
      <div class="loading-spinner"></div>
      <span class="text-gray-600 dark:text-gray-300">加载预报数据中...</span>
    </div>

    <div v-else-if="error" class="error-message text-center p-4">
      {{ error }}
    </div>

    <div v-else-if="dailyData.length > 0" class="space-y-4">
      <div
        v-for="(day, index) in dailyData"
        :key="day.date_epoch"
        :class="[
          'bg-white rounded-xl p-5 shadow-sm border transition-all duration-200 hover:shadow-md dark:bg-gray-700/50 dark:border-gray-600',
          index === 0 ? 'border-primary-300 bg-primary-50/50 dark:border-primary-600 dark:bg-primary-900/20' : 'border-gray-200'
        ]"
      >
        <!-- 日期和主要信息 -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1">
            <div class="font-bold text-lg text-gray-800 dark:text-gray-100">{{ formatDayName(day.date, index) }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatFullDate(day.date) }}</div>
          </div>

          <div class="flex items-center gap-4">
            <WeatherIcon
              :weather-code="day.day.condition.code"
              :is-day="1"
              :description="day.day.condition.text"
              large
            />

            <div class="text-right">
              <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ Math.round(day.day.maxtemp_c) }}°</div>
              <div class="text-lg text-gray-500 dark:text-gray-400">{{ Math.round(day.day.mintemp_c) }}°</div>
            </div>
          </div>
        </div>

        <!-- 天气状况 -->
        <div class="text-center text-gray-600 mb-4 font-medium dark:text-gray-300">
          {{ day.day.condition.text }}
        </div>

        <!-- 详细信息 -->
        <div class="grid grid-cols-2 gap-3 mb-4 max-md:grid-cols-1">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-600/30">
            <div class="flex items-center gap-2">
              <span>💧</span>
              <span class="text-sm text-gray-600 dark:text-gray-300">降雨概率</span>
            </div>
            <span class="font-semibold text-gray-800 dark:text-gray-100">{{ day.day.daily_chance_of_rain }}%</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-600/30">
            <div class="flex items-center gap-2">
              <span>💨</span>
              <span class="text-sm text-gray-600 dark:text-gray-300">最大风速</span>
            </div>
            <span class="font-semibold text-gray-800 dark:text-gray-100">{{ Math.round(day.day.maxwind_kph) }} km/h</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-600/30">
            <div class="flex items-center gap-2">
              <span>💦</span>
              <span class="text-sm text-gray-600 dark:text-gray-300">湿度</span>
            </div>
            <span class="font-semibold text-gray-800 dark:text-gray-100">{{ day.day.avghumidity }}%</span>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-600/30">
            <div class="flex items-center gap-2">
              <span>☀️</span>
              <span class="text-sm text-gray-600 dark:text-gray-300">紫外线</span>
            </div>
            <span class="font-semibold text-gray-800 dark:text-gray-100">{{ day.day.uv }}</span>
          </div>
        </div>

        <!-- 日出日落 -->
        <div class="flex justify-center gap-8 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div class="flex items-center gap-2 text-sm">
            <span>🌅</span>
            <span class="text-gray-600 dark:text-gray-300">日出</span>
            <span class="font-semibold text-gray-800 dark:text-gray-100">{{ day.astro.sunrise }}</span>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <span>🌇</span>
            <span class="text-gray-600 dark:text-gray-300">日落</span>
            <span class="font-semibold text-gray-800 dark:text-gray-100">{{ day.astro.sunset }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center p-8 text-gray-500 bg-gray-50 rounded-xl dark:bg-gray-700/30 dark:text-gray-400">
      暂无预报数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { weatherService } from '../services/weather';
import type { ForecastData } from '../types/weather';
import WeatherIcon from './WeatherIcon.vue';

interface Props {
  location?: string;
  coordinates?: { lat: number; lon: number };
  days?: number;
}

const props = withDefaults(defineProps<Props>(), {
  days: 7
});

const forecastData = ref<ForecastData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// 计算日预报数据（排除今天）
const dailyData = computed(() => {
  if (!forecastData.value) return [];
  
  // 获取预报数据，跳过第一天（今天）
  return forecastData.value.forecast.forecastday.slice(1);
});

// 格式化日期名称
const formatDayName = (dateString: string, index: number): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (index === 0) {
    return '明天';
  } else if (index === 1) {
    return '后天';
  } else {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  }
};

// 格式化完整日期
const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

// 获取预报数据
const fetchForecast = async () => {
  if (!props.location && !props.coordinates) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    let data: ForecastData;
    
    if (props.coordinates) {
      data = await weatherService.getForecastByCoords(
        props.coordinates.lat, 
        props.coordinates.lon, 
        props.days
      );
    } else if (props.location) {
      data = await weatherService.getForecastByLocation(props.location, props.days);
    } else {
      throw new Error('缺少位置信息');
    }
    
    forecastData.value = data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取预报数据失败';
    forecastData.value = null;
  } finally {
    loading.value = false;
  }
};

// 监听props变化
watch(
  () => [props.location, props.coordinates, props.days],
  () => {
    fetchForecast();
  },
  { immediate: true, deep: true }
);
</script>