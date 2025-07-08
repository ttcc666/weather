# Vercel部署配置

## 部署步骤

### 1. 准备工作
- 确保代码已推送到GitHub仓库
- 在WeatherAPI官网获取API密钥

### 2. 配置环境变量
在Vercel项目设置中添加环境变量：
- `VITE_WEATHER_API_KEY`: 你的WeatherAPI密钥

### 3. 部署到Vercel
1. 访问 [Vercel官网](https://vercel.com/)
2. 登录并连接GitHub账户
3. 点击"New Project"
4. 选择你的GitHub仓库
5. 配置项目：
   - Framework Preset: Vue.js
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 添加环境变量：
   - Name: `VITE_WEATHER_API_KEY`
   - Value: 你的WeatherAPI密钥
7. 点击"Deploy"

### 4. 自动部署
- 每次推送到main分支都会自动触发部署
- 可以在Vercel仪表板查看部署状态

## 注意事项

### API密钥安全
- 由于这是前端应用，API密钥会暴露在客户端
- 建议在WeatherAPI控制台设置域名白名单
- 仅允许你的Vercel域名访问API

### 域名配置
- Vercel会自动分配一个.vercel.app域名
- 可以在项目设置中添加自定义域名

### 环境变量
- 所有以`VITE_`开头的环境变量都会暴露到客户端
- 确保不要在环境变量中存储敏感信息

## 文件说明

### vercel.json
- 配置Vercel部署行为
- 设置构建命令和输出目录
- 配置SPA路由重定向

### package.json
- 添加了`vercel-build`脚本
- 确保所有依赖都正确安装

## 故障排除

### 构建失败
- 检查TypeScript类型错误
- 确保所有依赖都已安装
- 查看Vercel构建日志

### API请求失败
- 确认API密钥是否正确设置
- 检查WeatherAPI账户配额
- 验证域名是否在白名单中