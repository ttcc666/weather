# Vue3 + TypeScript 实时天气应用

## 项目介绍

这是一个基于 Vue3 和 TypeScript 构建的实时天气应用，支持城市搜索和地理定位功能。

## 功能特性

- 🌤️ 实时天气数据显示
- 🔍 城市搜索功能
- 📍 地理定位获取当前位置天气
- 📱 响应式设计，支持移动设备
- 🎨 美观的用户界面

## 使用说明

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

在 `src/services/weather.ts` 文件中，将 `API_KEY` 替换为你的 WeatherAPI 密钥：

```typescript
const API_KEY = '你的WeatherAPI密钥';
```

**获取 WeatherAPI 密钥：**

1. 访问 [WeatherAPI官网](https://www.weatherapi.com/)
2. 注册账号并获取免费 API Key
3. 将 API Key 替换到代码中

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## 技术栈

- Vue 3 (Composition API)
- TypeScript
- Vite
- Axios (HTTP 请求)
- WeatherAPI (天气数据源)

## 项目结构

```
src/
├── components/
│   └── WeatherApp.vue     # 主天气组件
├── services/
│   └── weather.ts         # 天气API服务
├── types/
│   └── weather.ts         # 类型定义
├── App.vue                # 根组件
├── main.ts                # 入口文件
└── vite-env.d.ts          # Vite类型声明
```

## 注意事项

- 使用地理定位功能需要用户授权
- 建议在 HTTPS 环境下使用地理定位功能
- WeatherAPI 免费版本有请求限制，请合理使用
