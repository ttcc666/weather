<template>
  <div class="py-6 animate-fade-in">
    <!-- 标题区域 -->
    <div class="flex items-center justify-between mb-6 animate-slide-down">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
          ⏰
        </div>
        <div>
          <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100">24小时预报</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">逐小时天气变化趋势</p>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div class="hidden md:flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
        <span>滑动查看</span>
        <div class="flex gap-1">
          <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
          <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
          <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-6 p-16 rounded-3xl bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-xl border border-blue-200/50 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-700/30 animate-scale-in">
      <div class="relative">
        <div class="loading-spinner"></div>
        <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 opacity-20 animate-ping"></div>
      </div>
      <div class="text-center">
        <p class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">正在获取24小时预报</p>
        <p class="text-gray-500 dark:text-gray-400">为您准备详细的逐小时天气数据</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-message text-center animate-shake">
      <div class="flex items-center justify-center gap-3 mb-3">
        <span class="text-2xl">⚠️</span>
        <span class="font-semibold">获取预报数据失败</span>
      </div>
      <p class="opacity-90">{{ error }}</p>
    </div>

    <!-- 24小时预报主容器 -->
    <div v-else-if="hourlyData.length > 0" class="relative animate-slide-up" style="animation-delay: 0.2s;">
      <!-- 渐变遮罩 -->
      <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none dark:from-gray-900/90"></div>
      <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none dark:from-gray-900/90"></div>

      <!-- 滚动容器 -->
      <div class="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl rounded-3xl p-6 shadow-floating border border-white/40 dark:from-gray-800/95 dark:to-gray-700/95 dark:border-gray-600/40 overflow-hidden">
        <div
          ref="scrollContainer"
          class="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
          @scroll="handleScroll"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          <div
            v-for="(hour, index) in hourlyData"
            :key="hour.time_epoch"
            :class="[
              'flex-shrink-0 flex flex-col items-center gap-4 p-5 rounded-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden',
              // 统一基础样式 - 固定尺寸确保一致性
              'w-[130px] h-[320px] backdrop-blur-xl shadow-card',
              // 当前时间样式 - 突出显示但不影响布局
              isCurrentHour(hour.time_epoch)
                ? 'bg-gradient-to-br from-primary-50 via-blue-50 to-cyan-50 border-2 border-primary-500 shadow-button-hover z-10 dark:from-primary-900/60 dark:via-blue-900/60 dark:to-cyan-900/60 dark:border-primary-400'
                : // 普通状态样式 - 统一尺寸和效果
                  'bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50 hover:from-white hover:to-gray-50 hover:border-gray-300/70 hover:shadow-card-hover dark:from-gray-700/70 dark:to-gray-800/70 dark:border-gray-600/50 dark:hover:from-gray-700/90 dark:hover:to-gray-800/90'
            ]"
            :style="{
              animationDelay: `${index * 0.05}s`,
              // 为当前时间卡片添加额外的z-index确保在最前面
              zIndex: isCurrentHour(hour.time_epoch) ? 20 : 1
            }"
            @click="selectHour(index)"
          >
            <!-- 当前时间指示器 - 增强版 -->
            <div
              v-if="isCurrentHour(hour.time_epoch)"
              class="absolute -top-3 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            >
              <!-- 主指示器 -->
              <div class="w-6 h-6 bg-gradient-to-r from-primary-500 via-blue-500 to-cyan-500 rounded-full shadow-button animate-pulse relative">
                <div class="absolute inset-0 bg-gradient-to-r from-primary-400 via-blue-400 to-cyan-400 rounded-full animate-ping opacity-75"></div>
                <div class="absolute inset-1 bg-white rounded-full opacity-90"></div>
                <div class="absolute inset-2 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full"></div>
              </div>
              <!-- 标签 -->
              <div class="mt-1 px-2 py-0.5 bg-primary-500 text-white text-xs font-bold rounded-full shadow-md">
                现在
              </div>
            </div>

            <!-- 背景装饰 - 增强悬停效果 -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

            <!-- 当前时间特殊背景光晕 -->
            <div
              v-if="isCurrentHour(hour.time_epoch)"
              class="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-blue-400/20 to-cyan-400/20 rounded-2xl animate-pulse"
            ></div>

            <!-- 时间显示 - 当前时间特殊样式 -->
            <div class="relative z-10 text-center">
              <div
                :class="[
                  'text-sm font-bold mb-1 transition-all duration-300',
                  isCurrentHour(hour.time_epoch)
                    ? 'text-primary-600 dark:text-primary-400 text-base font-extrabold'
                    : 'text-gray-700 dark:text-gray-200'
                ]"
              >
                {{ formatHourTime(hour.time) }}
              </div>
              <div
                :class="[
                  'text-xs transition-all duration-300',
                  isCurrentHour(hour.time_epoch)
                    ? 'text-primary-500 dark:text-primary-300 font-semibold'
                    : 'text-gray-500 dark:text-gray-400'
                ]"
              >
                {{ formatHourDate(hour.time) }}
              </div>
            </div>

            <!-- 天气图标 -->
            <div class="relative z-10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <WeatherIcon
                :weather-code="hour.condition.code"
                :is-day="hour.is_day"
                :description="hour.condition.text"
                :size="48"
              />
              <!-- 图标光晕 -->
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <!-- 温度显示 - 当前时间特殊样式 -->
            <div class="relative z-10 text-center">
              <div
                :class="[
                  'font-bold mb-1 transition-all duration-300',
                  isCurrentHour(hour.time_epoch)
                    ? 'text-3xl text-primary-600 dark:text-primary-400 font-extrabold'
                    : 'text-2xl text-gray-800 dark:text-gray-100'
                ]"
              >
                {{ Math.round(hour.temp_c) }}°
              </div>
              <div
                :class="[
                  'text-xs transition-all duration-300',
                  isCurrentHour(hour.time_epoch)
                    ? 'text-primary-500 dark:text-primary-300 font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                ]"
              >
                体感 {{ Math.round(hour.feelslike_c) }}°
              </div>
            </div>

            <!-- 天气详情 - 当前时间特殊样式 -->
            <div class="relative z-10 flex flex-col gap-2 text-xs w-full">
              <!-- 降水概率 -->
              <div
                :class="[
                  'flex items-center justify-between p-2 rounded-lg transition-all duration-300',
                  isCurrentHour(hour.time_epoch)
                    ? 'bg-blue-100/90 dark:bg-blue-800/40 shadow-sm border border-blue-200/50 dark:border-blue-700/50'
                    : 'bg-blue-50/80 dark:bg-blue-900/20'
                ]"
              >
                <div class="flex items-center gap-1">
                  <span class="text-blue-500">💧</span>
                  <span class="text-blue-600 dark:text-blue-400 font-medium">降水</span>
                </div>
                <span
                  :class="[
                    'font-bold text-blue-700 dark:text-blue-300',
                    isCurrentHour(hour.time_epoch) ? 'text-blue-800 dark:text-blue-200' : ''
                  ]"
                >
                  {{ hour.chance_of_rain }}%
                </span>
              </div>

              <!-- 风速 -->
              <div
                :class="[
                  'flex items-center justify-between p-2 rounded-lg transition-all duration-300',
                  isCurrentHour(hour.time_epoch)
                    ? 'bg-green-100/90 dark:bg-green-800/40 shadow-sm border border-green-200/50 dark:border-green-700/50'
                    : 'bg-green-50/80 dark:bg-green-900/20'
                ]"
              >
                <div class="flex items-center gap-1">
                  <span class="text-green-500">💨</span>
                  <span class="text-green-600 dark:text-green-400 font-medium">风速</span>
                </div>
                <span
                  :class="[
                    'font-bold text-green-700 dark:text-green-300',
                    isCurrentHour(hour.time_epoch) ? 'text-green-800 dark:text-green-200' : ''
                  ]"
                >
                  {{ Math.round(hour.wind_kph) }}
                </span>
              </div>

              <!-- 湿度 -->
              <div
                :class="[
                  'flex items-center justify-between p-2 rounded-lg transition-all duration-300',
                  isCurrentHour(hour.time_epoch)
                    ? 'bg-purple-100/90 dark:bg-purple-800/40 shadow-sm border border-purple-200/50 dark:border-purple-700/50'
                    : 'bg-purple-50/80 dark:bg-purple-900/20'
                ]"
              >
                <div class="flex items-center gap-1">
                  <span class="text-purple-500">💦</span>
                  <span class="text-purple-600 dark:text-purple-400 font-medium">湿度</span>
                </div>
                <span
                  :class="[
                    'font-bold text-purple-700 dark:text-purple-300',
                    isCurrentHour(hour.time_epoch) ? 'text-purple-800 dark:text-purple-200' : ''
                  ]"
                >
                  {{ hour.humidity }}%
                </span>
              </div>
            </div>

            <!-- 天气描述 -->
            <div class="relative z-10 text-xs text-gray-600 dark:text-gray-300 text-center leading-tight font-medium px-2 py-1 bg-gray-100/60 dark:bg-gray-600/40 rounded-lg">
              {{ hour.condition.text }}
            </div>
          </div>
        </div>

        <!-- 滚动指示器 -->
        <div class="flex justify-center mt-4">
          <div class="flex gap-1">
            <div
              v-for="(_, index) in Math.ceil(hourlyData.length / 6)"
              :key="index"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-300',
                currentScrollPage === index
                  ? 'bg-primary-500 w-6'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-else class="text-center p-16 rounded-3xl bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-xl border border-gray-200/50 dark:from-gray-800/80 dark:to-gray-700/80 dark:border-gray-600/50 animate-fade-in">
      <div class="text-6xl mb-4 opacity-60">📊</div>
      <h3 class="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">暂无预报数据</h3>
      <p class="text-gray-500 dark:text-gray-400">请选择城市或使用定位功能获取24小时天气预报</p>
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
}

