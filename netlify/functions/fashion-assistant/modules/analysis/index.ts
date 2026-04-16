import { AnalysisModule } from '../../types/modules'
import { ForecastData, WeatherAnalysis, WeatherChangePoint, TrendAnalysis } from '../../../../shared/types/common'

/**
 * 分析模块实现
 * 分析天气趋势和关键变化
 */
export class WeatherAnalysisModule implements AnalysisModule {
  analyzeTrends(forecast: ForecastData[]): WeatherAnalysis {
    if (forecast.length === 0) {
      return this.getEmptyAnalysis()
    }

    // 分析温度趋势
    const temperatureTrend = this.analyzeTemperatureTrend(forecast)

    // 分析降水趋势
    const precipitationTrend = this.analyzePrecipitationTrend(forecast)

    // 分析风速趋势
    const windTrend = this.analyzeWindTrend(forecast)

    // 识别关键变化点
    const keyChanges = this.identifyKeyChanges(forecast)

    // 计算平均舒适度指数
    const avgTemp = forecast.reduce((sum, day) => sum + day.temperature, 0) / forecast.length
    const avgHumidity = forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length
    const avgWind = forecast.reduce((sum, day) => sum + day.windSpeed, 0) / forecast.length
    const comfortIndex = this.calculateComfortIndex(avgTemp, avgHumidity, avgWind)

    // 生成天气总结
    const summary = this.generateWeatherSummary(forecast, temperatureTrend, precipitationTrend)

    return {
      summary,
      trends: {
        temperature: temperatureTrend,
        precipitation: precipitationTrend,
        wind: windTrend
      },
      keyChanges,
      comfortIndex: Math.round(comfortIndex),
      recommendations: this.generateRecommendations(forecast, comfortIndex)
    }
  }

  identifyKeyChanges(forecast: ForecastData[]): WeatherChangePoint[] {
    const changes: WeatherChangePoint[] = []

    if (forecast.length < 2) {
      return changes
    }

    // 检测温度显著变化
    for (let i = 1; i < forecast.length; i++) {
      const prev = forecast[i - 1]
      const curr = forecast[i]
      const tempDiff = Math.abs(curr.temperature - prev.temperature)

      if (tempDiff > 5) {
        changes.push({
          time: curr.date,
          changeType: 'temperature',
          description: `温度变化 ${tempDiff.toFixed(1)}°C`,
          significance: tempDiff > 8 ? 'high' : tempDiff > 5 ? 'medium' : 'low'
        })
      }

      // 检测天气状况变化
      if (prev.description !== curr.description) {
        changes.push({
          time: curr.date,
          changeType: 'condition',
          description: `天气从${prev.description}变为${curr.description}`,
          significance: 'medium'
        })
      }

      // 检测降水概率显著增加
      const precipDiff = curr.precipitationProbability - prev.precipitationProbability
      if (precipDiff > 30) {
        changes.push({
          time: curr.date,
          changeType: 'precipitation',
          description: `降水概率增加 ${precipDiff}%`,
          significance: precipDiff > 50 ? 'high' : 'medium'
        })
      }
    }

    return changes
  }

