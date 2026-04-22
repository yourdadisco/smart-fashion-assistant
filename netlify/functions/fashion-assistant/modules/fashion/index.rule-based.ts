import { FashionModule } from '../../types/modules'
import {
  CurrentWeather,
  WeatherAnalysis,
  FashionRecommendation,
  ClothingLayer,
  AccessoryRecommendation,
  OutfitSuggestion
} from '../../../../shared/types/common'

/**
 * 穿搭建议模块实现
 * 基于天气条件提供个性化的穿搭建议
 */
export class FashionRecommendationModule implements FashionModule {
  generateRecommendation(weather: CurrentWeather, analysis: WeatherAnalysis): FashionRecommendation {
    const temperature = weather.temperature
    const conditions = weather.description
    const windSpeed = weather.windSpeed
    const uvIndex = weather.uvIndex

    // 生成服装分层建议
    const layers = this.suggestLayers(temperature, conditions, windSpeed)

    // 生成配饰建议
    const accessories = this.suggestAccessories(conditions, uvIndex)

    // 生成完整穿搭方案
    const outfits = this.generateOutfits(temperature, conditions)

    // 生成温度范围描述
    const tempRange = this.getTemperatureRangeDescription(temperature)

    // 生成穿搭总结
    const summary = this.generateSummary(temperature, conditions, analysis.comfortIndex)

    // 生成注意事项
    const warnings = this.generateWarnings(weather, analysis)

    return {
      summary,
      temperatureRange: tempRange,
      layers,
      outfits,
      accessories,
      warnings
    }
  }

  suggestLayers(temperature: number, conditions: string, windSpeed: number): ClothingLayer[] {
    const layers: ClothingLayer[] = []

    // 基础层建议
    if (temperature >= 25) {
      layers.push({
        layer: 'base',
        name: '短袖T恤',
        description: '轻薄透气的短袖上衣',
        materials: ['棉', '麻', '莫代尔'],
        colors: ['白色', '浅蓝色', '浅灰色'],
        necessity: 'essential'
      })
    } else if (temperature >= 20) {
      layers.push({
        layer: 'base',
        name: '长袖T恤或薄衬衫',
        description: '适中的长袖上衣',
        materials: ['棉', '针织'],
        colors: ['蓝色', '灰色', '米色'],
        necessity: 'essential'
      })
    } else if (temperature >= 15) {
      layers.push({
        layer: 'base',
        name: '长袖打底衫',
        description: '保暖的长袖内衣',
        materials: ['棉', '羊毛混纺'],
        colors: ['黑色', '深灰色', '藏青色'],
        necessity: 'essential'
      })
    } else {
      layers.push({
        layer: 'base',
        name: '保暖内衣',
        description: '加绒或加厚的保暖内衣',
        materials: ['羊毛', '抓绒', '发热纤维'],
        colors: ['深色系'],
        necessity: 'essential'
      })
    }

    // 中间层建议（根据温度）
    if (temperature < 20) {
      const midLayer: ClothingLayer = {
        layer: 'mid',
        name: temperature < 10 ? '毛衣或抓绒衣' : '薄毛衣或卫衣',
        description: temperature < 10 ? '保暖的中间层' : '适中的中间层',
        materials: temperature < 10 ? ['羊毛', '羊绒', '抓绒'] : ['棉', '针织'],
        necessity: temperature < 15 ? 'essential' : 'recommended'
      }
      layers.push(midLayer)
    }

    // 外层建议（根据天气条件和风速）
    if (conditions.includes('雨')) {
      layers.push({
        layer: 'outer',
        name: '防水外套',
        description: '防雨防风的外套',
        materials: ['防水涂层', 'Gore-Tex'],
        colors: ['亮色系（提高能见度）'],
        necessity: 'essential'
      })
    } else if (windSpeed > 5 || temperature < 15) {
      layers.push({
        layer: 'outer',
        name: temperature < 10 ? '羽绒服或厚外套' : '风衣或夹克',
        description: '防风保暖的外套',
        materials: temperature < 10 ? ['羽绒', '羊毛呢'] : ['尼龙', '棉质'],
        necessity: 'essential'
      })
    } else if (temperature < 20) {
      layers.push({
        layer: 'outer',
        name: '薄外套',
        description: '轻便的外套，应对温差',
        materials: ['牛仔布', '棉质', '针织'],
        colors: ['卡其色', '藏青色', '黑色'],
        necessity: 'recommended'
      })
    }

    // 下装建议
    if (temperature >= 22) {
      layers.push({
        layer: 'bottom',
        name: '短裤或薄长裤',
        description: '凉爽的下装',
        materials: ['棉', '麻'],
        colors: ['浅色系'],
        necessity: 'essential'
      })
    } else if (temperature >= 15) {
      layers.push({
        layer: 'bottom',
        name: '长裤',
        description: '适中的长裤',
        materials: ['棉', '牛仔布', '混纺'],
        colors: ['蓝色', '灰色', '卡其色'],
        necessity: 'essential'
      })
    } else {
      layers.push({
        layer: 'bottom',
        name: '厚长裤或加绒裤',
        description: '保暖的下装',
        materials: ['羊毛呢', '灯芯绒', '加绒面料'],
        colors: ['深色系'],
        necessity: 'essential'
      })
    }

    // 鞋履建议
    if (conditions.includes('雨')) {
      layers.push({
        layer: 'footwear',
        name: '防水鞋或雨靴',
        description: '防水的鞋履',
        materials: ['橡胶', '防水皮革'],
        colors: ['黑色', '深蓝色'],
        necessity: 'essential'
      })
    } else if (temperature >= 20) {
      layers.push({
        layer: 'footwear',
        name: '运动鞋或休闲鞋',
        description: '透气的鞋履',
        materials: ['网面', '帆布'],
        colors: ['白色', '浅色'],
        necessity: 'essential'
      })
    } else {
      layers.push({
        layer: 'footwear',
        name: '保暖鞋或靴子',
        description: '保暖的鞋履',
        materials: ['皮革', '麂皮', '加绒内里'],
        colors: ['棕色', '黑色'],
        necessity: 'essential'
      })
    }

    return layers
  }

