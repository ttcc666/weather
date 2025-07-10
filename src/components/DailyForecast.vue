<template>
  <div class="daily-forecast">
    <h3 class="forecast-title">未来天气预报</h3>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <span>加载预报数据中...</span>
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="dailyData.length > 0" class="daily-container">
      <div
        v-for="(day, index) in dailyData"
        :key="day.date_epoch"
        class="day-item"
        :class="{ 'day-item--today': index === 0 }"
      >
        <div class="day-header">
          <div class="day-date">
            <div class="day-name">{{ formatDayName(day.date, index) }}</div>
            <div class="day-full-date">{{ formatFullDate(day.date) }}</div>
          </div>
          
          <div class="day-icon">
            <WeatherIcon
              :weather-code="day.day.condition.code"
              :is-day="1"
              :description="day.day.condition.text"
              large
            />
          </div>
          
          <div class="day-temps">
            <div class="temp-high">{{ Math.round(day.day.maxtemp_c) }}°</div>
            <div class="temp-low">{{ Math.round(day.day.mintemp_c) }}°</div>
          </div>
        </div>
        
        <div class="day-condition">
          {{ day.day.condition.text }}
        </div>
        
        <div class="day-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-icon">💧</span>
              <span class="detail-label">降雨概率</span>
              <span class="detail-value">{{ day.day.daily_chance_of_rain }}%</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-icon">💨</span>
              <span class="detail-label">最大风速</span>
              <span class="detail-value">{{ Math.round(day.day.maxwind_kph) }} km/h</span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-icon">💦</span>
              <span class="detail-label">湿度</span>
              <span class="detail-value">{{ day.day.avghumidity }}%</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-icon">☀️</span>
              <span class="detail-label">紫外线</span>
              <span class="detail-value">{{ day.day.uv }}</span>
            </div>
          </div>
        </div>
        
        <div class="day-astro">
          <div class="astro-item">
            <span class="astro-icon">🌅</span>
            <span class="astro-label">日出</span>
            <span class="astro-value">{{ day.astro.sunrise }}</span>
          </div>
          
          <div class="astro-item">
            <span class="astro-icon">🌇</span>
            <span class="astro-label">日落</span>
            <span class="astro-value">{{ day.astro.sunset }}</span>
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

<style scoped>
.daily-forecast {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.forecast-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 16px;
  text-align: center;
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

.daily-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.day-item {
  padding: 16px;
  border-radius: 12px;
  background: #f8f9fa;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.day-item:hover {
  background: linear-gradient(135deg, #e8f4fd, #d1ecf1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(116, 185, 255, 0.2);
  border-color: rgba(116, 185, 255, 0.4);
}

.day-item--today {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  border-color: #0984e3;
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.day-date {
  flex: 1;
}

.day-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 4px;
}

.day-item--today .day-name {
  color: white;
}

.day-full-date {
  font-size: 0.9rem;
  color: #636e72;
}

.day-item--today .day-full-date {
  color: rgba(255, 255, 255, 0.9);
}

.day-icon {
  flex: 0 0 auto;
  margin: 0 20px;
}

.day-temps {
  flex: 0 0 auto;
  text-align: right;
}

.temp-high {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 4px;
}

.day-item--today .temp-high {
  color: white;
}

.temp-low {
  font-size: 1rem;
  color: #636e72;
}

.day-item--today .temp-low {
  color: rgba(255, 255, 255, 0.8);
}

.day-condition {
  text-align: center;
  font-size: 0.95rem;
  color: #636e72;
  margin-bottom: 16px;
  font-weight: 500;
}

.day-item--today .day-condition {
  color: rgba(255, 255, 255, 0.9);
}

.day-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.detail-icon {
  font-size: 0.9rem;
}

.detail-label {
  font-size: 0.85rem;
  color: #636e72;
  min-width: 60px;
}

.day-item--today .detail-label {
  color: rgba(255, 255, 255, 0.8);
}

.detail-value {
  font-size: 0.85rem;
  font-weight: 500;
  color: #2d3436;
}

.day-item--today .detail-value {
  color: white;
}

.day-astro {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.day-item--today .day-astro {
  border-top-color: rgba(255, 255, 255, 0.3);
}

.astro-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.astro-icon {
  font-size: 0.9rem;
}

.astro-label {
  font-size: 0.8rem;
  color: #636e72;
}

.day-item--today .astro-label {
  color: rgba(255, 255, 255, 0.8);
}

.astro-value {
  font-size: 0.8rem;
  font-weight: 500;
  color: #2d3436;
}

.day-item--today .astro-value {
  color: white;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .daily-forecast {
    margin: 16px 0;
    padding: 16px;
  }
  
  .day-item {
    padding: 16px;
  }
  
  .day-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .day-icon {
    margin: 0;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .detail-item {
    justify-content: space-between;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .day-item {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
}
</style>
