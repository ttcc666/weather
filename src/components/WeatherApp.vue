<template>
  <div class="weather-app">
    <div class="container">
      <h1>实时天气</h1>
      
      <div class="search-section">
        <SearchInput
          @select="handleLocationSelect"
          @clear="handleSearchClear"
          placeholder="搜索城市或地区..."
        />
        <button @click="getCurrentLocationWeather" class="location-btn">📍 定位</button>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">
          <p>正在获取天气数据...</p>
          <p class="loading-tip">请稍候，我们正在为您准备最新的天气信息</p>
        </div>
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else-if="weatherData" class="weather-content">
        <TabContainer
          :tabs="weatherTabs"
          default-tab="current"
          @tab-change="handleTabChange"
        >
          <!-- 当前天气标签页 -->
          <template #current>
            <CurrentWeather :weather-data="weatherData" />
          </template>

          <!-- 24小时预报标签页 -->
          <template #hourly>
            <HourlyForecast
              :location="currentLocation"
              :coordinates="currentCoordinates"
            />
          </template>

          <!-- 未来预报标签页 -->
          <template #daily>
            <DailyForecast
              :location="currentLocation"
              :coordinates="currentCoordinates"
              :days="7"
            />
          </template>
        </TabContainer>
      </div>

      <div v-if="!weatherData && !loading && !error" class="welcome">
        <p>欢迎使用实时天气应用</p>
        <p>选择城市或使用定位功能获取天气信息</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { weatherService, locationService } from '../services/weather';
import type { WeatherData, SearchLocation } from '../types/weather';
import SearchInput from './SearchInput.vue';
import HourlyForecast from './HourlyForecast.vue';
import DailyForecast from './DailyForecast.vue';
import TabContainer from './TabContainer.vue';
import CurrentWeather from './CurrentWeather.vue';

const weatherData = ref<WeatherData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const currentLocation = ref<string>('');
const currentCoordinates = ref<{ lat: number; lon: number } | undefined>(undefined);

// Tab配置
const weatherTabs = [
  { id: 'current', label: '当前天气', icon: '🌤️' },
  { id: 'hourly', label: '24小时预报', icon: '⏰' },
  { id: 'daily', label: '未来预报', icon: '📅' }
];

// Tab切换处理
const handleTabChange = (tabId: string) => {
  console.log('切换到标签页:', tabId);
};

const handleLocationSelect = async (location: SearchLocation) => {
  loading.value = true;
  error.value = null;

  try {
    const data = await weatherService.getCurrentWeather(`${location.lat},${location.lon}`);
    weatherData.value = data;
    currentLocation.value = `${location.lat},${location.lon}`;
    currentCoordinates.value = { lat: location.lat, lon: location.lon };
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取天气数据失败';
    weatherData.value = null;
    currentLocation.value = '';
    currentCoordinates.value = undefined;
  } finally {
    loading.value = false;
  }
};

const handleSearchClear = () => {
  weatherData.value = null;
  error.value = null;
  currentLocation.value = '';
  currentCoordinates.value = undefined;
};

const getCurrentLocationWeather = async () => {
  loading.value = true;
  error.value = null;

  try {
    const location = await locationService.getCurrentLocation();
    const data = await weatherService.getWeatherByCoords(location.lat, location.lon);
    weatherData.value = data;
    currentLocation.value = `${location.lat},${location.lon}`;
    currentCoordinates.value = { lat: location.lat, lon: location.lon };
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取位置或天气数据失败';
    weatherData.value = null;
    currentLocation.value = '';
    currentCoordinates.value = undefined;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getCurrentLocationWeather();
});
</script>

<style scoped>
.weather-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #74b9ff 100%);
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  position: relative;
}

.weather-app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

