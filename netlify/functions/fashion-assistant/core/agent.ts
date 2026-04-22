import { LocationRequest, CompleteAnalysisResponse } from '../../../shared/types/common'
import {
  WeatherModule,
  AnalysisModule,
  ChartModule,
  FashionModule
} from '../types/modules'

// 导入模块工厂函数
import { createWeatherModule } from '../modules/weather'
import { createAnalysisModule } from '../modules/analysis'
import { createChartModule } from '../modules/charts'
import { createFashionModule } from '../modules/fashion'

/**
 * 智能穿搭助手单一Agent核心类
 * 整合天气获取、分析、可视化、穿搭建议等多种能力
 */
export class FashionAssistantAgent {
  private weatherModule: WeatherModule
  private analysisModule: AnalysisModule
  private chartModule: ChartModule
  private fashionModule: FashionModule

  constructor(
    weatherModule?: WeatherModule,
    analysisModule?: AnalysisModule,
    chartModule?: ChartModule,
    fashionModule?: FashionModule
  ) {
    // 如果没有提供模块，使用实际实现的模块
    this.weatherModule = weatherModule || createWeatherModule()
    this.analysisModule = analysisModule || createAnalysisModule()
    this.chartModule = chartModule || createChartModule()
    this.fashionModule = fashionModule || createFashionModule()
  }

  /**
   * 核心方法：处理位置请求，返回完整分析结果
   */
  async processLocation(request: LocationRequest): Promise<CompleteAnalysisResponse> {
    try {
      console.log(`Processing location request: ${request.location}, days: ${request.days || 7}`)

      // 1. 获取天气数据
      const weather = await this.weatherModule.getCurrentWeather(request.location)
      const forecast = await this.weatherModule.getForecast(request.location, request.days || 7)

      // 2. 分析天气趋势
      const analysis = this.analysisModule.analyzeTrends(forecast)

      // 3. 生成图表数据
      const charts = this.chartModule.generateCharts(forecast)

      // 4. 提供穿搭建议
      const recommendation = await this.fashionModule.generateRecommendation(weather, analysis)

      // 5. 返回完整结果
      return {
        weather,
        forecast,
        analysis,
        charts,
        recommendation
      }
    } catch (error) {
      console.error('Error processing location request:', error)
      throw new Error(`Failed to process location request: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 健康检查方法
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; modules: string[] }> {
    const modules = [
      this.weatherModule.constructor.name,
      this.analysisModule.constructor.name,
      this.chartModule.constructor.name,
      this.fashionModule.constructor.name
    ]

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      modules
    }
  }




}

/**
 * 创建并返回一个配置好的Agent实例
 */
export function createFashionAssistantAgent(): FashionAssistantAgent {
  return new FashionAssistantAgent()
}