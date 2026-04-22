// 模块接口定义
import {
  CurrentWeather,
  ForecastData,
  WeatherAnalysis,
  WeatherChangePoint,
  ChartConfig,
  FashionRecommendation,
  ClothingLayer,
  AccessoryRecommendation
} from '../../../shared/types/common'

/**
 * 天气获取模块接口
 */
export interface WeatherModule {
  /**
   * 获取当前天气
   */
  getCurrentWeather(location: string): Promise<CurrentWeather>

  /**
   * 获取天气预报
   * @param location 位置
   * @param days 预报天数
   */
  getForecast(location: string, days: number): Promise<ForecastData[]>
}

/**
 * 分析模块接口
 */
export interface AnalysisModule {
  /**
   * 分析天气趋势
   */
  analyzeTrends(forecast: ForecastData[]): WeatherAnalysis

  /**
   * 识别关键变化点
   */
  identifyKeyChanges(forecast: ForecastData[]): WeatherChangePoint[]

  /**
   * 计算舒适度指数
   */
  calculateComfortIndex(temp: number, humidity: number, wind: number): number
}

/**
 * 可视化模块接口
 */
export interface ChartModule {
  /**
   * 生成所有图表配置
   */
  generateCharts(forecast: ForecastData[]): ChartConfig[]

  /**
   * 生成温度趋势图表
   */
  generateTemperatureChart(forecast: ForecastData[]): ChartConfig

  /**
   * 生成降水概率图表
   */
  generatePrecipitationChart(forecast: ForecastData[]): ChartConfig

  /**
   * 生成风速图表
   */
  generateWindChart(forecast: ForecastData[]): ChartConfig
}

/**
 * 穿搭建议模块接口
 */
export interface FashionModule {
  /**
   * 生成穿搭建议
   */
  generateRecommendation(weather: CurrentWeather, analysis: WeatherAnalysis, forecast?: ForecastData[]): Promise<FashionRecommendation>

  /**
   * 建议服装分层
   */
  suggestLayers(temperature: number, conditions: string, windSpeed: number): ClothingLayer[]

  /**
   * 建议配饰
   */
  suggestAccessories(conditions: string, uvIndex: number): AccessoryRecommendation[]
}