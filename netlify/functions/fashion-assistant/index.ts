import { Handler } from '@netlify/functions'
import { createFashionAssistantAgent } from './core/agent'
import { ApiResponse } from '../../shared/types/common'

// 创建单一Agent实例（单例模式）
let agentInstance: ReturnType<typeof createFashionAssistantAgent> | null = null

function getAgent() {
  if (!agentInstance) {
    agentInstance = createFashionAssistantAgent()
    console.log('FashionAssistantAgent instance created')
  }
  return agentInstance
}

/**
 * Netlify Function主处理器
 */
const handler: Handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  }

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
    const agent = getAgent()

    // 健康检查端点
    if (event.httpMethod === 'GET' && event.path.endsWith('/health')) {
      const health = await agent.healthCheck()
      const response: ApiResponse = {
        success: true,
        data: health,
        timestamp: new Date().toISOString()
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      }
    }

    // 主处理端点（POST请求）
    if (event.httpMethod === 'POST') {
      if (!event.body) {
        throw new Error('Request body is required')
      }

      const requestData = JSON.parse(event.body)
      const { location, days = 7 } = requestData

      if (!location || typeof location !== 'string') {
        throw new Error('Location is required and must be a string')
      }

      // 处理位置请求
      const result = await agent.processLocation({ location, days })

      const response: ApiResponse = {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      }
    }

    // 不支持的HTTP方法
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Method ${event.httpMethod} not allowed`,
        timestamp: new Date().toISOString()
      } as ApiResponse)
    }

  } catch (error) {
    console.error('Handler error:', error)

    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    }

    return {
      statusCode: error instanceof Error && error.message.includes('required') ? 400 : 500,
      headers,
      body: JSON.stringify(response)
    }
  }
}

export { handler }