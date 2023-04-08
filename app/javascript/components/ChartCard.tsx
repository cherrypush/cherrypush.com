import { DeleteForever } from '@mui/icons-material'
import { Button, Card } from 'flowbite-react'
import React from 'react'
import { useChartsDestroy } from '../queries/user/charts'
import MetricCard from './MetricCard'

const ChartCard = ({ chart, className }) => {
  const { mutate: removeChart } = useChartsDestroy()

  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <h4>{chart.name}</h4>
        <Button onClick={() => removeChart({ chartId: chart.id, dashboardId: chart.dashboard_id })} color="light">
          <DeleteForever />
        </Button>
      </div>

      {chart.chart_metrics.map((chartMetric) => (
        <MetricCard key={chartMetric.id} metricId={chartMetric.metric_id} />
      ))}
    </Card>
  )
}

export default ChartCard
