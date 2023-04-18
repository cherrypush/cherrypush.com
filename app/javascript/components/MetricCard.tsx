import MenuIcon from '@mui/icons-material/Menu'
import { Card, Dropdown } from 'flowbite-react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChartKind } from '../queries/user/charts'
import { useMetricsDestroy, useMetricsShow } from '../queries/user/metrics'
import MetricChart from './MetricChart'

interface Props {
  metricId: number
  owners?: string[]
}

const MetricCard = ({ metricId, owners }: Props) => {
  const { data: metric } = useMetricsShow(metricId, owners)
  const [searchParams, setSearchParams] = useSearchParams()

  const { mutate: deleteMetric } = useMetricsDestroy({
    onSuccess: () => {
      searchParams.delete('metric_id')
      setSearchParams(searchParams)
    },
  })

  return (
    <Card className="mb-3 relative">
      <div className="absolute top-3 right-3 px-4 z-10">
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
      <MetricChart kind={ChartKind.Area} metricIds={[metricId]} owners={owners} />
    </Card>
  )
}
export default MetricCard
