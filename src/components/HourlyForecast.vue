<template>
  <div class="hourly-forecast">
    <h3 class="forecast-title">24小时天气预报</h3>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <span>加载预报数据中...</span>
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="hourlyData.length > 0" class="hourly-container">
      <div class="hourly-scroll">
        <div
          v-for="hour in hourlyData"
          :key="hour.time_epoch"
          class="hour-item"
          :class="{ 'hour-item--current': isCurrentHour(hour.time_epoch) }"
        >
          <div class="hour-time">
            {{ formatHourTime(hour.time) }}
          </div>
          
          <div class="hour-icon">
            <WeatherIcon
              :weather-code="hour.condition.code"
              :is-day="hour.is_day"
              :description="hour.condition.text"
            />
          </div>
          
          <div class="hour-temp">
            {{ Math.round(hour.temp_c) }}°
          </div>
          
          <div class="hour-details">
            <div class="detail-item">
              <span class="detail-icon">💧</span>
              <span class="detail-value">{{ hour.chance_of_rain }}%</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-icon">💨</span>
              <span class="detail-value">{{ Math.round(hour.wind_kph) }}</span>
            </div>
          </div>
          
          <div class="hour-condition">
            {{ hour.condition.text }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data">
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
}

const props = defineProps<Props>();

const forecastData = ref<ForecastData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

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

// 检查是否为当前小时
const isCurrentHour = (timeEpoch: number): boolean => {
  const now = new Date();
  const hourTime = new Date(timeEpoch * 1000);
  return now.getHours() === hourTime.getHours() && 
         now.getDate() === hourTime.getDate();
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
.hourly-forecast {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.forecast-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 32px;
  text-align: center;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #636e72;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e3e3e3;
  border-top: 2px solid #74b9ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error {
  text-align: center;
  color: #e74c3c;
  padding: 20px;
  background: #ffe6e6;
  border-radius: 8px;
  margin: 10px 0;
}

.no-data {
  text-align: center;
  color: #636e72;
  padding: 40px;
  font-style: italic;
}

.hourly-container {
  overflow: hidden;
}

.hourly-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 0 16px 0;
  scroll-behavior: smooth;
}

.hourly-scroll::-webkit-scrollbar {
  height: 6px;
}

.hourly-scroll::-webkit-scrollbar-track {
  background: #f1f3f4;
  border-radius: 3px;
}

.hourly-scroll::-webkit-scrollbar-thumb {
  background: #74b9ff;
  border-radius: 3px;
}

.hour-item {
  flex: 0 0 auto;
  width: 130px;
  text-align: center;
  padding: 20px 12px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.hour-item:hover {
  background: linear-gradient(135deg, #e8f4fd, #d1ecf1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(116, 185, 255, 0.25);
  border-color: rgba(116, 185, 255, 0.4);
}

.hour-item--current {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  border-color: #0984e3;
}

.hour-item--current .hour-time,
.hour-item--current .hour-temp,
.hour-item--current .hour-condition {
  color: white;
}

.hour-time {
  font-size: 0.85rem;
  font-weight: 500;
  color: #636e72;
  margin-bottom: 8px;
}

.hour-icon {
  margin: 8px 0;
  display: flex;
  justify-content: center;
}

.hour-temp {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3436;
  margin: 8px 0;
}

.hour-details {
  display: flex;
  justify-content: space-around;
  margin: 8px 0;
  gap: 4px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.detail-icon {
  font-size: 0.8rem;
}

.detail-value {
  font-size: 0.75rem;
  color: #636e72;
  font-weight: 500;
}

.hour-item--current .detail-value {
  color: rgba(255, 255, 255, 0.9);
}

.hour-condition {
  font-size: 0.7rem;
  color: #636e72;
  margin-top: 8px;
  line-height: 1.2;
  height: 28px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hourly-forecast {
    margin: 16px 0;
    padding: 16px;
  }
  
  .hour-item {
    width: 80px;
    padding: 12px 6px;
  }
  
  .hour-temp {
    font-size: 1rem;
  }
  
  .hour-condition {
    font-size: 0.65rem;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .hour-item {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
  
  .hourly-scroll {
    scroll-behavior: auto;
  }
}
</style>
