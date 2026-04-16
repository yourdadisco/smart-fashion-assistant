import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Card, Row, Col } from 'antd'
import { ChartConfig } from '@shared/types/common'

interface WeatherChartProps {
  charts: ChartConfig[]
  title?: string
}

export const WeatherChart: React.FC<WeatherChartProps> = ({
  charts,
  title = '天气趋势图'
}) => {
  if (!charts || charts.length === 0) {
    return (
      <Card title={title} bordered={false}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          暂无图表数据
        </div>
      </Card>
    )
  }

  const renderChart = (chart: ChartConfig, index: number) => {
    const commonProps = {
      data: chart.data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    }

    const renderChartContent = () => {
      switch (chart.type) {
        case 'line':
          return (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey={chart.xAxis.dataKey}
                label={{ value: chart.xAxis.label, position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                label={{ value: chart.yAxis.label, angle: -90, position: 'insideLeft' }}
                unit={chart.yAxis.unit}
              />
              <Tooltip
                formatter={(value: any, name: string) => [
                  value,
                  chart.series.find(s => s.dataKey === name)?.name || name
                ]}
                labelFormatter={(label) => `日期: ${label}`}
              />
              <Legend />
              {chart.series.map((series, i) => (
                <Line
                  key={series.dataKey}
                  type="monotone"
                  dataKey={series.dataKey}
                  name={series.name}
                  stroke={series.color}
                  strokeWidth={series.strokeWidth || 2}
                  dot={{ strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          )

        case 'bar':
          return (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey={chart.xAxis.dataKey}
                label={{ value: chart.xAxis.label, position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                label={{ value: chart.yAxis.label, angle: -90, position: 'insideLeft' }}
                unit={chart.yAxis.unit}
              />
              <Tooltip
                formatter={(value: any, name: string) => [
                  value,
                  chart.series.find(s => s.dataKey === name)?.name || name
                ]}
                labelFormatter={(label) => `日期: ${label}`}
              />
              <Legend />
              {chart.series.map((series, i) => (
                <Bar
                  key={series.dataKey}
                  dataKey={series.dataKey}
                  name={series.name}
                  fill={series.color}
                />
              ))}
            </BarChart>
          )

        case 'area':
          return (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey={chart.xAxis.dataKey}
                label={{ value: chart.xAxis.label, position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                label={{ value: chart.yAxis.label, angle: -90, position: 'insideLeft' }}
                unit={chart.yAxis.unit}
              />
              <Tooltip
                formatter={(value: any, name: string) => [
                  value,
                  chart.series.find(s => s.dataKey === name)?.name || name
                ]}
                labelFormatter={(label) => `日期: ${label}`}
              />
              <Legend />
              {chart.series.map((series, i) => (
                <Area
                  key={series.dataKey}
                  type="monotone"
                  dataKey={series.dataKey}
                  name={series.name}
                  stroke={series.color}
                  fill={series.color}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          )

        default:
          return null
      }
    }

    return (
      <Col xs={24} lg={8} key={index}>
        <Card
          title={chart.title}
          bordered={false}
          style={{ height: '100%' }}
        >
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              {renderChartContent()}
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
    )
  }

  return (
    <Card title={title} bordered={false}>
      <Row gutter={[16, 16]}>
        {charts.map(renderChart)}
      </Row>
    </Card>
  )
}