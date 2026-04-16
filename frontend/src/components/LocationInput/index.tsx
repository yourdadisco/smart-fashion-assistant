import React, { useState } from 'react'
import { Input, Button, Card, Row, Col, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface LocationInputProps {
  onLocationSubmit: (location: string) => void
  loading?: boolean
  placeholder?: string
}

export const LocationInput: React.FC<LocationInputProps> = ({
  onLocationSubmit,
  loading = false,
  placeholder = '输入城市名称，如：北京、上海、纽约'
}) => {
  const [location, setLocation] = useState('')

  const handleSubmit = () => {
    if (!location.trim()) {
      message.warning('请输入位置信息')
      return
    }
    onLocationSubmit(location.trim())
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Card title="智能穿搭助手" bordered={false}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={16}>
          <Input
            size="large"
            placeholder={placeholder}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            prefix={<SearchOutlined />}
            disabled={loading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            loading={loading}
            block
            icon={<SearchOutlined />}
          >
            获取穿搭建议
          </Button>
        </Col>
      </Row>
      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        <p>💡 提示：输入城市名称获取当地天气和穿搭建议</p>
      </div>
    </Card>
  )
}