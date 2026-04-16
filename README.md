# 智能穿搭助手 - Smart Fashion Assistant

基于实时天气数据的智能穿搭建议系统。

## 功能特点
- 🌤️ 实时天气数据获取（OpenWeatherMap API）
- 📊 天气趋势分析与可视化
- 👗 个性化穿搭建议
- 📱 响应式设计，移动端友好
- 🔒 API密钥安全隔离（后端代理）

## 技术架构
### 多Agent系统设计
1. **WeatherAgent** - 天气数据获取
2. **AnalysisAgent** - 天气趋势分析
3. **ChartAgent** - 数据可视化
4. **FashionAgent** - 穿搭建议生成

### 技术栈
- **前端**: React + TypeScript + Vite
- **UI组件**: Ant Design
- **图表**: Recharts
- **后端**: Netlify Functions (Node.js)
- **天气API**: OpenWeatherMap
- **部署**: Netlify

## 项目结构
```
smart-fashion-assistant/
├── frontend/          # 前端React应用
├── netlify/          # Netlify Functions
├── shared/           # 共享类型和常量
├── .env.example      # 环境变量示例
├── netlify.toml      # Netlify配置
└── README.md         # 项目文档
```

## 快速开始

### 1. 环境准备
```bash
# 克隆项目
git clone <repository-url>
cd smart-fashion-assistant

# 安装依赖
npm install
cd frontend && npm install
```

### 2. 配置API密钥
1. 注册 [OpenWeatherMap](https://openweathermap.org/api) 获取API密钥
2. 创建 `.env` 文件（基于 `.env.example`）
3. 设置 `OPENWEATHER_API_KEY`

### 3. 本地开发
```bash
# 启动前端开发服务器
npm run dev:frontend

# 启动Netlify Functions本地模拟
npm run dev:functions

# 或同时启动两者
npm run dev
```

### 4. 构建部署
```bash
# 构建前端
npm run build

# 本地预览
npm run preview
```

## 部署到Netlify
1. 将代码推送到GitHub/GitLab仓库
2. 登录 [Netlify](https://app.netlify.com)
3. 选择"New site from Git"
4. 选择仓库，配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. 设置环境变量 `OPENWEATHER_API_KEY`
6. 点击"Deploy site"

## 团队分工
### Agent开发团队
- **WeatherAgent小组**: 天气API集成，数据获取
- **AnalysisAgent小组**: 趋势分析算法
- **ChartAgent小组**: 可视化图表生成
- **FashionAgent小组**: 穿搭规则引擎

### 前端团队
- UI组件开发，用户交互
- 状态管理，API集成

### 后端/编排团队
- Netlify Functions配置
- Agent编排，API设计

### DevOps团队
- 部署配置，环境管理
- 监控优化

## API接口
### 主要端点
```
POST /.netlify/functions/fashion-assistant
```
**请求示例**:
```json
{
  "location": "北京",
  "days": 7
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "weather": {...},
    "forecast": [...],
    "analysis": {...},
    "charts": [...],
    "recommendation": {...}
  }
}
```

## 开发指南
### 添加新的Agent
1. 在 `netlify/functions/fashion-assistant/agents/` 创建新目录
2. 实现Agent接口
3. 在编排器中注册Agent
4. 更新类型定义

### 前端组件开发
1. 在 `frontend/src/components/` 创建组件
2. 使用TypeScript定义props
3. 集成到App中
4. 添加样式和交互

## 许可证
MIT License

## 贡献
欢迎提交Issue和Pull Request！