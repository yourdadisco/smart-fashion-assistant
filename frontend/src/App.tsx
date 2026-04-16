import { useState } from 'react'
import { Spin, Alert, Row, Col } from 'antd'
import { Layout } from './components/Layout'
import { LocationInput } from './components/LocationInput'
import { WeatherDisplay } from './components/WeatherDisplay'
import { FashionRecommendationComponent } from './components/FashionRecommendation'
import { WeatherChart } from './components/WeatherChart'
import { FashionAssistantApi } from './services/api'
import { CompleteAnalysisResponse } from '@shared/types/common'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CompleteAnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLocationSubmit = async (location: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await FashionAssistantApi.getFashionRecommendation({
        location,
        days: 7
      })
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败')
      console.error('Error fetching fashion recommendation:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <LocationInput
            onLocationSubmit={handleLocationSubmit}
            loading={loading}
            placeholder="输入城市名称，如：北京、上海、纽约"
          />
        </Col>
      </Row>

      {error && (
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Alert
              message="错误"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          </Col>
        </Row>
      )}

      {loading && (
        <Row justify="center" style={{ padding: 40 }}>
          <Spin size="large" tip="正在获取天气数据和穿搭建议..." />
        </Row>
      )}

      {!loading && data && (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <WeatherDisplay weather={data.weather} />
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <WeatherChart charts={data.charts} />
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={24}>
              <FashionRecommendationComponent recommendation={data.recommendation} />
            </Col>
          </Row>
        </>
      )}

      {!loading && !data && !error && (
        <Row justify="center" style={{ padding: 40 }}>
          <Alert
            message="欢迎使用智能穿搭助手"
            description="请输入位置获取当地的天气信息和个性化穿搭建议"
            type="info"
            showIcon
          />
        </Row>
      )}
    </Layout>
  )
}

export default App