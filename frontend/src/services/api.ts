import { LocationRequest, CompleteAnalysisResponse, ApiResponse } from '@shared/types/common'

const API_BASE = import.meta.env.DEV
  ? '/.netlify/functions'
  : '/.netlify/functions'

export class FashionAssistantApi {
  /**
   * 获取天气和穿搭建议
   */
  static async getFashionRecommendation(request: LocationRequest): Promise<CompleteAnalysisResponse> {
    try {
      const response = await fetch(`${API_BASE}/fashion-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const result: ApiResponse<CompleteAnalysisResponse> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Unknown API error')
      }

      return result.data!
    } catch (error) {
      console.error('Failed to fetch fashion recommendation:', error)
      throw error
    }
  }

  /**
   * 健康检查
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string; modules: string[] }> {
    try {
      const response = await fetch(`${API_BASE}/fashion-assistant/health`)

      if (!response.ok) {
        throw new Error(`Health check failed with status ${response.status}`)
      }

      const result: ApiResponse<{ status: string; timestamp: string; modules: string[] }> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Unknown API error')
      }

      return result.data!
    } catch (error) {
      console.error('Failed to perform health check:', error)
      throw error
    }
  }
}