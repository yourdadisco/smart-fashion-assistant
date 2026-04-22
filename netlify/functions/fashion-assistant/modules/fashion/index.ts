import { FashionModule } from '../../types/modules'
import {
  CurrentWeather,
  WeatherAnalysis,
  FashionRecommendation,
  ClothingLayer,
  AccessoryRecommendation,
  OutfitSuggestion
} from '../../../../shared/types/common'
import { callDeepSeek } from './deepseek-client'
import { SYSTEM_PROMPT, buildUserPrompt } from './deepseek-prompts'
import { FashionRecommendationModule } from './index.rule-based'

const fallbackModule = new FashionRecommendationModule()

export class DeepSeekFashionModule implements FashionModule {
  async generateRecommendation(
    weather: CurrentWeather,
    analysis: WeatherAnalysis
  ): Promise<FashionRecommendation> {
    try {
      const userPrompt = buildUserPrompt(weather, analysis)
      const raw = await callDeepSeek(SYSTEM_PROMPT, userPrompt)

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
    return {
      summary: String(raw.summary || ''),
      temperatureRange: String(raw.temperatureRange || ''),
      layers: Array.isArray(raw.layers) ? raw.layers as ClothingLayer[] : [],
      outfits: Array.isArray(raw.outfits) ? raw.outfits as OutfitSuggestion[] : [],
      accessories: Array.isArray(raw.accessories) ? raw.accessories as AccessoryRecommendation[] : [],
      warnings: Array.isArray(raw.warnings) ? raw.warnings as string[] : []
    }
  }
}

export function createFashionModule(): FashionModule {
  return new DeepSeekFashionModule()
}
