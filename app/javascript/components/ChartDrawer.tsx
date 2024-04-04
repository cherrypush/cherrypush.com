import { Autocomplete, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import { Button } from 'flowbite-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChartKind, useChartsCreate, useChartsUpdate } from '../queries/user/charts'
import { Chart, UseDashboardsIndexResponse } from '../queries/user/dashboards'
import { Metric, useMetricsIndex } from '../queries/user/metrics'
import MetricChart from './MetricChart'

interface ChartFormProps {
  metrics: Metric[]
  chart?: Chart
  dashboard: UseDashboardsIndexResponse
  onClose: () => void
}

const ChartForm = ({ metrics, chart, dashboard, onClose }: ChartFormProps) => {
  const { mutate: createChart } = useChartsCreate()
  const { mutate: updateChart } = useChartsUpdate()
  const [kind, setKind] = useState<ChartKind>(chart?.kind || ChartKind.Area)
  const [metricIds, setMetricIds] = useState<number[]>(
    chart?.chart_metrics.map((chartMetric) => chartMetric.metric_id) || []
  )

  const metricOptions = metrics.map((metric) => ({ id: metric.id, label: metric.name }))
  const id = chart?.id

  return (
    <form
      id="chart-drawer-form"
      onSubmit={(event) => {
        event.preventDefault()
        const params = { dashboard_id: dashboard.id, name, kind, metric_ids: metricIds }
        id ? updateChart({ id, ...params }) : createChart(params)
        onClose()
      }}
    >
      <Stack spacing={3}>
        <h1>{id ? 'Edit Chart' : 'New Chart'}</h1>
        <FormControl fullWidth>
          <Autocomplete
            multiple
            value={metricIds.map((metricId) => metricOptions.find((metric) => metric.id === metricId))}
            options={metricOptions}
            renderInput={(params) => <TextField {...params} label="Metrics" />}
            onChange={(_event, items) => setMetricIds(items.flatMap((item) => (item ? item.id : [])))}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="chart-kind-label">Chart Type</InputLabel>
          <Select
            name="kind"
            labelId="chart-kind-label"
            value={kind}
            defaultValue={kind}
            label="Chart Type"
            fullWidth
            onChange={(event) => setKind(event.target.value)}
          >
            <MenuItem value={ChartKind.Line}>Line</MenuItem>
            <MenuItem value={ChartKind.Area}>Area</MenuItem>
            <MenuItem value={ChartKind.StackedArea} disabled={metricIds.length < 2}>
              Stacked Area
            </MenuItem>
            <MenuItem value={ChartKind.StackedPercentageArea} disabled={metricIds.length < 2}>
              Stacked Percentage Area
            </MenuItem>
          </Select>
        </FormControl>
        <MetricChart kind={kind} metricIds={metricIds} />
        <Button type="submit" disabled={!kind || metricIds.length === 0}>
          {id ? 'Update' : 'Create'}
        </Button>
      </Stack>
    </form>
  )
}

interface Props {
  open: boolean
  onClose: () => void
  dashboard: UseDashboardsIndexResponse
}

const ChartDrawer = ({ onClose, dashboard, open }: Props) => {
  const { chartId } = useParams()
  const { data: metrics } = useMetricsIndex({ projectId: dashboard.project_id })

  if (!metrics) return null

  const chart = chartId ? dashboard.charts.find((chart) => chart.id === parseInt(chartId)) : undefined

  return (
    <Drawer anchor="right" open={open} onClose={onClose} SlideProps={{ className: 'w-11/12 p-12' }}>
      <ChartForm metrics={metrics} chart={chart} dashboard={dashboard} onClose={onClose} />
    </Drawer>
  )
}

export default ChartDrawer
