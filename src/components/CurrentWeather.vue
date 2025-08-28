<template>
  <div class="py-2 md:py-3 animate-fade-in">
    <!-- 位置信息 -->
    <div class="text-center mb-2 md:mb-3 animate-slide-down">
      <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2 dark:text-gray-100 tracking-tight">{{ weatherData.location.name }}</h2>
      <p class="text-gray-600 mb-1 dark:text-gray-300 text-sm md:text-base font-medium">{{ weatherData.location.region }}, {{ weatherData.location.country }}</p>
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ formatTime(weatherData.current.last_updated) }}</p>
      </div>
    </div>

    <!-- 主要天气信息 -->
    <div class="flex items-center justify-center gap-6 md:gap-8 mb-2 md:mb-4 max-md:flex-col max-md:gap-4 animate-scale-in">
      <!-- 温度显示 -->
      <div class="text-center group">
        <div class="relative">
          <div class="flex items-baseline justify-center mb-2">
            <span class="text-4xl md:text-5xl font-extralight text-gradient bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent animate-glow">
              {{ Math.round(weatherData.current.temp_c) }}°
            </span>
            <span class="text-xl md:text-2xl text-gray-500 ml-1 dark:text-gray-400 font-light">C</span>
          </div>
          <!-- 温度装饰环 -->
          <div class="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl group-hover:from-blue-400/30 group-hover:to-purple-500/30 transition-all duration-500"></div>
        </div>
      </div>

      <!-- 天气图标和描述 -->
      <div class="text-center group">
        <div class="relative mb-2">
          <WeatherIcon
            :weather-code="weatherData.current.condition.code"
            :is-day="weatherData.current.is_day"
            :description="weatherData.current.condition.text"
            large
          />
          <!-- 图标光晕效果 -->
          <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg group-hover:from-yellow-400/30 group-hover:to-orange-400/30 transition-all duration-500"></div>
        </div>
        <p class="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-200 tracking-wide">{{ weatherData.current.condition.text }}</p>
      </div>
    </div>

    <!-- 体感温度 -->
    <div class="text-center mb-2 md:mb-3 animate-slide-up">
      <div class="inline-flex items-center gap-2 p-2 md:p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg md:rounded-xl border border-blue-200/50 dark:border-blue-700/50 shadow-card">
        <span class="text-lg md:text-xl">🌡️</span>
        <div>
          <span class="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium">体感温度</span>
          <span class="ml-2 text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">{{ Math.round(weatherData.current.feelslike_c) }}°C</span>
        </div>
      </div>
    </div>

    <!-- 天气详情网格 -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 max-md:grid-cols-1 animate-slide-up" style="animation-delay: 0.2s;">
      <!-- 湿度 -->
      <div class="card-modern group hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center text-white text-base md:text-lg group-hover:scale-110 transition-transform">
              💧
            </div>
            <span class="text-sm md:text-base text-gray-600 font-semibold dark:text-gray-300">湿度</span>
          </div>
          <span class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">{{ weatherData.current.humidity }}%</span>
        </div>
      </div>

      <!-- 风速 -->
      <div class="card-modern group hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center text-white text-base md:text-lg group-hover:scale-110 transition-transform">
              💨
            </div>
            <span class="text-sm md:text-base text-gray-600 font-semibold dark:text-gray-300">风速</span>
          </div>
          <span class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">{{ weatherData.current.wind_kph }} km/h</span>
        </div>
      </div>

      <!-- 风向 -->
      <div class="card-modern group hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center text-white text-base md:text-lg group-hover:scale-110 transition-transform">
              🧭
            </div>
            <span class="text-sm md:text-base text-gray-600 font-semibold dark:text-gray-300">风向</span>
          </div>
          <span class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">{{ weatherData.current.wind_dir }}</span>
        </div>
      </div>

      <!-- 气压 -->
      <div class="card-modern group hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg md:rounded-xl flex items-center justify-center text-white text-base md:text-lg group-hover:scale-110 transition-transform">
              📊
            </div>
            <span class="text-sm md:text-base text-gray-600 font-semibold dark:text-gray-300">气压</span>
          </div>
          <span class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">{{ weatherData.current.pressure_mb }} mb</span>
        </div>
      </div>

      <!-- 能见度 -->
      <div class="card-modern group hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg md:rounded-xl flex items-center justify-center text-white text-base md:text-lg group-hover:scale-110 transition-transform">
              👁️
            </div>
            <span class="text-sm md:text-base text-gray-600 font-semibold dark:text-gray-300">能见度</span>
          </div>
          <span class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">{{ weatherData.current.vis_km }} km</span>
        </div>
      </div>

      <!-- 紫外线指数 -->
      <div class="card-modern group hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg md:rounded-xl flex items-center justify-center text-white text-base md:text-lg group-hover:scale-110 transition-transform">
              ☀️
            </div>
            <span class="text-sm md:text-base text-gray-600 font-semibold dark:text-gray-300">紫外线</span>
          </div>
          <span class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">{{ weatherData.current.uv }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeatherData } from '../types/weather';
import WeatherIcon from './WeatherIcon.vue';

interface Props {
  weatherData: WeatherData;
}

defineProps<Props>();

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN');
};
</script>
