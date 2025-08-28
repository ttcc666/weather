<template>
  <div class="h-screen bg-aurora p-2 md:p-4 font-sans relative overflow-hidden flex flex-col">
    <!-- 简化的动态背景层 -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-400/15 via-purple-500/15 to-cyan-400/15"></div>

    <!-- 精简的浮动装饰元素 -->
    <div class="absolute top-10 left-5 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-float hidden md:block"></div>
    <div class="absolute bottom-10 right-5 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-float hidden md:block" style="animation-delay: 1s;"></div>

    <!-- 主容器 -->
    <div class="max-w-6xl mx-auto glass rounded-xl md:rounded-2xl p-2 md:p-3 shadow-glass border border-white/25 relative z-10 dark:glass-dark dark:shadow-glass-dark dark:text-gray-100 animate-fade-in flex-1 flex flex-col min-h-0">
      <!-- 精简的标题区域 -->
      <div class="text-center mb-2 md:mb-3 flex-shrink-0">
        <h1 class="text-xl md:text-2xl font-bold tracking-tight text-gradient text-shadow mb-1 animate-slide-down">
          实时天气
        </h1>
        <p class="text-gray-600 dark:text-gray-300 text-xs md:text-sm font-medium opacity-80 hidden md:block">
          精准预报，智能生活
        </p>
      </div>

      <!-- 紧凑的搜索区域 -->
      <div class="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-floating dark:bg-gray-800/70 dark:border-white/20 max-md:flex-col max-md:gap-2 animate-slide-up flex-shrink-0">
        <SearchInput
          @select="handleLocationSelect"
          @clear="handleSearchClear"
          placeholder="搜索城市或地区..."
        />
        <button
          @click="getCurrentLocationWeather"
          class="btn-modern flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 bg-button-gradient hover:bg-button-gradient-hover text-white font-semibold rounded-xl md:rounded-2xl transition-all duration-300 hover:shadow-button-hover hover:-translate-y-1 active:translate-y-0 whitespace-nowrap group text-sm md:text-base"
        >
          <span class="text-base md:text-lg group-hover:animate-bounce-gentle">📍</span>
          <span>获取定位</span>
        </button>
      </div>

      <!-- 精简的加载状态 -->
      <div v-if="loading" class="flex-1 flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-card-gradient backdrop-blur-xl border border-white/40 shadow-floating dark:bg-card-gradient-dark dark:border-white/20 animate-scale-in">
        <div class="relative">
          <div class="loading-spinner"></div>
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-ping"></div>
        </div>
        <div class="text-center space-y-2">
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-200 animate-pulse-soft">正在获取天气数据</p>
          <p class="text-gray-500 dark:text-gray-400 text-sm max-w-md hidden md:block">请稍候，我们正在为您准备最新的天气信息</p>
        </div>
      </div>

      <!-- 精简的错误状态 -->
      <div v-else-if="error" class="flex-1 flex items-center justify-center">
        <div class="text-center animate-shake">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="text-xl">⚠️</span>
            <span class="font-semibold">获取天气数据失败</span>
          </div>
          <p class="opacity-90 text-sm mb-3">{{ error }}</p>
          <button
            @click="getCurrentLocationWeather"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
          >
            重试
          </button>
        </div>
      </div>

      <div v-else-if="weatherData" class="animate-fade-in flex-1 flex flex-col min-h-0">
        <TabContainer
          :tabs="weatherTabs"
          default-tab="current"
          @tab-change="handleTabChange"
          class="flex-1 flex flex-col min-h-0"
        >
          <!-- 当前天气标签页 -->
          <template #current>
            <CurrentWeather :weather-data="weatherData" />
          </template>

          <!-- 24小时预报标签页 -->
          <template #hourly>
            <HourlyForecastChart
              :location="currentLocation"
              :coordinates="currentCoordinates"
            />
          </template>

          <!-- 未来预报标签页 -->
          <template #daily>
            <DailyForecastChart
              :location="currentLocation"
              :coordinates="currentCoordinates"
              :days="7"
            />
          </template>
        </TabContainer>
      </div>

      <!-- 精简的欢迎状态 -->
      <div v-if="!weatherData && !loading && !error" class="flex-1 flex items-center justify-center">
        <div class="text-center p-8 rounded-2xl bg-card-gradient backdrop-blur-xl border border-white/40 shadow-floating dark:bg-card-gradient-dark dark:border-white/20 animate-fade-in">
          <div class="mb-6">
            <div class="text-4xl md:text-5xl mb-3 animate-float">🌤️</div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">欢迎使用实时天气</h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
              获取精准的天气预报，让每一天都充满阳光
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm">
            <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <span class="text-base">🔍</span>
              <span>搜索城市</span>
            </div>
            <div class="hidden sm:block text-gray-300 dark:text-gray-600">或</div>
            <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <span class="text-base">📍</span>
              <span>使用定位</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { weatherService, locationService } from '../services/weather';
import type { WeatherData, SearchLocation } from '../types/weather';
import SearchInput from './SearchInput.vue';
import HourlyForecastChart from './HourlyForecastChart.vue';
import DailyForecastChart from './DailyForecastChart.vue';
import TabContainer from './TabContainer.vue';
import CurrentWeather from './CurrentWeather.vue';

const weatherData = ref<WeatherData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const currentLocation = ref<string>('');
const currentCoordinates = ref<{ lat: number; lon: number } | undefined>(undefined);

const weatherTabs = [
  { id: 'current', label: '当前天气', icon: '🌤️' },
  { id: 'hourly', label: '24小时预报', icon: '⏰' },
  { id: 'daily', label: '未来预报', icon: '📅' }
];

const handleLocationSelect = async (location: SearchLocation) => {
  await getWeatherByLocation(`${location.lat},${location.lon}`);
  currentLocation.value = `${location.name}, ${location.region}, ${location.country}`;
  currentCoordinates.value = { lat: location.lat, lon: location.lon };
};

const handleSearchClear = () => {
  weatherData.value = null;
  error.value = null;
  currentLocation.value = '';
  currentCoordinates.value = undefined;
};

const handleTabChange = (tabId: string) => {
  console.log('切换到标签页:', tabId);
};

const getWeatherByLocation = async (location: string) => {
  loading.value = true;
  error.value = null;
  
  try {
    const data = await weatherService.getCurrentWeather(location);
    weatherData.value = data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取天气数据失败';
    weatherData.value = null;
  } finally {
    loading.value = false;
  }
};

const getCurrentLocationWeather = async () => {
  loading.value = true;
  error.value = null;

  try {
    const position = await locationService.getCurrentLocation();
    const location = `${position.lat},${position.lon}`;
    await getWeatherByLocation(location);

    if (weatherData.value) {
      currentLocation.value = `${weatherData.value.location.name}, ${weatherData.value.location.region}, ${weatherData.value.location.country}`;
      currentCoordinates.value = { lat: position.lat, lon: position.lon };
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取位置信息失败';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getCurrentLocationWeather();
});
</script>
