import { ChartModule } from '../../types/modules'
import { ForecastData } from '../../../../shared/types/common'

/**
 * 图表模块实现
 * 基于天气数据生成可视化图表配置
 */
export class ChartModuleImpl implements ChartModule {
  /**
   * 生成所有图表配置
   */
  generateCharts(forecast: ForecastData[]): import('../../../../shared/types/common').ChartConfig[] {
    return [
      this.generateTemperatureChart(forecast),
      this.generatePrecipitationChart(forecast),
      this.generateWindChart(forecast)
    ]
  }

  /**
   * 生成温度趋势图表
   */
  generateTemperatureChart(forecast: ForecastData[]): import('../../../../shared/types/common').ChartConfig {
    const data = forecast.map(day => ({
      date: this.formatDate(day.date),
      温度: day.temperature,
      最高温度: day.maxTemp,
      最低温度: day.minTemp,
      体感温度: day.feelsLike
    }))

    return {
      type: 'line',
      title: '温度趋势',
      data,
      xAxis: {
        dataKey: 'date',
        label: '日期'
      },
      yAxis: {
        label: '温度 (°C)',
        unit: '°C'
      },
      series: [
        {
          dataKey: '温度',
          name: '平均温度',
          color: '#ff6b6b',
          strokeWidth: 3
        },
        {
          dataKey: '最高温度',
          name: '最高温度',
          color: '#ff8e53',
          strokeWidth: 2
        },
        {
          dataKey: '最低温度',
          name: '最低温度',
          color: '#4d96ff',
          strokeWidth: 2
        },
        {
          dataKey: '体感温度',
          name: '体感温度',
          color: '#6bcf7f',
          strokeWidth: 2
        }
      ]
    }
  }

  /**
   * 生成降水概率图表
   */
  generatePrecipitationChart(forecast: ForecastData[]): import('../../../../shared/types/common').ChartConfig {
    const data = forecast.map(day => ({
      date: this.formatDate(day.date),
      降水概率: day.precipitationProbability,
      降水量: day.precipitation,
      湿度: day.humidity,
      云量: day.cloudiness
    }))

    return {
      type: 'bar',
      title: '降水概率',
      data,
      xAxis: {
        dataKey: 'date',
        label: '日期'
      },
      yAxis: {
        label: '概率 (%)',
        unit: '%'
      },
      series: [
        {
          dataKey: '降水概率',
          name: '降水概率',
          color: '#4d96ff',
          strokeWidth: 2
        },
        {
          dataKey: '降水量',
          name: '降水量 (mm)',
          color: '#1e6bff',
          strokeWidth: 2
        }
      ]
    }
  }

  /**
   * 生成风速图表
   */
  generateWindChart(forecast: ForecastData[]): import('../../../../shared/types/common').ChartConfig {
    const data = forecast.map(day => ({
      date: this.formatDate(day.date),
      风速: day.windSpeed,
      风向: day.windDirection,
      气压: day.pressure
    }))

    return {
      type: 'area',
      title: '风速与气压',
      data,
      xAxis: {
        dataKey: 'date',
        label: '日期'
      },
      yAxis: {
        label: '风速 (m/s)',
        unit: 'm/s'
      },
      series: [
        {
          dataKey: '风速',
          name: '风速',
          color: '#6bcf7f',
          strokeWidth: 2
        },
        {
          dataKey: '气压',
          name: '气压 (hPa)',
          color: '#9d7fff',
          strokeWidth: 2
        }
      ]
    }
  }

  /**
   * 格式化日期字符串（从YYYY-MM-DD到MM/DD）
   */
  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}`
    } catch {
      return dateStr
    }
  }
}

/**
 * 创建图表模块实例
 */
export function createChartModule(): ChartModule {
  return new ChartModuleImpl()
}