  suggestAccessories(conditions: string, uvIndex: number): AccessoryRecommendation[] {
    const accessories: AccessoryRecommendation[] = []

    // 头部配饰
    if (uvIndex > 5) {
      accessories.push({
        type: 'head',
        name: '遮阳帽或太阳镜',
        description: '防晒保护',
        reason: `紫外线指数较高（${uvIndex}），建议防晒`
      })
    }

    if (conditions.includes('雨')) {
      accessories.push({
        type: 'head',
        name: '雨伞或雨衣帽',
        description: '防雨装备',
        reason: '有降水，建议携带雨具'
      })
    }

    // 颈部配饰
    if (conditions.includes('风') || conditions.includes('冷')) {
      accessories.push({
        type: 'neck',
        name: '围巾',
        description: '保暖围巾',
        reason: '防风保暖，保护颈部'
      })
    }

    // 手部配饰
    if (conditions.includes('冷')) {
      accessories.push({
        type: 'hand',
        name: '手套',
        description: '保暖手套',
        reason: '天气寒冷，建议保暖手部'
      })
    }

    // 其他配饰
    if (conditions.includes('雨')) {
      accessories.push({
        type: 'other',
        name: '防水背包或袋子',
        description: '防水收纳',
        reason: '保护个人物品不被淋湿'
      })
    }

    return accessories
  }

