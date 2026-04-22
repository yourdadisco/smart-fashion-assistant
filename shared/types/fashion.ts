// 穿搭建议数据类型定义

export interface FashionRecommendation {
  summary: string // 穿搭总结
  temperatureRange: string // 温度范围描述
  layers: ClothingLayer[] // 服装分层建议
  outfits: OutfitSuggestion[] // 完整穿搭建议
  accessories: AccessoryRecommendation[] // 配饰建议
  warnings: string[] // 注意事项
  isAIGenerated?: boolean // 是否由AI生成
}

export interface ClothingLayer {
  layer: 'base' | 'mid' | 'outer' | 'bottom' | 'footwear'
  name: string // 服装名称
  description: string // 描述
  materials: string[] // 推荐材质
  colors?: string[] // 推荐颜色
  necessity: 'essential' | 'recommended' | 'optional' // 必要性
}

export interface OutfitSuggestion {
  name: string // 穿搭方案名称
  description: string // 描述
  items: string[] // 包含的服装项
  occasion: string[] // 适用场合
}

export interface AccessoryRecommendation {
  type: 'head' | 'neck' | 'hand' | 'other'
  name: string // 配饰名称
  description: string // 描述
  reason: string // 推荐理由
}

export interface WeatherCondition {
  temperature: number
  description: string
  windSpeed: number
  humidity: number
  precipitation: number
}