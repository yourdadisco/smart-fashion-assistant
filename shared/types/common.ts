// 通用类型定义

import type { CurrentWeather, ForecastData, WeatherAnalysis } from './weather'
import type { FashionRecommendation } from './fashion'

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

// Re-export for convenience
export type { CurrentWeather, ForecastData, WeatherAnalysis } from './weather'
export type { FashionRecommendation } from './fashion'