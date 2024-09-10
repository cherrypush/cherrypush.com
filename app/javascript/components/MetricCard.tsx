import { Card } from 'flowbite-react'
import { useEffect } from 'react'
import { ChartKind } from '../queries/user/charts'
import { useViewsCreate } from '../queries/user/views'
import MetricChart from './MetricChart'

const MetricCard = ({ metricId, owners }: { metricId: number; owners?: string[] }) => {
  const { mutate: trackView } = useViewsCreate()

  useEffect(() => {
    trackView(metricId)
  }, [metricId, trackView])

  return (
    <Card className="mb-3">
      <MetricChart kind={ChartKind.Area} metricIds={[metricId]} owners={owners} />
    </Card>
  )
}
export default MetricCard
