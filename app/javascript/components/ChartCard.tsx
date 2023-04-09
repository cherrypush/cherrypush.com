import { Card, Dropdown } from 'flowbite-react'
import React from 'react'
import { HiDotsVertical, HiTrash } from 'react-icons/hi'
import { useChartsDestroy } from '../queries/user/charts'
import MetricCard from './MetricCard'

const ChartCard = ({ chart, className }) => {
  const { mutate: removeChart } = useChartsDestroy()

  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <h4>{chart.name}</h4>
        <Dropdown arrowIcon={false} label={<HiDotsVertical />} color="dark" placement="bottom-end">
          <Dropdown.Item
            onClick={() => removeChart({ chartId: chart.id, dashboardId: chart.dashboard_id })}
            icon={HiTrash}
          >
            Delete
          </Dropdown.Item>
        </Dropdown>
      </div>

      {chart.chart_metrics.map((chartMetric) => (
        <MetricCard key={chartMetric.id} metricId={chartMetric.metric_id} />
      ))}
    </Card>
  )
}

export default ChartCard
