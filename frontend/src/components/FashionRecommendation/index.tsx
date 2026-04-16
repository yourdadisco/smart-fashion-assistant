import React from 'react'
import { Card, Row, Col, List, Tag, Alert, Descriptions, Typography } from 'antd'
import {
  SkinOutlined,
  GiftOutlined,
  BulbOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { FashionRecommendation } from '@shared/types/common'

const { Paragraph, Text } = Typography

interface FashionRecommendationProps {
  recommendation: FashionRecommendation
}

export const FashionRecommendationComponent: React.FC<FashionRecommendationProps> = ({
  recommendation
}) => {
  const getNecessityColor = (necessity: string): string => {
    switch (necessity) {
      case 'essential':
        return 'red'
      case 'recommended':
        return 'orange'
      case 'optional':
        return 'green'
      default:
        return 'blue'
    }
  }

  const renderLayer = (layer: any) => (
    <List.Item key={`${layer.layer}-${layer.name}`}>
      <Card size="small" style={{ width: '100%' }}>
        <Row align="middle" gutter={16}>
          <Col xs={24} sm={8}>
            <strong>{layer.name}</strong>
            <div style={{ fontSize: 12, color: '#666' }}>
              {layer.description}
            </div>
          </Col>
          <Col xs={12} sm={8}>
            <div>
              <Text type="secondary">材质: </Text>
              {layer.materials?.map((material: string, i: number) => (
                <Tag key={i} color="blue">
                  {material}
                </Tag>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">颜色: </Text>
              {layer.colors?.map((color: string, i: number) => (
                <Tag key={i} color="purple">
                  {color}
                </Tag>
              ))}
            </div>
          </Col>
          <Col xs={12} sm={8}>
            <Tag color={getNecessityColor(layer.necessity)}>
              {layer.necessity === 'essential' ? '必需' :
               layer.necessity === 'recommended' ? '推荐' : '可选'}
            </Tag>
            <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              层次: {layer.layer === 'base' ? '基础层' :
                    layer.layer === 'mid' ? '中间层' :
                    layer.layer === 'outer' ? '外层' :
                    layer.layer === 'bottom' ? '下装' : '鞋履'}
            </div>
          </Col>
        </Row>
      </Card>
    </List.Item>
  )

  return (
    <div>
      <Card
        title={
          <span>
            <SkinOutlined /> 穿搭建议
          </span>
        }
        bordered={false}
        style={{ marginBottom: 24 }}
      >
        <Paragraph strong style={{ fontSize: 16 }}>
          {recommendation.summary}
        </Paragraph>
        <Descriptions size="small" column={2} style={{ marginTop: 16 }}>
          <Descriptions.Item label="温度范围">
            {recommendation.temperatureRange}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <BulbOutlined /> 服装分层建议
              </span>
            }
            bordered={false}
          >
            <List
              dataSource={recommendation.layers}
              renderItem={renderLayer}
                         />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <GiftOutlined /> 配饰建议
              </span>
            }
            bordered={false}
          >
            {recommendation.accessories && recommendation.accessories.length > 0 ? (
              <List
                dataSource={recommendation.accessories}
                renderItem={(accessory: any) => (
                  <List.Item>
                    <Card size="small" style={{ width: '100%' }}>
                      <Row align="middle" gutter={16}>
                        <Col xs={8}>
                          <Tag color="cyan">
                            {accessory.type === 'head' ? '头部' :
                             accessory.type === 'neck' ? '颈部' :
                             accessory.type === 'hand' ? '手部' : '其他'}
                          </Tag>
                        </Col>
                        <Col xs={16}>
                          <strong>{accessory.name}</strong>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            {accessory.description}
                          </div>
                        </Col>
                      </Row>
                      <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                        {accessory.reason}
                      </div>
                    </Card>
                  </List.Item>
                )}
                             />
            ) : (
              <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                当前天气条件下无需特别配饰
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {recommendation.warnings && recommendation.warnings.length > 0 && (
        <Card
          title={
            <span>
              <WarningOutlined /> 注意事项
            </span>
          }
          bordered={false}
          style={{ marginTop: 24 }}
        >
          {recommendation.warnings.map((warning: string, index: number) => (
            <Alert
              key={index}
              message={warning}
              type="warning"
              showIcon
              style={{ marginBottom: 8 }}
            />
          ))}
        </Card>
      )}
    </div>
  )
}