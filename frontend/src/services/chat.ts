import { ApiResponse } from '@shared/types/common'

export interface ChatMessage {
  type: 'chat' | 'fashion'
  text: string
  data?: any
}

const API_BASE = '/.netlify/functions'

export class ChatApi {
  static async sendMessage(message: string): Promise<ChatMessage> {
    // 调试：记录原始消息
    console.log('前端发送消息:', {
      message,
      length: message.length,
      charCodes: Array.from(message).map(c => c.charCodeAt(0)),
      firstChar: message.charCodeAt(0).toString(16),
      isUTF8: true
    })

    // 构建JSON请求体，确保非ASCII字符被转义为Unicode转义序列
    // 直接构建JSON字符串，避免双重转义
    const requestBody = `{"message":"${message.replace(/[^\x00-\x7F]/g, c =>
      '\\\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
    )}"}`

    console.log('前端请求体:', {
      body: requestBody,
      length: requestBody.length,
      firstBytes: Array.from(new TextEncoder().encode(requestBody.substring(0, 10))).map(b => b.toString(16)).join(' ')
    })

    const response = await fetch(`${API_BASE}/chat-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Charset': 'utf-8'
      },
      body: requestBody
    })

    if (!response.ok) {
      throw new Error(`Chat request failed with status ${response.status}`)
    }

    const result: ApiResponse<ChatMessage> = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Chat request failed')
    }

    return result.data!
  }
}
