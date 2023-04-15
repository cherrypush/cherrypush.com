import { Autocomplete, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import { Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ChartKind, useChartsCreate, useChartsUpdate } from '../queries/user/charts'
import { DashboardType } from '../queries/user/dashboards'
import { useMetricsIndex } from '../queries/user/metrics'
import MetricChart from './MetricChart'

interface Props {
  open: boolean
  onClose: () => void
  dashboard: DashboardType
}

const ChartDrawer = ({ onClose, dashboard, open }: Props) => {
  const { chartId } = useParams()
  const location = useLocation()

  const isNewChart = !chartId
  const currentChart = chartId ? dashboard.charts.find((chart) => chart.id === parseInt(chartId)) : undefined

  const [name, setName] = useState('')
  const [kind, setKind] = useState<ChartKind>(ChartKind.Area)
  const [metricIds, setMetricIds] = useState<number[]>([])

  const { data: metrics } = useMetricsIndex({ projectId: dashboard.project_id })
  const { mutate: createChart } = useChartsCreate()
  const { mutate: updateChart } = useChartsUpdate()

  useEffect(() => {
    if (!chartId) {
      setName('')
      setKind(ChartKind.Area)
      setMetricIds([])
    } else {
      setName(currentChart?.name || '')
      setKind(currentChart?.kind || ChartKind.Area)
      setMetricIds(currentChart?.chart_metrics.map((chartMetric) => chartMetric.metric_id) || [])
    }
  }, [location.pathname])

  if (!metrics) return null

  const metricOptions = metrics.map((metric) => ({ id: metric.id, label: metric.name }))

  return (
    <Drawer anchor="right" open={open} onClose={onClose} SlideProps={{ className: 'w-11/12 p-12' }}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          isNewChart
            ? createChart({ dashboard_id: dashboard.id, name, kind, metric_ids: metricIds })
            : updateChart({ id: parseInt(chartId), dashboard_id: dashboard.id, name, kind, metric_ids: metricIds })
          onClose()
        }}
      >
        <h1>{isNewChart ? 'New Chart' : 'Edit Chart'}</h1>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              autoFocus
              label="Title"
              value={name}
              onChange={(event) => setName(event?.target.value)}
            />
          </FormControl>
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
          <Button type="submit" disabled={!name || !kind || metricIds.length === 0}>
            {isNewChart ? 'Create' : 'Update'}
          </Button>
        </Stack>
      </form>
    </Drawer>
  )
}

export default ChartDrawer
