// 通用类型定义

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'area'
  title: string
  data: any[]
  xAxis: {
    dataKey: string
    label: string
  }
  yAxis: {
    label: string
    unit?: string
  }
  series: Array<{
    dataKey: string
    name: string
    color: string
    strokeWidth?: number
  }>
}

export interface LocationRequest {
  location: string
  days?: number // 预报天数，默认7
}

export interface CompleteAnalysisResponse {
  weather: CurrentWeather
  forecast: ForecastData[]
  analysis: WeatherAnalysis
  charts: ChartConfig[]
  recommendation: FashionRecommendation
}

// Re-export from other type files
export type { CurrentWeather, ForecastData, WeatherAnalysis } from './weather'
export type { FashionRecommendation, ClothingLayer } from './fashion'