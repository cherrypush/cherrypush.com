import { Card } from 'flowbite-react'
import { ChartKind } from '../queries/user/charts'
import MetricChart from './MetricChart'

const MetricCard = ({ metricId, owners }: { metricId: number; owners?: string[] }) => (
  <Card className="mb-3">
    <MetricChart kind={ChartKind.Area} metricIds={[metricId]} owners={owners} />
  </Card>
)
export default MetricCard
