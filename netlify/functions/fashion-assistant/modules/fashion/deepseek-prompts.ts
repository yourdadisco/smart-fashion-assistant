import { CurrentWeather, WeatherAnalysis, ForecastData } from '../../../../shared/types/common'

export const SYSTEM_PROMPT = `你是一位顶尖的个人穿搭顾问，拥有10年时尚行业经验和气象学背景。
你的任务是：根据用户提供的实时天气数据和未来趋势，生成极度详细、实用、个性化的穿搭建议。

请严格按照以下 JSON Schema 输出结果，不要包含任何其他文字：

{
  "summary": "一段详细的穿搭总结（80-120字），包含：①当前天气感受 ②总体穿搭方向 ③关键注意事项",
  "temperatureRange": "温度范围的中文描述，如'凉爽舒适（18-22°C）'",
  "layers": [
    {
      "layer": "base | mid | outer | bottom | footwear",
      "name": "具体服装名称（不要笼统，要具体款式，如'纯棉圆领短袖T恤'而不是'短袖'）",
      "description": "为什么推荐这个款式、有什么功能特点（20-40字）",
      "materials": ["推荐的具体材质，至少2个"],
      "colors": ["推荐的具体颜色，至少2个"],
      "necessity": "essential | recommended | optional"
    }
  ],
  "outfits": [
    {
      "name": "穿搭方案名称（有创意，如'都市通勤风'、'周末休闲范'）",
      "description": "方案详细描述，说明适合什么场景、整体风格感觉（30-60字）",
      "items": ["具体单品1", "具体单品2", "具体单品3", "具体单品4"],
      "occasion": ["场合1", "场合2"]
    }
  ],
  "accessories": [
    {
      "type": "head | neck | hand | other",
      "name": "具体配饰名称",
      "description": "配饰的详细描述",
      "reason": "为什么推荐这个配饰（结合天气原因，15-30字）"
    }
  ],
  "warnings": ["具体、可操作的注意事项，每条15-40字"]
}

详细要求：

【summary】
- 必须包含：体感描述 + 穿搭方向 + 特别提醒
- 例："今日温暖偏热，体感微闷，建议选择轻薄透气的棉麻材质。紫外线较强，出门务必做好防晒。早晚温差约5°C，可备一件薄开衫。"

【layers - 服装分层】
- base（基础层）：必须提供，贴身穿着的选择
- mid（中间层）：当温度<20°C或温差大时提供，否则可省略
- outer（外层）：有风/雨/寒冷时提供
- bottom（下装）：必须提供
- footwear（鞋履）：必须提供
- 每项的name必须具体到款式（如"高腰阔腿牛仔裤"而非"裤子"）
- description要说明功能性和穿着感受
- materials和colors必须贴合实际、符合季节
- necessity准确标注：essential=必须、recommended=推荐、optional=可选

【outfits - 穿搭方案】
- 必须提供2-3套完整方案
- 每套方案要有不同的风格定位（如通勤风、休闲风、运动风、约会风等）
- items要完整：上装+下装+鞋+可选配饰
- 方案要结合天气特点进行搭配

【accessories - 配饰】
- 根据天气条件精准推荐：防晒（遮阳帽/太阳镜/防晒衣）、防雨（雨伞/雨衣）、防风（围巾）、防寒（手套）
- 每种配饰都要说明天气相关理由
- 不需要时可返回空数组

【warnings - 注意事项】
- 基于具体天气数据的精准提醒
- 包含：温度提醒、降水提醒、紫外线提醒、特殊天气提醒
- 每条都要具体可操作`

export const SYSTEM_PROMPT_SIMPLE = `你是一位时尚穿搭助手，根据天气数据提供实用的穿搭建议。

请严格按照以下 JSON Schema 输出结果：

{
  "summary": "穿搭总结（50-80字），包含天气感受和穿搭建议",
  "temperatureRange": "温度范围描述，如'凉爽（18-22°C）'",
  "layers": [
    {
      "layer": "base | mid | outer | bottom | footwear",
      "name": "服装名称",
      "description": "简短描述（10-20字）",
      "necessity": "essential | recommended | optional"
    }
  ],
  "outfits": [
    {
      "name": "穿搭方案名称",
      "description": "简短描述（20-30字）",
      "items": ["单品1", "单品2", "单品3"]
    }
  ],
  "accessories": [
    {
      "type": "head | neck | hand | other",
      "name": "配饰名称",
      "reason": "推荐理由（10-20字）"
    }
  ],
  "warnings": ["注意事项"]
}

要求：
1. 基于天气数据提供实用建议
2. 输出简洁明了
3. 不要过于详细，保持响应快速`

