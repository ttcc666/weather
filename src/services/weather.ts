import axios from 'axios';
import type { WeatherData, ForecastData, LocationData } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '56857a6baef7430fbce51808250807';
const BASE_URL = 'https://api.weatherapi.com/v1';
// https://api.weatherapi.com/v1/current.json?key=56857a6baef7430fbce51808250807&q=London&aqi=no

const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const weatherService = {
  async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      const response = await weatherApi.get('/current.json', {
        params: {
          key: API_KEY,
          q: location,
          aqi: 'no'
        }
      });
      return response.data;
    } catch (error) {
      console.error('获取当前天气失败:', error);
      throw new Error('无法获取天气数据');
    }
  },

  async getForecast(location: string, days: number = 3): Promise<ForecastData> {
    try {
      const response = await weatherApi.get('/forecast.json', {
        params: {
          key: API_KEY,
          q: location,
          days: days,
          aqi: 'no',
          alerts: 'no'
        }
      });
      return response.data;
    } catch (error) {
      console.error('获取天气预报失败:', error);
      throw new Error('无法获取天气预报数据');
    }
  },

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await weatherApi.get('/current.json', {
        params: {
          key: API_KEY,
          q: `${lat},${lon}`,
          aqi: 'no'
        }
      });
      return response.data;
    } catch (error) {
      console.error('根据坐标获取天气失败:', error);
      throw new Error('无法获取天气数据');
    }
  }
};

export const locationService = {
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('此浏览器不支持地理定位'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('用户拒绝了地理定位请求'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('位置信息不可用'));
              break;
            case error.TIMEOUT:
              reject(new Error('获取位置信息超时'));
              break;
            default:
              reject(new Error('获取位置信息时发生未知错误'));
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        }
      );
    });
  }
};