  calculateComfortIndex(temp: number, humidity: number, wind: number): number {
    // 简化的舒适度指数计算
    // 理想温度: 20-25°C, 理想湿度: 40-60%, 理想风速: 1-3 m/s

    let score = 100

    // 温度评分
    if (temp < 10) score -= (10 - temp) * 3
    else if (temp < 20) score -= (20 - temp) * 2
    else if (temp > 30) score -= (temp - 30) * 3
    else if (temp > 25) score -= (temp - 25) * 2

    // 湿度评分
    if (humidity < 30) score -= (30 - humidity) * 0.5
    else if (humidity > 80) score -= (humidity - 80) * 0.5

    // 风速评分
    if (wind > 5) score -= (wind - 5) * 2

    // 确保分数在0-100之间
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  private analyzeTemperatureTrend(forecast: ForecastData[]): TrendAnalysis {
    if (forecast.length < 2) {
      return { trend: 'stable', rate: 0, confidence: 0 }
    }

    const firstTemp = forecast[0].temperature
    const lastTemp = forecast[forecast.length - 1].temperature
    const tempDiff = lastTemp - firstTemp
    const rate = tempDiff / forecast.length

    let trend: 'increasing' | 'decreasing' | 'stable'
    if (Math.abs(tempDiff) < 1) {
      trend = 'stable'
    } else if (tempDiff > 0) {
      trend = 'increasing'
    } else {
      trend = 'decreasing'
    }

    // 计算置信度（基于温度变化的一致性）
    let consistentCount = 0
    for (let i = 1; i < forecast.length; i++) {
      const diff = forecast[i].temperature - forecast[i - 1].temperature
      if ((trend === 'increasing' && diff >= 0) ||
          (trend === 'decreasing' && diff <= 0) ||
          (trend === 'stable' && Math.abs(diff) < 0.5)) {
        consistentCount++
      }
    }

    const confidence = Math.round((consistentCount / (forecast.length - 1)) * 100)

    return { trend, rate: Math.round(rate * 100) / 100, confidence }
  }

  private analyzePrecipitationTrend(forecast: ForecastData[]): TrendAnalysis {
    if (forecast.length < 2) {
      return { trend: 'stable', rate: 0, confidence: 0 }
    }

    const firstPrecip = forecast[0].precipitationProbability
    const lastPrecip = forecast[forecast.length - 1].precipitationProbability
    const precipDiff = lastPrecip - firstPrecip
    const rate = precipDiff / forecast.length

    let trend: 'increasing' | 'decreasing' | 'stable'
    if (Math.abs(precipDiff) < 10) {
      trend = 'stable'
    } else if (precipDiff > 0) {
      trend = 'increasing'
    } else {
      trend = 'decreasing'
    }

    return { trend, rate: Math.round(rate * 100) / 100, confidence: 70 }
  }

  private analyzeWindTrend(forecast: ForecastData[]): TrendAnalysis {
    if (forecast.length < 2) {
      return { trend: 'stable', rate: 0, confidence: 0 }
    }

    const firstWind = forecast[0].windSpeed
    const lastWind = forecast[forecast.length - 1].windSpeed
    const windDiff = lastWind - firstWind
    const rate = windDiff / forecast.length

    let trend: 'increasing' | 'decreasing' | 'stable'
    if (Math.abs(windDiff) < 1) {
      trend = 'stable'
    } else if (windDiff > 0) {
      trend = 'increasing'
    } else {
      trend = 'decreasing'
    }

    return { trend, rate: Math.round(rate * 100) / 100, confidence: 60 }
  }

  private generateWeatherSummary(
    forecast: ForecastData[],
    tempTrend: TrendAnalysis,
    precipTrend: TrendAnalysis
  ): string {
    const avgTemp = forecast.reduce((sum, day) => sum + day.temperature, 0) / forecast.length
    const maxTemp = Math.max(...forecast.map(day => day.temperature))
    const minTemp = Math.min(...forecast.map(day => day.temperature))
    const rainyDays = forecast.filter(day => day.precipitationProbability > 50).length

    const tempDescription = avgTemp > 28 ? '炎热' : avgTemp > 22 ? '温暖' : avgTemp > 15 ? '凉爽' : '寒冷'
    const trendDescription = tempTrend.trend === 'increasing' ? '上升' :
                            tempTrend.trend === 'decreasing' ? '下降' : '稳定'

    let summary = `未来${forecast.length}天平均温度${avgTemp.toFixed(1)}°C，天气${tempDescription}。`
    summary += `温度趋势${trendDescription}，最高${maxTemp.toFixed(1)}°C，最低${minTemp.toFixed(1)}°C。`

    if (rainyDays > 0) {
      summary += ` 其中${rainyDays}天可能有降水。`
    }

    if (precipTrend.trend === 'increasing') {
      summary += ' 降水概率逐渐增加。'
    } else if (precipTrend.trend === 'decreasing') {
      summary += ' 降水概率逐渐减少。'
    }

    return summary
  }

  private generateRecommendations(forecast: ForecastData[], comfortIndex: number): string[] {
    const recommendations: string[] = []
    const avgTemp = forecast.reduce((sum, day) => sum + day.temperature, 0) / forecast.length
    const maxPrecip = Math.max(...forecast.map(day => day.precipitationProbability))

    // 温度相关建议
    if (avgTemp > 28) {
      recommendations.push('天气炎热，注意防暑降温')
      recommendations.push('建议穿着轻薄透气的衣物')
    } else if (avgTemp > 22) {
      recommendations.push('天气温暖舒适')
      recommendations.push('适合穿着单层或薄外套')
    } else if (avgTemp > 15) {
      recommendations.push('天气凉爽，早晚温差较大')
      recommendations.push('建议穿着薄外套或毛衣')
    } else {
      recommendations.push('天气寒冷，注意保暖')
      recommendations.push('建议穿着厚外套或羽绒服')
    }

    // 降水相关建议
    if (maxPrecip > 70) {
      recommendations.push('有较高降水概率，建议携带雨具')
    } else if (maxPrecip > 40) {
      recommendations.push('可能有降水，建议备好雨具')
    }

    // 舒适度相关建议
    if (comfortIndex > 80) {
      recommendations.push('舒适度很高，适合户外活动')
    } else if (comfortIndex > 60) {
      recommendations.push('舒适度良好，大部分时间适宜外出')
    } else if (comfortIndex > 40) {
      recommendations.push('舒适度一般，注意天气变化')
    } else {
      recommendations.push('舒适度较低，建议减少外出')
    }

    return recommendations
  }

  private getEmptyAnalysis(): WeatherAnalysis {
    return {
      summary: '无天气数据',
      trends: {
        temperature: { trend: 'stable', rate: 0, confidence: 0 },
        precipitation: { trend: 'stable', rate: 0, confidence: 0 },
        wind: { trend: 'stable', rate: 0, confidence: 0 }
      },
      keyChanges: [],
      comfortIndex: 0,
      recommendations: ['请提供位置信息获取天气分析']
    }
  }
}

/**
 * 创建分析模块实例
 */
export function createAnalysisModule(): AnalysisModule {
  return new WeatherAnalysisModule()
}