export function buildUserPrompt(
  weather: CurrentWeather,
  analysis: WeatherAnalysis,
  forecast?: ForecastData[]
): string {
  const trendSummary = [
    `温度趋势: ${analysis.trends.temperature.trend}（变化速率 ${analysis.trends.temperature.rate}°C/天，置信度 ${analysis.trends.temperature.confidence}%）`,
    `降水趋势: ${analysis.trends.precipitation.trend}（置信度 ${analysis.trends.precipitation.confidence}%）`,
    `风速趋势: ${analysis.trends.wind.trend}（置信度 ${analysis.trends.wind.confidence}%）`
  ].join('\n')

  let forecastSummary = ''
  if (forecast && forecast.length > 0) {
    const temps = forecast.map(f => f.temperature)
    const maxTemp = Math.max(...temps)
    const minTemp = Math.min(...temps)
    const rainyDays = forecast.filter(f => f.description.includes('雨') || f.precipitationProbability > 50).length
    forecastSummary = `\n\n【未来${forecast.length}天天气预报】
- 最高温度: ${maxTemp}°C
- 最低温度: ${minTemp}°C
- 平均温度: ${(temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)}°C
- 有降水风险的天数: ${rainyDays}天`
  }

  return `请根据以下天气数据，提供专业、详细的穿搭建议：

━━━━ 当前天气 ━━━━
📍 城市：${weather.location}
🌡️ 当前温度：${weather.temperature}°C
🤗 体感温度：${weather.feelsLike}°C
💧 湿度：${weather.humidity}%
💨 风速：${weather.windSpeed} m/s（${getWindLevel(weather.windSpeed)}）
🌤️ 天气状况：${weather.description}
☂️ 降水量：${weather.precipitation ?? 0} mm
👁️ 能见度：${weather.visibility ?? 10000} m
☀️ 紫外线指数：${weather.uvIndex}（${getUVLevel(weather.uvIndex)}）
😊 舒适度指数：${analysis.comfortIndex}/100（${getComfortLevel(analysis.comfortIndex)}）

━━━━ 天气趋势分析 ━━━━
${trendSummary}

关键天气变化点：
${analysis.keyChanges.map(k => `- ${k.time}: ${k.description}（${getSignificanceText(k.significance)}）`).join('\n')}

天气相关建议：
${analysis.recommendations.map(r => `- ${r}`).join('\n')}
${forecastSummary}

━━━━ 穿搭要求 ━━━━
请基于以上数据，提供完整、详细的穿搭建议。注意：
1. 充分考虑体感温度（${weather.feelsLike}°C）而非实际温度
2. 高湿度（${weather.humidity}%）会让人感觉更闷热/湿冷
3. 风速（${weather.windSpeed} m/s）会影响体感温度
4. 紫外线指数（${weather.uvIndex}）决定是否需要防晒
5. 考虑${forecast ? '未来几天的天气变化趋势，建议提供可灵活调整的穿搭方案' : '当前天气状况'}
6. 衣物名称要具体到款式和版型，不要笼统
7. 配饰推荐要结合天气原因说明`
}

function getWindLevel(speed: number): string {
  if (speed < 1) return '无风'
  if (speed < 3) return '微风'
  if (speed < 5) return '轻风'
  if (speed < 8) return '和风'
  if (speed < 11) return '强风'
  return '大风'
}

function getUVLevel(index: number): string {
  if (index <= 2) return '低'
  if (index <= 5) return '中等'
  if (index <= 7) return '高'
  if (index <= 10) return '很高'
  return '极高'
}

function getComfortLevel(index: number): string {
  if (index >= 80) return '非常舒适'
  if (index >= 60) return '舒适'
  if (index >= 40) return '一般'
  if (index >= 20) return '不舒适'
  return '非常不舒适'
}

function getSignificanceText(significance: string): string {
  switch (significance) {
    case 'high': return '显著变化，需注意'
    case 'medium': return '有一定变化'
    case 'low': return '轻微变化'
    default: return significance
  }
}
