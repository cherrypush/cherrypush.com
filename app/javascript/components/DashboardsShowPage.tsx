import { Autocomplete } from '@mui/joy'
import { Breadcrumb, Button, Card, Label, Modal } from 'flowbite-react'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useChartsCreate } from '../queries/user/charts'
import { useDashboardsShow } from '../queries/user/dashboards'
import { useMetricsIndex } from '../queries/user/metrics'
import ChartCard from './ChartCard'
import DashboardMenu from './DashboardMenu'

const EditDashboardButton = ({ dashboard }) => {
  const [chart, setChart] = React.useState<{ metric_ids: number[]; dashboard_id: number }>({
    metric_ids: [],
    dashboard_id: dashboard.id,
  })
  const [show, setShow] = useState(false)
  const { data: metrics } = useMetricsIndex({ projectId: dashboard.project_id })
  const { mutate: createChart } = useChartsCreate()

  return (
    <>
      <Button onClick={() => setShow(true)}>+ Add Metric</Button>
      <Modal show={show} onClose={() => setShow(false)} dismissible>
        <Modal.Header>Add Metric</Modal.Header>
        <Modal.Body>
          <div>
            <Label htmlFor="metric" value="Metric" className="block mb-2" />
            {metrics && (
              <Autocomplete
                variant="soft"
                placeholder="Select a metric..."
                onChange={(_, metric) => setChart({ ...chart, metric_ids: [...chart.metric_ids, metric.id] })}
                options={metrics.map((metric) => ({ id: metric.id, label: metric.name }))}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button
            onClick={() =>
              createChart(chart, {
                onSuccess: () => {
                  setShow(false)
                },
              })
            }
          >
            Add Metric
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const DashboardsShowPage = () => {
  const { id } = useParams()
  const { data: dashboard } = useDashboardsShow({ id: id ? parseInt(id) : undefined })

  if (!dashboard) return null

  return (
    <div>
      <Card className="mb-3">
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <Breadcrumb.Item href="/user/dashboards">Dashboards</Breadcrumb.Item>
            <Breadcrumb.Item>{dashboard.name}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <EditDashboardButton dashboard={dashboard} />
            <DashboardMenu dashboardId={dashboard.id} />
          </div>
        </div>
      </Card>
      {dashboard.charts.map((chart) => (
        <ChartCard chart={chart} key={chart.id} className="mb-3" />
      ))}
    </div>
  )
}

export default DashboardsShowPage
