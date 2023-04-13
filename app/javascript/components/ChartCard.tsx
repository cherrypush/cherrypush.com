import { Card, Dropdown } from 'flowbite-react'
import React from 'react'
import { HiDotsVertical, HiPencil, HiTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useChartsDestroy } from '../queries/user/charts'
import MetricChart from './MetricChart'

const ChartCard = ({ chart, className }) => {
  const { mutateAsync: removeChart } = useChartsDestroy()
  const navigate = useNavigate()

  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <h4>{chart.name}</h4>
        <Dropdown arrowIcon={false} label={<HiDotsVertical />} color="dark" placement="bottom-end" id="chart-menu">
          <Dropdown.Item
            onClick={() => navigate(`/user/dashboards/${chart.dashboard_id}/charts/${chart.id}/edit`)}
            icon={HiPencil}
          >
            Edit
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => removeChart({ chartId: chart.id, dashboardId: chart.dashboard_id })}
            icon={HiTrash}
          >
            Delete
          </Dropdown.Item>
        </Dropdown>
      </div>
      <MetricChart kind={chart.kind} metricIds={chart.chart_metrics.map((metric) => metric.metric_id)} />
    </Card>
  )
}

export default ChartCard
