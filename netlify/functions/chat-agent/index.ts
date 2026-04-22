import { Handler } from '@netlify/functions'
import { chatWithDeepSeek } from './deepseek-chat'
import { createWeatherModule } from '../fashion-assistant/modules/weather'
import { createAnalysisModule } from '../fashion-assistant/modules/analysis'
import { createChartModule } from '../fashion-assistant/modules/charts'
import { createFashionModule } from '../fashion-assistant/modules/fashion'
import { CompleteAnalysisResponse, ApiResponse } from '../../shared/types/common'

// Buffer是Node.js全局对象，不需要导入

const SYSTEM_PROMPT = `你是一个时尚穿搭助手，专门根据天气提供穿搭建议。

你的任务：
1. 分析用户消息，判断是否是穿搭建议请求
2. 如果是穿搭建议请求，提取城市名并输出特定JSON
3. 如果是其他任何消息，都当作闲聊处理

穿搭建议请求的识别规则（以下情况都视为穿搭建议请求）：
- 包含"穿什么"（如"今天穿什么"、"北京穿什么"、"穿什么衣服"）
- 包含"穿搭"、"搭配"、"着装"等词
- 包含城市名 + 天气相关词（如"北京天气怎么穿"）
- 包含"推荐" + "穿搭"（如"推荐穿搭"）
- 即使没有明确城市名，但询问"今天穿什么"，使用用户IP所在城市（假设为"北京"）

回复格式要求（必须严格遵守）：
- 如果用户在闲聊，输出：{"action":"chat","text":"你的回复"}
- 如果用户询问穿搭建议，输出：{"action":"fashion","location":"城市名"}

重要规则：
1. 只要用户询问穿搭建议，就必须走fashion路径
2. 城市名必须是中文，如"北京"、"上海"。如果没有明确城市，使用"北京"作为默认
3. 你的输出必须是纯JSON，不要包含任何其他文字

示例：
用户：你好
输出：{"action":"chat","text":"你好！我是你的穿搭助手！"}

用户：今天天气怎么样
输出：{"action":"chat","text":"我是穿搭助手，可以帮你根据天气推荐穿搭哦！"}

用户：北京今天穿什么
输出：{"action":"fashion","location":"北京"}

用户：上海穿搭推荐
输出：{"action":"fashion","location":"上海"}

用户：穿什么
输出：{"action":"fashion","location":"北京"}

用户：推荐一些穿搭
输出：{"action":"fashion","location":"北京"}

用户：天气热怎么穿
输出：{"action":"fashion","location":"北京"}`

const weatherModule = createWeatherModule()
const analysisModule = createAnalysisModule()
const chartModule = createChartModule()
const fashionModule = createFashionModule()

