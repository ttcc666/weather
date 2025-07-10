<template>
  <div class="current-weather">
    <div class="location-info">
      <h2 class="location-name">{{ weatherData.location.name }}</h2>
      <p class="location-country">{{ weatherData.location.region }}, {{ weatherData.location.country }}</p>
      <p class="update-time">更新时间: {{ formatTime(weatherData.current.last_updated) }}</p>
    </div>

    <div class="main-weather">
      <div class="temperature">
        <span class="temp-value">{{ Math.round(weatherData.current.temp_c) }}°</span>
        <span class="temp-unit">C</span>
      </div>
      <div class="condition">
        <WeatherIcon
          :weather-code="weatherData.current.condition.code"
          :is-day="weatherData.current.is_day"
          :description="weatherData.current.condition.text"
          large
        />
        <p class="condition-text">{{ weatherData.current.condition.text }}</p>
      </div>
    </div>

    <div class="feels-like">
      体感温度: {{ Math.round(weatherData.current.feelslike_c) }}°C
    </div>

    <div class="weather-details">
      <div class="detail-item">
        <span class="detail-label">湿度</span>
        <span class="detail-value">{{ weatherData.current.humidity }}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">风速</span>
        <span class="detail-value">{{ weatherData.current.wind_kph }} km/h</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">风向</span>
        <span class="detail-value">{{ weatherData.current.wind_dir }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">气压</span>
        <span class="detail-value">{{ weatherData.current.pressure_mb }} mb</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">能见度</span>
        <span class="detail-value">{{ weatherData.current.vis_km }} km</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">紫外线指数</span>
        <span class="detail-value">{{ weatherData.current.uv }}</span>
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

<style scoped>
.current-weather {
  padding: 16px 0;
}

.location-info {
  text-align: center;
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  margin: 0 20px 24px 20px;
}

.location-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.location-country {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.update-time {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 400;
}

.main-weather {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 32px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
  backdrop-filter: blur(15px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 16px rgba(0, 0, 0, 0.04);
  margin: 0 20px 32px 20px;
  position: relative;
  overflow: hidden;
}

.main-weather::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 80% 20%, rgba(116, 185, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.temperature {
  display: flex;
  align-items: baseline;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.temp-value {
  font-size: 4.5rem;
  font-weight: 200;
  color: #1a202c;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.temp-unit {
  font-size: 1.8rem;
  color: #64748b;
  font-weight: 300;
}

.condition {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.condition-text {
  font-size: 1.2rem;
  color: #1a202c;
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.feels-like {
  text-align: center;
  font-size: 1rem;
  color: #475569;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.8));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 0 20px 24px 20px;
  font-weight: 500;
  letter-spacing: -0.025em;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  padding: 0 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.detail-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(116, 185, 255, 0.02), rgba(102, 126, 234, 0.01));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.detail-item:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 20px 40px rgba(116, 185, 255, 0.15),
    0 8px 16px rgba(116, 185, 255, 0.1);
  border-color: rgba(116, 185, 255, 0.3);
}

.detail-item:hover::before {
  opacity: 1;
}

.detail-label {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 1;
}

.detail-value {
  font-size: 1.3rem;
  color: #1a202c;
  font-weight: 700;
  letter-spacing: -0.025em;
  position: relative;
  z-index: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .current-weather {
    padding: 16px 0;
  }
  
  .location-name {
    font-size: 1.6rem;
  }
  
  .main-weather {
    flex-direction: column;
    gap: 20px;
    padding: 0 16px;
  }
  
  .temp-value {
    font-size: 3rem;
  }
  
  .weather-details {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    padding: 0 16px;
  }
  
  .detail-item {
    padding: 12px;
  }
  
  .feels-like {
    margin: 0 16px 20px 16px;
  }
}

@media (max-width: 480px) {
  .location-name {
    font-size: 1.4rem;
  }
  
  .temp-value {
    font-size: 2.5rem;
  }
  
  .weather-details {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 0 12px;
  }
  
  .detail-item {
    padding: 10px;
  }
  
  .detail-label {
    font-size: 0.8rem;
  }
  
  .detail-value {
    font-size: 1rem;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .location-name {
    color: #ddd;
  }
  
  .location-country {
    color: #b2bec3;
  }
  
  .update-time {
    color: #636e72;
  }
  
  .temp-value {
    color: #ddd;
  }
  
  .temp-unit {
    color: #b2bec3;
  }
  
  .condition-text {
    color: #ddd;
  }
  
  .feels-like {
    background: #636e72;
    color: #ddd;
  }
  
  .detail-item {
    background: #636e72;
  }
  
  .detail-item:hover {
    background: linear-gradient(135deg, #74b9ff, #0984e3);
    box-shadow: 0 6px 16px rgba(116, 185, 255, 0.3);
  }
  
  .detail-label {
    color: #b2bec3;
  }
  
  .detail-value {
    color: #ddd;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .detail-item {
    transition: none;
  }
  
  .detail-item:hover {
    transform: none;
  }
}
</style>
