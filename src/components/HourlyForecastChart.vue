<template>
  <div class="h-full flex flex-col animate-fade-in">
    <!-- 紧凑的标题区域 -->
    <div class="flex items-center justify-between mb-2 md:mb-3 animate-slide-down flex-shrink-0">
      <div class="flex items-center gap-2 md:gap-3">
        <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg md:rounded-xl flex items-center justify-center text-white text-lg md:text-xl shadow-lg">
          📈
        </div>
        <div>
          <h3 class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">24小时预报</h3>
          <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 hidden md:block">温度变化趋势图</p>
        </div>
      </div>

      <!-- 紧凑的刷新按钮 -->
      <button
        @click="fetchForecast"
        :disabled="loading"
        class="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-white/80 hover:bg-white border border-gray-200 rounded-lg md:rounded-xl transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700/80 dark:hover:bg-gray-700 dark:border-gray-600"
      >
        <svg
          :class="['w-3 h-3 md:w-4 md:h-4', loading ? 'animate-spin' : '']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span class="text-xs md:text-sm font-medium hidden md:inline">刷新</span>
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        <p class="text-gray-500 dark:text-gray-400">正在获取24小时预报...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg font-semibold">获取数据失败</p>
          <p class="text-sm text-gray-500 mt-2">{{ error }}</p>
        </div>
        <button
          @click="fetchForecast"
          class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          重试
        </button>
      </div>
    </div>

    <!-- 24小时预报图表 -->
    <div v-else-if="hourlyData.length > 0" class="flex-1 flex flex-col min-h-0">
      <!-- 图表容器 -->
      <div class="flex-1 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl rounded-xl md:rounded-2xl p-2 md:p-3 shadow-floating border border-white/40 dark:from-gray-800/95 dark:to-gray-700/95 dark:border-gray-600/40 min-h-0">
        <div class="relative h-full">
          <!-- 图表 -->
          <div class="h-full min-h-[120px] md:min-h-[180px]">
            <Line
              ref="chartRef"
              :data="chartData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>

      <!-- 详细信息弹窗 -->
      <div
        v-if="selectedHour"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="closeDetail"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all duration-300"
          @click.stop
        >
          <!-- 详细信息标题 -->
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-bold text-gray-800 dark:text-gray-100">
              {{ formatTime(selectedHour.time) }}
            </h4>
            <button
              @click="closeDetail"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 详细信息内容 -->
          <div class="space-y-4">
            <!-- 主要天气信息 -->
            <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <WeatherIcon
                :weather-code="selectedHour.condition.code"
                :is-day="selectedHour.is_day"
                :description="selectedHour.condition.text"
                :large="true"
              />
              <div>
                <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {{ Math.round(selectedHour.temp_c) }}°
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  体感 {{ Math.round(selectedHour.feelslike_c) }}°
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  {{ selectedHour.condition.text }}
                </div>
              </div>
            </div>

            <!-- 详细数据 -->
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">降水概率</div>
                <div class="font-semibold text-blue-600 dark:text-blue-400">
                  {{ selectedHour.chance_of_rain }}%
                </div>
              </div>
              <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">风速</div>
                <div class="font-semibold text-green-600 dark:text-green-400">
                  {{ Math.round(selectedHour.wind_kph) }} km/h
                </div>
              </div>
              <div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">湿度</div>
                <div class="font-semibold text-purple-600 dark:text-purple-400">
                  {{ selectedHour.humidity }}%
                </div>
              </div>
              <div class="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">紫外线</div>
                <div class="font-semibold text-orange-600 dark:text-orange-400">
                  {{ selectedHour.uv }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-lg font-semibold">暂无预报数据</p>
        <p class="text-sm text-gray-500 mt-2">请检查网络连接或稍后重试</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { weatherService } from '../services/weather';
import type { ForecastData } from '../types/weather';
import WeatherIcon from './WeatherIcon.vue';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  location?: string;
  coordinates?: { lat: number; lon: number };
}

const props = defineProps<Props>();

const forecastData = ref<ForecastData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedHour = ref<any>(null);
const chartRef = ref();

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

// 图表数据
const chartData = computed(() => {
  if (!hourlyData.value.length) return { labels: [], datasets: [] };

  const labels = hourlyData.value.map(hour => {
    const date = new Date(hour.time);
    return date.getHours() + ':00';
  });

  const temperatures = hourlyData.value.map(hour => hour.temp_c);
  const currentHourIndex = getCurrentHourIndex();

  return {
    labels,
    datasets: [
      {
        label: '温度 (°C)',
        data: temperatures,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: temperatures.map((_, index) => 
          index === currentHourIndex ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'
        ),
        pointBorderColor: temperatures.map((_, index) => 
          index === currentHourIndex ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'
        ),
        pointRadius: temperatures.map((_, index) => 
          index === currentHourIndex ? 8 : 5
        ),
        pointHoverRadius: 8,
      }
    ]
  };
});

// 图表配置
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  onClick: (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      selectedHour.value = hourlyData.value[index];
    }
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(59, 130, 246, 0.5)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: (context: any) => {
          const hour = hourlyData.value[context[0].dataIndex];
          return formatTime(hour.time);
        },
        label: (context: any) => {
          const hour = hourlyData.value[context.dataIndex];
          return [
            `温度: ${Math.round(hour.temp_c)}°C`,
            `体感: ${Math.round(hour.feelslike_c)}°C`,
            `${hour.condition.text}`,
            `降水: ${hour.chance_of_rain}%`,
            `湿度: ${hour.humidity}%`
          ];
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: 'rgb(107, 114, 128)',
        font: {
          size: 12,
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: 'rgb(107, 114, 128)',
        font: {
          size: 12,
        },
        callback: (value: any) => `${value}°`
      }
    }
  }
}));

// 获取当前小时在数据中的索引
const getCurrentHourIndex = () => {
  const now = new Date();
  const currentTime = now.getTime();

  return hourlyData.value.findIndex(hour => {
    const hourTime = new Date(hour.time).getTime();
    const timeDiff = Math.abs(hourTime - currentTime);
    return timeDiff < 30 * 60 * 1000; // 30分钟内认为是当前小时
  });
};

// 格式化时间显示
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return `今天 ${date.getHours()}:00`;
  } else {
    return `明天 ${date.getHours()}:00`;
  }
};

// 关闭详细信息
const closeDetail = () => {
  selectedHour.value = null;
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

<style scoped>
/* 自定义样式 */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-slide-down {
  animation: slideDown 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shadow-floating {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
