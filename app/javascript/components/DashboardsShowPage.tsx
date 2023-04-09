import { Autocomplete } from '@mui/joy'
import { Breadcrumb, Button, Card, Label, Modal } from 'flowbite-react'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useChartsCreate } from '../queries/user/charts'
import { useDashboardsShow } from '../queries/user/dashboards'
import { useMetricsIndex } from '../queries/user/metrics'
import ChartCard from './ChartCard'
import DashboardMenu from './DashboardMenu'

const AddNewChartButton = ({ dashboard }) => {
  const initialChart = { metric_ids: [], dashboard_id: dashboard.id, name: 'New chart' }
  const [chart, setChart] = React.useState<{ metric_ids: number[]; dashboard_id: number; name: string }>(initialChart)
  const [show, setShow] = useState(false)
  const { data: metrics } = useMetricsIndex({ projectId: dashboard.project_id })
  const { mutateAsync: createChart } = useChartsCreate()

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
                onChange={(_, metric) =>
                  setChart({ ...chart, metric_ids: [...chart.metric_ids, metric.id], name: metric.label })
                }
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
                  setChart(initialChart)
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
            <Breadcrumb.Item>
              <span className="text-white">{dashboard.name}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <AddNewChartButton dashboard={dashboard} />
            <DashboardMenu dashboard={dashboard} />
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
