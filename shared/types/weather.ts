// 天气数据类型定义

export interface CurrentWeather {
  location: string
  temperature: number // 温度(摄氏度)
  feelsLike: number // 体感温度
  humidity: number // 湿度(%)
  windSpeed: number // 风速(m/s)
  windDirection: number // 风向(度)
  description: string // 天气描述
  icon: string // 图标代码
  pressure: number // 气压(hPa)
  visibility: number // 能见度(m)
  uvIndex: number // UV指数
  sunrise: number // 日出时间(Unix时间戳)
  sunset: number // 日落时间(Unix时间戳)
  timestamp: number // 数据时间戳
}

export interface ForecastData {
  date: string // 日期 YYYY-MM-DD
  time?: string // 时间 HH:MM (对于小时预报)
  temperature: number // 温度
  feelsLike: number // 体感温度
  minTemp: number // 最低温度
  maxTemp: number // 最高温度
  humidity: number // 湿度
  windSpeed: number // 风速
  windDirection: number // 风向
  description: string // 天气描述
  icon: string // 图标代码
  precipitation: number // 降水量(mm)
  precipitationProbability: number // 降水概率(%)
  cloudiness: number // 云量(%)
  pressure: number // 气压
}

export interface WeatherAnalysis {
  summary: string // 天气总结
  trends: {
    temperature: TrendAnalysis
    precipitation: TrendAnalysis
    wind: TrendAnalysis
  }
  keyChanges: WeatherChangePoint[]
  comfortIndex: number // 舒适度指数 0-100
  recommendations: string[] // 天气相关建议
}

export interface TrendAnalysis {
  trend: 'increasing' | 'decreasing' | 'stable'
  rate: number // 变化速率
  confidence: number // 置信度 0-100
}

export interface WeatherChangePoint {
  time: string // 时间点
  changeType: 'temperature' | 'precipitation' | 'wind' | 'condition'
  description: string // 变化描述
  significance: 'low' | 'medium' | 'high' // 变化显著程度
}