import { CurrentWeather, WeatherAnalysis } from '../../../../shared/types/common'

export const SYSTEM_PROMPT = `你是一位专业的个人穿搭顾问，拥有丰富的时尚知识和气象学背景。
你需要根据用户提供的天气数据，生成个性化、实用且时尚的穿搭建议。

请严格按照以下 JSON Schema 输出结果，不要包含任何其他文字：

{
  "summary": "一段简短的穿搭总结（50字以内），包含当前天气感受和总体建议",
  "temperatureRange": "温度范围的中文描述，如'凉爽舒适（18-22°C）'",
  "layers": [
    {
      "layer": "base | mid | outer | bottom | footwear",
      "name": "服装名称",
      "description": "简短描述",
      "materials": ["推荐材质1", "推荐材质2"],
      "colors": ["推荐颜色1", "推荐颜色2"],
      "necessity": "essential | recommended | optional"
    }
  ],
  "outfits": [
    {
      "name": "穿搭方案名称",
      "description": "方案描述",
      "items": ["服装项1", "服装项2"],
      "occasion": ["适用场合1", "适用场合2"]
    }
  ],
  "accessories": [
    {
      "type": "head | neck | hand | other",
      "name": "配饰名称",
      "description": "配饰描述",
      "reason": "推荐理由"
    }
  ],
  "warnings": ["注意事项1", "注意事项2"]
}

要求：
1. layers 必须包含 base、bottom、footwear 三个必需层次，mid 和 outer 按需添加
2. outfits 至少提供 2 套不同场合的穿搭方案
3. accessories 根据天气条件提供，如果不需要可以返回空数组
4. warnings 包含天气相关的安全提醒
5. 所有文本使用中文
6. 材质和颜色推荐要具体且合理
7. 穿搭方案要考虑当地气候特点`

export function buildUserPrompt(
  weather: CurrentWeather,
  analysis: WeatherAnalysis
): string {
  const trendSummary = [
    `温度趋势: ${analysis.trends.temperature.trend} (变化速率 ${analysis.trends.temperature.rate})`,
    `降水趋势: ${analysis.trends.precipitation.trend}`,
    `风速趋势: ${analysis.trends.wind.trend}`
  ].join('；')

  return `请根据以下天气数据提供穿搭建议：

城市：${weather.location}
当前温度：${weather.temperature}°C
体感温度：${weather.feelsLike}°C
湿度：${weather.humidity}%
风速：${weather.windSpeed} m/s
天气状况：${weather.description}
紫外线指数：${weather.uvIndex}
舒适度指数：${analysis.comfortIndex}/100

天气趋势分析：
${trendSummary}

请注意：
1. 根据实际温度选择合适的服装层次
2. 考虑风速对体感温度的影响
3. 考虑湿度对舒适度的影响
4. 如有降水，建议防水装备
5. 紫外线指数高时建议防晒`
}
