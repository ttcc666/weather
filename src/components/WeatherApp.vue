<template>
  <div class="weather-app">
    <div class="container">
      <h1>实时天气</h1>
      
      <div class="search-section">
        <select 
          v-model="selectedCity" 
          class="city-select"
          @change="searchWeather"
        >
          <option value="">请选择城市</option>
          <optgroup v-for="(cities, province) in groupedCities" :key="province" :label="province">
            <option v-for="city in cities" :key="city.value" :value="city.value">
              {{ city.label }}
            </option>
          </optgroup>
        </select>
        <button @click="getCurrentLocationWeather" class="location-btn">📍 定位</button>
      </div>

      <div v-if="loading" class="loading">
        加载中...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else-if="weatherData" class="weather-content">
        <div class="current-weather">
          <div class="location-info">
            <h2>{{ weatherData.location.name }}</h2>
            <p>{{ weatherData.location.region }}, {{ weatherData.location.country }}</p>
            <p class="last-updated">更新时间: {{ formatTime(weatherData.current.last_updated) }}</p>
          </div>

          <div class="main-weather">
            <div class="temperature">
              <span class="temp-value">{{ Math.round(weatherData.current.temp_c) }}°</span>
              <span class="temp-unit">C</span>
            </div>
            <div class="condition">
              <img :src="'https:' + weatherData.current.condition.icon" :alt="weatherData.current.condition.text">
              <p>{{ weatherData.current.condition.text }}</p>
            </div>
          </div>

          <div class="feels-like">
            体感温度: {{ Math.round(weatherData.current.feelslike_c) }}°C
          </div>
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
import type { WeatherData } from '../types/weather';
import { groupedCities } from '../data/cities';

const weatherData = ref<WeatherData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedCity = ref('');

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN');
};

const searchWeather = async () => {
  if (!selectedCity.value.trim()) {
    error.value = '请选择城市';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const data = await weatherService.getCurrentWeather(selectedCity.value);
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
    const location = await locationService.getCurrentLocation();
    const data = await weatherService.getWeatherByCoords(location.lat, location.lon);
    weatherData.value = data;
    // 定位后不需要设置选中的城市，因为使用的是坐标
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取位置或天气数据失败';
    weatherData.value = null;
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
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  color: #2d3436;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: 300;
}

.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
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
  padding: 12px 20px;
  background: #74b9ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.location-btn:hover {
  background: #0984e3;
}

.loading, .error, .welcome {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #e74c3c;
}

.welcome {
  color: #636e72;
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

@media (max-width: 768px) {
  .container {
    margin: 0 10px;
    padding: 20px;
  }
  
  .search-section {
    flex-direction: column;
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
  }
}
</style>