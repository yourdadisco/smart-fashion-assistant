import React from 'react'
import { Layout as AntLayout, Row, Col, Typography, Space } from 'antd'
import { GithubOutlined, CloudOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = AntLayout
const { Title } = Typography

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space size="middle">
              <CloudOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <Title level={3} style={{ margin: 0 }}>
                智能穿搭助手
              </Title>
            </Space>
          </Col>
          <Col>
            <Space size="large">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#666' }}
              >
                <GithubOutlined style={{ fontSize: 20 }} />
              </a>
            </Space>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {children}
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>
        <Space direction="vertical" size="small">
          <div>
            智能穿搭助手 ©{new Date().getFullYear()} - 基于天气的个性化穿搭建议系统
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>
            使用 OpenWeatherMap API 和 React + TypeScript 构建
          </div>
        </Space>
      </Footer>
    </AntLayout>
  )
}