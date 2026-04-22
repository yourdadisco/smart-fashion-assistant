import React, { useState, useRef, useEffect } from 'react'
import { Input, Button, Card, Typography, Spin } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
import { ChatApi, ChatMessage } from '../../services/chat'
import { WeatherDisplay } from '../WeatherDisplay'
import { WeatherChart } from '../WeatherChart'
import { FashionRecommendationComponent } from '../FashionRecommendation'
import type { CompleteAnalysisResponse } from '@shared/types/common'

const { Text } = Typography
const { TextArea } = Input

interface Message {
  id: string
  role: 'user' | 'assistant'
  type: 'text' | 'fashion'
  content: string
  data?: CompleteAnalysisResponse
}

let msgId = 0

export const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    type: 'text',
    content: '你好呀！我是你的智能穿搭助手~ 你可以问我任何城市今天穿什么，也可以找我闲聊哦！'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    const userMsg: Message = {
      id: `msg-${++msgId}`,
      role: 'user',
      type: 'text',
      content: text
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res: ChatMessage = await ChatApi.sendMessage(text)

      const assistantMsg: Message = {
        id: `msg-${++msgId}`,
        role: 'assistant',
        type: res.type === 'fashion' ? 'fashion' : 'text',
        content: res.text,
        data: res.data
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `msg-${++msgId}`,
        role: 'assistant',
        type: 'text',
        content: '抱歉，我暂时无法回复，请稍后再试。'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const renderFashionContent = (msg: Message) => {
    if (!msg.data) return null
    return (
      <div style={{ marginTop: 12 }}>
        <WeatherDisplay weather={msg.data.weather} />
        <div style={{ marginTop: 16 }}>
          <WeatherChart charts={msg.data.charts} />
        </div>
        <div style={{ marginTop: 16 }}>
          <FashionRecommendationComponent recommendation={msg.data.recommendation} />
        </div>
      </div>
    )
  }

  return (
    <Card
      bordered={false}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 160px)',
        minHeight: 500
      }}
      styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%', padding: 0 } }}
    >
      {/* Message list */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '100%'
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                maxWidth: '100%'
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: msg.role === 'user' ? '#1890ff' : '#f0f0f0'
                }}
              >
                {msg.role === 'user'
                  ? <UserOutlined style={{ color: '#fff', fontSize: 16 }} />
                  : <RobotOutlined style={{ color: '#1890ff', fontSize: 16 }} />
                }
              </div>
              <div
                style={{
                  maxWidth: msg.type === 'fashion' ? '100%' : '70%',
                  padding: msg.type === 'fashion' ? 0 : '10px 16px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#1890ff' : '#f5f5f5',
                  color: msg.role === 'user' ? '#fff' : '#333',
                  fontSize: 14,
                  lineHeight: 1.6,
                  wordBreak: 'break-word'
                }}
              >
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                {msg.type === 'fashion' && renderFashionContent(msg)}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 0' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#f0f0f0'
            }}>
              <RobotOutlined style={{ color: '#1890ff', fontSize: 16 }} />
            </div>
            <Spin size="small" />
            <Text type="secondary" style={{ fontSize: 13 }}>正在思考...</Text>
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{
        borderTop: '1px solid #f0f0f0',
        padding: '12px 24px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-end'
      }}>
        <TextArea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息，例如：北京今天穿什么？"
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={loading}
          style={{ flex: 1, borderRadius: 8 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          loading={loading}
          style={{ height: 36, borderRadius: 8 }}
        >
          发送
        </Button>
      </div>
    </Card>
  )
}
