import MenuIcon from '@mui/icons-material/Menu'
import { Card, Dropdown } from 'flowbite-react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMetricsDestroy, useMetricsShow } from '../queries/user/metrics'
import MetricChart from './MetricChart'

const MetricCard = ({ metricId, className }: { metricId: number; className?: string }) => {
  const { data: metric } = useMetricsShow({ id: metricId })
  const [searchParams, setSearchParams] = useSearchParams()

  const { mutate: deleteMetric } = useMetricsDestroy({
    onSuccess: () => {
      searchParams.delete('metric_id')
      setSearchParams(searchParams)
    },
  })

  return (
    <Card className={className}>
      <div className="flex justify-between items-center px-4">
        <h4>{metric && metric.name}</h4>
        <Dropdown arrowIcon={false} inline={true} label={<MenuIcon />}>
          <Dropdown.Item
            onClick={() => {
              if (window.confirm('Do you really want to delete this metric?')) deleteMetric(metric.id)
            }}
          >
            Delete this metric
          </Dropdown.Item>
        </Dropdown>
      </div>
      {metric && <MetricChart metricId={metricId} />}
    </Card>
  )
}
export default MetricCard