  private generateOutfits(temperature: number, conditions: string): OutfitSuggestion[] {
    const outfits: OutfitSuggestion[] = []

    if (temperature >= 25) {
      outfits.push({
        name: '夏日休闲装',
        description: '适合炎热天气的轻便穿搭',
        items: ['短袖T恤', '短裤/薄长裤', '运动鞋', '遮阳帽'],
        occasion: ['日常出行', '休闲活动', '户外运动']
      })

      outfits.push({
        name: '商务休闲装',
        description: '适合办公环境的夏季穿搭',
        items: [' polo衫/短袖衬衫', '休闲裤', '乐福鞋', '简约手表'],
        occasion: ['办公', '商务会议', '正式场合']
      })
    } else if (temperature >= 20) {
      outfits.push({
        name: '春秋休闲装',
        description: '适合温暖天气的舒适穿搭',
        items: ['长袖T恤/薄衬衫', '牛仔裤/休闲裤', '休闲鞋', '薄外套（备用）'],
        occasion: ['日常出行', '约会', '休闲聚会']
      })

      outfits.push({
        name: '运动休闲装',
        description: '适合户外活动的穿搭',
        items: ['卫衣', '运动裤', '运动鞋', '背包'],
        occasion: ['户外运动', '徒步', '健身']
      })
    } else if (temperature >= 15) {
      outfits.push({
        name: '秋季温暖装',
        description: '适合凉爽天气的保暖穿搭',
        items: ['长袖打底衫', '毛衣/卫衣', '长裤', '薄外套'],
        occasion: ['日常出行', '上班', '休闲活动']
      })

      outfits.push({
        name: '户外活动装',
        description: '适合户外活动的多层穿搭',
        items: ['保暖内衣', '抓绒衣', '防风外套', '登山鞋'],
        occasion: ['徒步', '登山', '户外工作']
      })
    } else {
      outfits.push({
        name: '冬季保暖装',
        description: '适合寒冷天气的重度保暖穿搭',
        items: ['保暖内衣', '厚毛衣', '羽绒服', '加绒裤', '保暖靴'],
        occasion: ['日常出行', '户外活动', '冬季运动']
      })

      outfits.push({
        name: '商务正装（冬季）',
        description: '适合正式场合的冬季穿搭',
        items: ['衬衫', '西装', '大衣', '皮鞋', '围巾'],
        occasion: ['办公', '商务会议', '正式场合']
      })
    }

    // 根据天气条件调整
    if (conditions.includes('雨')) {
      outfits.forEach(outfit => {
        outfit.items.push('雨伞/雨衣')
        outfit.description += '（雨天版）'
      })
    }

    return outfits
  }

  private getTemperatureRangeDescription(temperature: number): string {
    if (temperature >= 28) return '炎热（28°C以上）'
    if (temperature >= 25) return '温暖偏热（25-28°C）'
    if (temperature >= 22) return '温暖舒适（22-25°C）'
    if (temperature >= 18) return '凉爽舒适（18-22°C）'
    if (temperature >= 15) return '凉爽（15-18°C）'
    if (temperature >= 10) return '微冷（10-15°C）'
    if (temperature >= 5) return '寒冷（5-10°C）'
    return '严寒（5°C以下）'
  }

  private generateSummary(temperature: number, conditions: string, comfortIndex: number): string {
    const tempDesc = this.getTemperatureRangeDescription(temperature)
    let summary = `当前天气${tempDesc}，${conditions}。`

    if (comfortIndex >= 80) {
      summary += ' 舒适度很高，穿着选择广泛。'
    } else if (comfortIndex >= 60) {
      summary += ' 舒适度良好，注意适当调整穿着。'
    } else if (comfortIndex >= 40) {
      summary += ' 舒适度一般，建议根据体感调整穿着。'
    } else {
      summary += ' 舒适度较低，需要注意保暖或防暑。'
    }

    if (conditions.includes('雨')) {
      summary += ' 有降水，请务必准备雨具。'
    }

    if (conditions.includes('风')) {
      summary += ' 有风，建议穿着防风外套。'
    }

    return summary
  }

  private generateWarnings(weather: CurrentWeather, analysis: WeatherAnalysis): string[] {
    const warnings: string[] = []

    // 温度警告
    if (weather.temperature >= 30) {
      warnings.push('高温警告：天气炎热，注意防暑降温，避免长时间户外活动')
    } else if (weather.temperature <= 5) {
      warnings.push('低温警告：天气寒冷，注意保暖，预防感冒')
    }

    // 降水警告
    if (weather.description.includes('雨') || weather.description.includes('雪')) {
      warnings.push('降水警告：路面可能湿滑，出行注意安全')
    }

    // 大风警告
    if (weather.windSpeed > 8) {
      warnings.push('大风警告：风力较大，注意防风，避免高空坠物')
    }

    // 紫外线警告
    if (weather.uvIndex >= 8) {
      warnings.push('强紫外线警告：紫外线强烈，建议采取防晒措施')
    } else if (weather.uvIndex >= 6) {
      warnings.push('中强紫外线警告：紫外线较强，建议适当防晒')
    }

    // 舒适度警告
    if (analysis.comfortIndex < 40) {
      warnings.push('低舒适度警告：天气条件不舒适，敏感人群请减少外出')
    }

    return warnings
  }
}

/**
 * 创建穿搭建议模块实例
 */
export function createFashionModule(): FashionModule {
  return new FashionRecommendationModule()
}