const props = defineProps<Props>();

const forecastData = ref<ForecastData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const currentScrollPage = ref(0);

// 计算24小时的预报数据
const hourlyData = computed(() => {
  if (!forecastData.value) return [];
  
  const now = new Date();
  const currentHour = now.getHours();
  const allHours: any[] = [];
  
  // 获取今天剩余的小时
  const todayHours = forecastData.value.forecast.forecastday[0]?.hour || [];
  const remainingTodayHours = todayHours.slice(currentHour);
  allHours.push(...remainingTodayHours);
  
  // 如果今天剩余小时不足24小时，添加明天的小时
  if (allHours.length < 24 && forecastData.value.forecast.forecastday[1]) {
    const tomorrowHours = forecastData.value.forecast.forecastday[1].hour || [];
    const neededHours = 24 - allHours.length;
    allHours.push(...tomorrowHours.slice(0, neededHours));
  }
  
  return allHours.slice(0, 24);
});

// 格式化小时时间
const formatHourTime = (timeString: string): string => {
  const date = new Date(timeString);
  const hour = date.getHours();

  if (hour === 0) return '午夜';
  if (hour === 12) return '中午';
  if (hour < 12) return `${hour}时`;
  return `${hour}时`;
};

// 格式化日期
const formatHourDate = (timeString: string): string => {
  const date = new Date(timeString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return '今天';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return '明天';
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};

// 检查是否为当前小时
const isCurrentHour = (timeEpoch: number): boolean => {
  const now = new Date();
  const hourTime = new Date(timeEpoch * 1000);
  return now.getHours() === hourTime.getHours() &&
         now.getDate() === hourTime.getDate();
};

// 处理滚动事件
const handleScroll = () => {
  if (!scrollContainer.value) return;

  const container = scrollContainer.value;
  const scrollLeft = container.scrollLeft;
  const itemWidth = 120 + 24; // 卡片宽度 + gap
  const itemsPerPage = 6;
  const pageWidth = itemWidth * itemsPerPage;

  currentScrollPage.value = Math.round(scrollLeft / pageWidth);
};

// 选择指定小时（不触发滚动，避免页面跳动）
const selectHour = (index: number) => {
  // 这里可以添加选择逻辑，比如高亮显示、显示详情等
  // 但不执行滚动操作，保持页面稳定
  console.log(`选择了第 ${index + 1} 个小时的天气信息`);
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
        2 // 获取2天的数据以确保有24小时
      );
    } else if (props.location) {
      data = await weatherService.getForecastByLocation(props.location, 2);
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
  () => [props.location, props.coordinates],
  () => {
    fetchForecast();
  },
  { immediate: true, deep: true }
);
</script>
