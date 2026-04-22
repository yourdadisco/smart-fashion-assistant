import axios from 'axios'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepSeekRequest {
  model: string
  messages: DeepSeekMessage[]
  temperature: number
  max_tokens: number
  response_format?: { type: 'json_object' }
}

interface DeepSeekChoice {
  message: {
    content: string
  }
  finish_reason: string
}

interface DeepSeekResponse {
  id: string
  choices: DeepSeekChoice[]
}

export async function callDeepSeek(
  systemPrompt: string,
  userPrompt: string,
  maxRetries = 1
): Promise<Record<string, unknown>> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is not set')
  }

  const requestBody: DeepSeekRequest = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: 'json_object' }
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post<DeepSeekResponse>(
        DEEPSEEK_API_URL,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          timeout: 30000
        }
      )

      const content = response.data.choices[0]?.message?.content
      if (!content) {
        throw new Error('Empty response from DeepSeek API')
      }

      return JSON.parse(content)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status && (status >= 500 || status === 429) && attempt < maxRetries) {
          console.warn(`DeepSeek API attempt ${attempt + 1} failed (status ${status}), retrying...`)
          continue
        }
      }
      lastError = error instanceof Error ? error : new Error(String(error))
      break
    }
  }

  throw lastError || new Error('Failed to call DeepSeek API')
}
