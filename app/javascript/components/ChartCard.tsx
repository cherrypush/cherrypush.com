import { Card, Dropdown } from 'flowbite-react'
import { HiDotsVertical, HiPencil, HiTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import useSelectedOwners from '../hooks/useSelectedOwners'
import { useChartsDestroy } from '../queries/user/charts'
import { Chart } from '../queries/user/dashboards'
import MetricChart from './MetricChart'

const ChartCard = ({ chart }: { chart: Chart }) => {
  const { mutateAsync: removeChart } = useChartsDestroy()
  const navigate = useNavigate()
  const { selectedOwners } = useSelectedOwners()

  return (
    <Card className="mb-3 relative">
      <div className="absolute right-3 top-3 items-center justify-end z-10">
        <Dropdown
          arrowIcon={false}
          label={<HiDotsVertical />}
          color="dark"
          placement="bottom-end"
          data-testid="chart-menu"
        >
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
      <MetricChart
        kind={chart.kind}
        metricIds={chart.chart_metrics.map((metric) => metric.metric_id)}
        owners={selectedOwners}
      />
    </Card>
  )
}

export default ChartCard
