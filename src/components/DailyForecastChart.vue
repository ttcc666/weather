<template>
  <div class="h-full flex flex-col animate-fade-in">
    <!-- 紧凑的标题区域 -->
    <div class="flex items-center justify-between mb-2 md:mb-3 animate-slide-down flex-shrink-0">
      <div class="flex items-center gap-2 md:gap-3">
        <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center text-white text-lg md:text-xl shadow-lg">
          📊
        </div>
        <div>
          <h3 class="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">未来预报</h3>
          <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 hidden md:block">7天温度变化趋势图</p>
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
        <p class="text-gray-500 dark:text-gray-400">正在获取未来预报...</p>
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

    <!-- 7天预报图表 -->
    <div v-else-if="dailyData.length > 0" class="flex-1 flex flex-col min-h-0">
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
        v-if="selectedDay"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="closeDetail"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-4 max-w-lg w-full shadow-2xl transform transition-all duration-300 max-h-[80vh] overflow-y-auto"
          @click.stop
        >
          <!-- 详细信息标题 -->
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-lg font-bold text-gray-800 dark:text-gray-100">
              {{ formatDayName(selectedDay.date, selectedDayIndex) }}
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
          <div class="space-y-3">
            <!-- 主要天气信息 -->
            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <WeatherIcon
                :weather-code="selectedDay.day.condition.code"
                :is-day="1"
                :description="selectedDay.day.condition.text"
                :large="false"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl font-bold text-red-500">{{ Math.round(selectedDay.day.maxtemp_c) }}°</span>
                  <span class="text-gray-400">/</span>
                  <span class="text-lg font-semibold text-blue-500">{{ Math.round(selectedDay.day.mintemp_c) }}°</span>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  {{ selectedDay.day.condition.text }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFullDate(selectedDay.date) }}
                </div>
              </div>
            </div>

            <!-- 详细数据网格 -->
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">降水概率</div>
                <div class="font-semibold text-blue-600 dark:text-blue-400">
                  {{ selectedDay.day.daily_chance_of_rain }}%
                </div>
              </div>
              <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">最大风速</div>
                <div class="font-semibold text-green-600 dark:text-green-400">
                  {{ Math.round(selectedDay.day.maxwind_kph) }} km/h
                </div>
              </div>
              <div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">平均湿度</div>
                <div class="font-semibold text-purple-600 dark:text-purple-400">
                  {{ selectedDay.day.avghumidity }}%
                </div>
              </div>
              <div class="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">紫外线指数</div>
                <div class="font-semibold text-orange-600 dark:text-orange-400">
                  {{ selectedDay.day.uv }}
                </div>
              </div>
            </div>

            <!-- 日出日落信息 -->
            <div class="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
              <div class="flex justify-between items-center">
                <div class="text-center">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">日出</div>
                  <div class="font-semibold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                    <span>🌅</span>
                    {{ selectedDay.astro.sunrise }}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">日落</div>
                  <div class="font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <span>🌇</span>
                    {{ selectedDay.astro.sunset }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 降水量信息 -->
            <div class="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
              <div class="text-center">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">预计降水量</div>
                <div class="font-semibold text-cyan-600 dark:text-cyan-400">
                  {{ selectedDay.day.totalprecip_mm }} mm
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
import { ref, computed, watch } from 'vue';
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
  days?: number;
}

const props = withDefaults(defineProps<Props>(), {
  days: 7
});

const forecastData = ref<ForecastData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedDay = ref<any>(null);
const selectedDayIndex = ref<number>(-1);
const chartRef = ref();

// 计算日预报数据（包含今天）
const dailyData = computed(() => {
  if (!forecastData.value) return [];
  
  // 获取所有预报数据，包括今天
  return forecastData.value.forecast.forecastday;
});

// 图表数据
const chartData = computed(() => {
  if (!dailyData.value.length) return { labels: [], datasets: [] };

  const labels = dailyData.value.map((day, index) => formatDayName(day.date, index));
  const maxTemps = dailyData.value.map(day => day.day.maxtemp_c);
  const minTemps = dailyData.value.map(day => day.day.mintemp_c);
  const todayIndex = getTodayIndex();

  return {
    labels,
    datasets: [
      {
        label: '最高温度 (°C)',
        data: maxTemps,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: maxTemps.map((_, index) => 
          index === todayIndex ? 'rgb(220, 38, 38)' : 'rgb(239, 68, 68)'
        ),
        pointBorderColor: maxTemps.map((_, index) => 
          index === todayIndex ? 'rgb(220, 38, 38)' : 'rgb(239, 68, 68)'
        ),
        pointRadius: maxTemps.map((_, index) => 
          index === todayIndex ? 8 : 5
        ),
        pointHoverRadius: 8,
      },
      {
        label: '最低温度 (°C)',
        data: minTemps,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: minTemps.map((_, index) => 
          index === todayIndex ? 'rgb(37, 99, 235)' : 'rgb(59, 130, 246)'
        ),
        pointBorderColor: minTemps.map((_, index) => 
          index === todayIndex ? 'rgb(37, 99, 235)' : 'rgb(59, 130, 246)'
        ),
        pointRadius: minTemps.map((_, index) => 
          index === todayIndex ? 8 : 5
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
  onClick: (_event: any, elements: any[]) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      selectedDay.value = dailyData.value[index];
      selectedDayIndex.value = index;
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        color: 'rgb(107, 114, 128)',
        font: {
          size: 12,
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(59, 130, 246, 0.5)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        title: (context: any) => {
          const day = dailyData.value[context[0].dataIndex];
          return formatDayName(day.date, context[0].dataIndex);
        },
        label: (context: any) => {
          const day = dailyData.value[context.dataIndex];
          const isMaxTemp = context.datasetIndex === 0;
          return [
            isMaxTemp ? `最高温度: ${Math.round(day.day.maxtemp_c)}°C` : `最低温度: ${Math.round(day.day.mintemp_c)}°C`,
            `${day.day.condition.text}`,
            `降水概率: ${day.day.daily_chance_of_rain}%`,
            `湿度: ${day.day.avghumidity}%`
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

// 获取今天在数据中的索引
const getTodayIndex = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return dailyData.value.findIndex(day => day.date === todayStr);
};

// 格式化日期名称
const formatDayName = (dateString: string, index: number): string => {
  const date = new Date(dateString);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (dateString === todayStr) {
    return '今天';
  } else if (index === 1 || (index === 0 && dateString !== todayStr)) {
    return '明天';
  } else if (index === 2 || (index === 1 && dateString !== todayStr)) {
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

// 关闭详细信息
const closeDetail = () => {
  selectedDay.value = null;
  selectedDayIndex.value = -1;
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
