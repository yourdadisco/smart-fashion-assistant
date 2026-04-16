import React from 'react'
import { Card, Row, Col, Statistic, Tag, Descriptions } from 'antd'
import {
  FireOutlined,
  CloudOutlined,
  FlagOutlined,
  CompassOutlined,
  SunOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import { CurrentWeather } from '@shared/types/common'

interface WeatherDisplayProps {
  weather: CurrentWeather
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  const formatWindDirection = (degrees: number): string => {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  const getWeatherIcon = (iconCode: string): string => {
    const iconMap: Record<string, string> = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '⛅',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌦️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    }
    return iconMap[iconCode] || '🌤️'
  }

  return (
    <Card title="当前天气" bordered={false}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>
              {getWeatherIcon(weather.icon)}
            </div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
              {weather.temperature}°C
            </div>
            <div style={{ fontSize: 16, color: '#666' }}>
              {weather.description}
            </div>
            <div style={{ fontSize: 14, color: '#999', marginTop: 4 }}>
              体感温度: {weather.feelsLike}°C
            </div>
          </div>
        </Col>

        <Col xs={24} sm={16}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic
                title="湿度"
                value={weather.humidity}
                suffix="%"
                prefix={<CloudOutlined />}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="风速"
                value={weather.windSpeed}
                suffix="m/s"
                prefix={<FlagOutlined />}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="风向"
                value={formatWindDirection(weather.windDirection)}
                prefix={<CompassOutlined />}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="紫外线"
                value={weather.uvIndex}
                prefix={<SunOutlined />}
              />
            </Col>
          </Row>

          <Descriptions
            size="small"
            column={2}
            style={{ marginTop: 24 }}
            bordered
          >
            <Descriptions.Item label="气压">
              {weather.pressure} hPa
            </Descriptions.Item>
            <Descriptions.Item label="能见度">
              {weather.visibility / 1000} km
            </Descriptions.Item>
            <Descriptions.Item label="位置">
              {weather.location}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {new Date(weather.timestamp).toLocaleString('zh-CN')}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        <Tag color="blue" icon={<FireOutlined />}>
          温度: {weather.temperature}°C
        </Tag>
        <Tag color="cyan" icon={<CloudOutlined />}>
          湿度: {weather.humidity}%
        </Tag>
        <Tag color="green" icon={<FlagOutlined />}>
          风速: {weather.windSpeed} m/s
        </Tag>
        <Tag color="orange" icon={<SunOutlined />}>
          紫外线: {weather.uvIndex}
        </Tag>
        <Tag color="purple" icon={<EyeInvisibleOutlined />}>
          体感: {weather.feelsLike}°C
        </Tag>
      </div>
    </Card>
  )
}