h1 {
  text-align: center;
  color: #1a202c;
  margin-bottom: 24px;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-section {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.city-select {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
  background: white;
  cursor: pointer;
}

.city-select:focus {
  border-color: #74b9ff;
}

.city-select optgroup {
  font-weight: bold;
  color: #2d3436;
}

.city-select option {
  padding: 8px;
  color: #636e72;
}

.location-btn {
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.025em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 8px 16px rgba(102, 126, 234, 0.3),
    0 4px 8px rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;
}

.location-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.location-btn:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: translateY(-2px);
  box-shadow:
    0 12px 24px rgba(102, 126, 234, 0.4),
    0 6px 12px rgba(102, 126, 234, 0.3);
}

.location-btn:hover::before {
  opacity: 1;
}

.location-btn:active {
  transform: translateY(0);
  box-shadow:
    0 6px 12px rgba(102, 126, 234, 0.3),
    0 3px 6px rgba(102, 126, 234, 0.2);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(116, 185, 255, 0.2);
  border-top: 5px solid #74b9ff;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  margin-bottom: 24px;
  filter: drop-shadow(0 2px 4px rgba(116, 185, 255, 0.3));
}

.loading-text p {
  margin: 0 0 12px 0;
  color: #1a202c;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.loading-tip {
  color: #64748b !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
  opacity: 0.8;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error, .welcome {
  text-align: center;
  padding: 48px 40px;
  font-size: 1.1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  font-weight: 500;
  letter-spacing: -0.025em;
}

.error {
  color: #dc2626;
  background: linear-gradient(135deg, rgba(254, 226, 226, 0.9), rgba(252, 165, 165, 0.8));
  border-color: rgba(248, 113, 113, 0.3);
}

.welcome {
  color: #475569;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.8));
  border-color: rgba(203, 213, 225, 0.3);
}

.current-weather {
  text-align: center;
  margin-bottom: 30px;
}

.location-info h2 {
  font-size: 2rem;
  color: #2d3436;
  margin-bottom: 5px;
}

.location-info p {
  color: #636e72;
  margin-bottom: 3px;
}

.last-updated {
  font-size: 0.9rem;
  color: #b2bec3;
}

.main-weather {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin: 30px 0;
}

.temperature {
  display: flex;
  align-items: baseline;
}

.temp-value {
  font-size: 4rem;
  font-weight: 300;
  color: #2d3436;
}

.temp-unit {
  font-size: 1.5rem;
  color: #636e72;
  margin-left: 5px;
}

.condition {
  text-align: center;
}

.condition img {
  width: 80px;
  height: 80px;
}

.condition p {
  color: #636e72;
  margin-top: 10px;
  font-size: 1.1rem;
}

.feels-like {
  color: #636e72;
  font-size: 1.1rem;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(116, 185, 255, 0.1);
  border-radius: 10px;
  border-left: 4px solid #74b9ff;
}

.detail-label {
  color: #636e72;
  font-weight: 500;
}

.detail-value {
  color: #2d3436;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .container {
    max-width: 800px;
    padding: 25px;
  }
}

@media (max-width: 768px) {
  .weather-app {
    padding: 10px;
  }

  .container {
    max-width: 100%;
    margin: 0 10px;
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  .search-section {
    flex-direction: column;
    gap: 15px;
  }

  .main-weather {
    flex-direction: column;
    gap: 20px;
  }

  .temp-value {
    font-size: 3rem;
  }

  .weather-details {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .weather-app {
    padding: 12px;
  }

  .container {
    padding: 24px;
    border-radius: 20px;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 32px;
  }

  .search-section {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  .temp-value {
    font-size: 2.5rem;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .weather-app {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%);
  }

  .weather-app::before {
    background:
      radial-gradient(circle at 20% 80%, rgba(79, 70, 229, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(79, 70, 229, 0.15) 0%, transparent 50%);
  }

  .container {
    background: rgba(26, 32, 44, 0.95);
    color: #e2e8f0;
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  h1 {
    color: #e2e8f0;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .search-section {
    background: rgba(45, 55, 72, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .loading {
    background: linear-gradient(135deg, rgba(45, 55, 72, 0.9), rgba(26, 32, 44, 0.9));
    border-color: rgba(255, 255, 255, 0.1);
  }

  .loading-text p {
    color: #e2e8f0;
  }

  .loading-tip {
    color: #a0aec0 !important;
  }

  .error {
    background: linear-gradient(135deg, rgba(127, 29, 29, 0.9), rgba(153, 27, 27, 0.8));
    border-color: rgba(248, 113, 113, 0.2);
    color: #fca5a5;
  }

  .welcome {
    background: linear-gradient(135deg, rgba(45, 55, 72, 0.9), rgba(26, 32, 44, 0.8));
    border-color: rgba(255, 255, 255, 0.1);
    color: #a0aec0;
  }

  .location-name {
    color: #ddd;
  }

  .location-country {
    color: #b2bec3;
  }

  .update-time {
    color: #b2bec3;
  }

  .temp-value {
    color: #ddd;
  }

  .feels-like {
    color: #b2bec3;
  }

  .detail-label {
    color: #b2bec3;
  }

  .detail-value {
    color: #ddd;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .container {
    background: white;
    border: 2px solid #000;
  }

  h1 {
    color: #000;
  }

  .temp-value {
    color: #000;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>