async function getFashionAdvice(location: string) {
  const weather = await weatherModule.getCurrentWeather(location)
  const forecast = await weatherModule.getForecast(location, 7)
  const analysis = analysisModule.analyzeTrends(forecast)
  const charts = chartModule.generateCharts(forecast)
  const recommendation = await fashionModule.generateRecommendation(weather, analysis, forecast)

  const result: CompleteAnalysisResponse = {
    weather,
    forecast,
    analysis,
    charts,
    recommendation
  }

  // 生成友好的文字总结
  let textResponse: string
  if (recommendation.isAIGenerated) {
    // 如果穿搭建议是AI生成的，用DeepSeek生成友好总结
    const summaryPrompt = `你是一个友好的穿搭助手。请根据以下穿搭建议，用2-3句自然的话告诉用户今天的穿搭建议，语气亲切友好：

城市：${location}
天气：${weather.description}，${weather.temperature}°C（体感${weather.feelsLike}°C）
穿搭总结：${recommendation.summary}

请用口语化的方式回复，像朋友给建议一样自然。`

    textResponse = await chatWithDeepSeek([
      { role: 'system', content: '你是一个友好的穿搭助手，用简短自然的口语回复，不要说"根据"、"首先"等书面语。' },
      { role: 'user', content: summaryPrompt }
    ])
  } else {
    // 如果穿搭建议是规则引擎生成的，使用简单模板
    textResponse = `根据${location}的天气（${weather.description}，${weather.temperature}°C），我为你准备了穿搭建议：${recommendation.summary}`
  }

  return { text: textResponse, data: result }
}

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    console.log('请求头:', JSON.stringify(event.headers))
    console.log('Content-Type:', event.headers['content-type'] || event.headers['Content-Type'])

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Method not allowed',
          timestamp: new Date().toISOString()
        } as ApiResponse)
      }
    }

    if (!event.body) {
      throw new Error('Request body is required')
    }

    // 简单编码处理：假设UTF-8编码
    let bodyStr: string
    if (Buffer.isBuffer(event.body)) {
      console.log('请求体是Buffer，长度:', event.body.length)
      // 尝试UTF-8解码
      bodyStr = event.body.toString('utf-8')
      console.log('UTF-8解码结果:', bodyStr.substring(0, 100))

      // 如果包含替换字符，尝试GBK（中文Windows常见编码）
      if (bodyStr.includes('�')) {
        try {
          const gbkDecoded = event.body.toString('gbk')
          if (!gbkDecoded.includes('�')) {
            console.log('GBK解码成功:', gbkDecoded.substring(0, 100))
            bodyStr = gbkDecoded
          }
        } catch (e) {
          // 忽略
        }
      }
    } else if (typeof event.body === 'string') {
      console.log('请求体是字符串，长度:', event.body.length)
      console.log('字符串内容:', event.body.substring(0, 100))
      bodyStr = event.body

      // 如果字符串包含替换字符，尝试从latin1恢复原始字节再解码
      if (bodyStr.includes('�')) {
        const latin1Buffer = Buffer.from(bodyStr, 'latin1')
        // 尝试UTF-8
        try {
          const utf8Decoded = latin1Buffer.toString('utf-8')
          if (!utf8Decoded.includes('�')) {
            console.log('从latin1恢复后UTF-8解码成功:', utf8Decoded.substring(0, 100))
            bodyStr = utf8Decoded
          }
        } catch (e) {
          // 忽略
        }
      }
    } else {
      throw new Error('Invalid request body type')
    }

    console.log('最终请求体:', bodyStr.substring(0, 150))

    let message: string
    try {
      const parsedBody = JSON.parse(bodyStr)
      if (!parsedBody.message || typeof parsedBody.message !== 'string') {
        throw new Error('Message is required and must be a string')
      }
      message = parsedBody.message
      console.log('解析后的消息:', message, '长度:', message.length)
      console.log('消息字符代码:', Array.from(message).slice(0, 10).map(c => c.charCodeAt(0)))
    } catch (error) {
      console.error('JSON解析失败:', error, 'bodyStr:', bodyStr)
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`)
    }

    // 直接调用DeepSeek进行意图识别和回复
    // DeepSeek会根据SYSTEM_PROMPT决定是闲聊还是穿搭建议
    const rawResponse = await chatWithDeepSeek([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message }
    ], 1, true)

    console.log('DeepSeek raw response:', rawResponse)

    let parsed: { action: string; text?: string; location?: string }
    try {
      parsed = JSON.parse(rawResponse)
      console.log('Parsed JSON:', parsed)
    } catch (error) {
      console.error('Failed to parse JSON:', error, 'Raw:', rawResponse)
      // 如果返回的不是JSON，当作普通聊天处理
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: { type: 'chat', text: rawResponse },
          timestamp: new Date().toISOString()
        } as ApiResponse)
      }
    }

    if (parsed.action === 'fashion' && parsed.location) {
      const { text, data } = await getFashionAdvice(parsed.location)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: { type: 'fashion', text, data },
          timestamp: new Date().toISOString()
        } as ApiResponse)
      }
    }

    // 默认走聊天
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: { type: 'chat', text: parsed.text || rawResponse },
        timestamp: new Date().toISOString()
      } as ApiResponse)
    }

  } catch (error) {
    console.error('Chat agent error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      } as ApiResponse)
    }
  }
}

export { handler }
