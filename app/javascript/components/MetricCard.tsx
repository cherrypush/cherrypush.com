import MenuIcon from '@mui/icons-material/Menu'
import { Card, Dropdown } from 'flowbite-react'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { ChartKind } from '../queries/user/charts'
import { useMetricsDestroy } from '../queries/user/metrics'
import { useViewsCreate } from '../queries/user/views'
import MetricChart from './MetricChart'

const MetricCard = ({ metricId, owners }: { metricId: number; owners?: string[] }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { mutate: createView } = useViewsCreate()
  const { mutateAsync: deleteMetric } = useMetricsDestroy()

  useEffect(() => {
    createView(metricId)
  }, [metricId, createView])

  return (
    <Card className="mb-3 relative">
      <div className="absolute top-3 right-3 px-4 z-10" id="metric-menu">
        <Dropdown arrowIcon={false} inline={true} label={<MenuIcon />}>
          <Dropdown.Item
            onClick={() => {
              if (window.confirm('Do you really want to delete this metric?')) {
                toast.promise(deleteMetric(metricId), {
                  loading: 'Your metric is being deleted...',
                  success: 'Metric deleted!',
                  error: 'Oops, something went wrong.',
                })
                searchParams.delete('metric_id')
                setSearchParams(searchParams)
              }
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
