import { WeatherModule } from '../../types/modules'
import { CurrentWeather, ForecastData } from '../../../../shared/types/common'

/**
 * 天气获取模块实现
 * 使用OpenWeatherMap API获取天气数据
 */
export class OpenWeatherMapModule implements WeatherModule {
  private apiKey: string

  constructor(apiKey?: string) {
    // 从环境变量获取API密钥，或使用传入的密钥
    this.apiKey = apiKey || process.env.OPENWEATHER_API_KEY || ''

    if (!this.apiKey) {
      console.warn('OpenWeatherMap API key not set. Using mock data.')
    }
  }

  async getCurrentWeather(location: string): Promise<CurrentWeather> {
    if (!this.apiKey) {
      // 返回模拟数据
      return this.getMockCurrentWeather(location)
    }

    try {
      // TODO: 实现真实的OpenWeatherMap API调用
      // 这里暂时返回模拟数据
      console.log(`Fetching current weather for: ${location}`)
      return this.getMockCurrentWeather(location)
    } catch (error) {
      console.error('Error fetching current weather:', error)
      // 失败时返回模拟数据
      return this.getMockCurrentWeather(location)
    }
  }

  async getForecast(location: string, days: number): Promise<ForecastData[]> {
    if (!this.apiKey) {
      // 返回模拟数据
      return this.getMockForecast(location, days)
    }

    try {
      // TODO: 实现真实的OpenWeatherMap API调用
      // 这里暂时返回模拟数据
      console.log(`Fetching ${days}-day forecast for: ${location}`)
      return this.getMockForecast(location, days)
    } catch (error) {
      console.error('Error fetching forecast:', error)
      // 失败时返回模拟数据
      return this.getMockForecast(location, days)
    }
  }

  // 模拟当前天气数据
  private getMockCurrentWeather(location: string): CurrentWeather {
    const now = Date.now()
    const baseTemp = 20 + Math.random() * 10 // 20-30°C

    return {
      location,
      temperature: Math.round(baseTemp * 10) / 10,
      feelsLike: Math.round((baseTemp + 2) * 10) / 10,
      humidity: Math.round(50 + Math.random() * 30),
      windSpeed: Math.round((2 + Math.random() * 5) * 10) / 10,
      windDirection: Math.round(Math.random() * 360),
      description: '晴朗',
      icon: '01d',
      pressure: 1013,
      visibility: 10000,
      uvIndex: Math.round(3 + Math.random() * 7),
      sunrise: now - 3600000 * 6, // 6小时前
      sunset: now + 3600000 * 6, // 6小时后
      timestamp: now
    }
  }

  // 模拟预报数据
  private getMockForecast(location: string, days: number): ForecastData[] {
    const forecast: ForecastData[] = []
    const now = Date.now()
    const baseDate = new Date(now)

    for (let i = 0; i < days; i++) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + i)

      const dateStr = date.toISOString().split('T')[0]
      const baseTemp = 18 + Math.random() * 12 // 18-30°C

      forecast.push({
        date: dateStr,
        temperature: Math.round(baseTemp * 10) / 10,
        feelsLike: Math.round((baseTemp + 1) * 10) / 10,
        minTemp: Math.round((baseTemp - 5) * 10) / 10,
        maxTemp: Math.round((baseTemp + 5) * 10) / 10,
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round((1 + Math.random() * 6) * 10) / 10,
        windDirection: Math.round(Math.random() * 360),
        description: i % 3 === 0 ? '晴朗' : i % 3 === 1 ? '多云' : '小雨',
        icon: i % 3 === 0 ? '01d' : i % 3 === 1 ? '03d' : '10d',
        precipitation: i % 3 === 2 ? Math.round(Math.random() * 5 * 10) / 10 : 0,
        precipitationProbability: i % 3 === 2 ? Math.round(30 + Math.random() * 70) : 0,
        cloudiness: i % 3 === 0 ? 10 : i % 3 === 1 ? 60 : 80,
        pressure: 1010 + Math.round(Math.random() * 10)
      })
    }

    return forecast
  }
}

/**
 * 创建天气获取模块实例
 */
export function createWeatherModule(apiKey?: string): WeatherModule {
  return new OpenWeatherMapModule(apiKey)
}