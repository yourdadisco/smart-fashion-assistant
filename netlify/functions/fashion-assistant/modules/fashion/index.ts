import { FashionModule } from '../../types/modules'
import {
  CurrentWeather,
  WeatherAnalysis,
  ForecastData,
  FashionRecommendation,
  ClothingLayer,
  AccessoryRecommendation,
  OutfitSuggestion
} from '../../../../shared/types/common'
import { callDeepSeek } from './deepseek-client'
import { SYSTEM_PROMPT, SYSTEM_PROMPT_SIMPLE, buildUserPrompt } from './deepseek-prompts'
import { FashionRecommendationModule } from './index.rule-based'

const fallbackModule = new FashionRecommendationModule()

export class DeepSeekFashionModule implements FashionModule {
  async generateRecommendation(
    weather: CurrentWeather,
    analysis: WeatherAnalysis,
    forecast?: ForecastData[]
  ): Promise<FashionRecommendation> {
    try {
      const userPrompt = buildUserPrompt(weather, analysis, forecast)
      const raw = await callDeepSeek(SYSTEM_PROMPT_SIMPLE, userPrompt)

      const recommendation = this.parseRecommendation(raw)
      recommendation.isAIGenerated = true
      return recommendation
    } catch (error) {
      console.error('DeepSeek API failed, falling back to rule-based:', error)
      const fallback = fallbackModule.generateRecommendation(weather, analysis)
      fallback.isAIGenerated = false
      return fallback
    }
  }

  suggestLayers(temperature: number, conditions: string, windSpeed: number): ClothingLayer[] {
    return fallbackModule.suggestLayers(temperature, conditions, windSpeed)
  }

  suggestAccessories(conditions: string, uvIndex: number): AccessoryRecommendation[] {
    return fallbackModule.suggestAccessories(conditions, uvIndex)
  }

  private parseRecommendation(raw: Record<string, unknown>): FashionRecommendation {
    // 处理简化输出，确保所有字段都有默认值
    const layers = Array.isArray(raw.layers) ? raw.layers.map(layer => ({
      layer: String((layer as any).layer || ''),
      name: String((layer as any).name || ''),
      description: String((layer as any).description || ''),
      materials: Array.isArray((layer as any).materials) ? (layer as any).materials : [],
      colors: Array.isArray((layer as any).colors) ? (layer as any).colors : [],
      necessity: String((layer as any).necessity || 'recommended')
    })) : []

    const outfits = Array.isArray(raw.outfits) ? raw.outfits.map(outfit => ({
      name: String((outfit as any).name || ''),
      description: String((outfit as any).description || ''),
      items: Array.isArray((outfit as any).items) ? (outfit as any).items : [],
      occasion: Array.isArray((outfit as any).occasion) ? (outfit as any).occasion : []
    })) : []

    const accessories = Array.isArray(raw.accessories) ? raw.accessories.map(accessory => ({
      type: String((accessory as any).type || ''),
      name: String((accessory as any).name || ''),
      description: String((accessory as any).description || ''),
      reason: String((accessory as any).reason || '')
    })) : []

    return {
      summary: String(raw.summary || ''),
      temperatureRange: String(raw.temperatureRange || ''),
      layers,
      outfits,
      accessories,
      warnings: Array.isArray(raw.warnings) ? raw.warnings as string[] : []
    }
  }
}

export function createFashionModule(): FashionModule {
  // 使用AI生成穿搭建议，简化提示以加快响应
  return new DeepSeekFashionModule()
}
