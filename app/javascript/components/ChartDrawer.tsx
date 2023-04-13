import { Autocomplete, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import { Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChartKind, useChartsCreate } from '../queries/user/charts'
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
  const isNewChart = !chartId
  const currentChart = chartId ? dashboard.charts.find((chart) => chart.id === parseInt(chartId)) : undefined

  const [name, setName] = useState('')
  const [kind, setKind] = useState<ChartKind>(ChartKind.Area)
  const [metricIds, setMetricIds] = useState<number[]>([])

  const { data: metrics } = useMetricsIndex({ projectId: dashboard.project_id })
  const { mutate: createChart } = useChartsCreate()

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
  }, [chartId])

  if (!metrics) return null

  const metricOptions = metrics.map((metric) => ({ id: metric.id, label: metric.name }))

  return (
    <Drawer anchor="right" open={open} onClose={onClose} SlideProps={{ className: 'w-11/12 p-12' }}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          createChart({ dashboard_id: dashboard.id, name, metric_ids: metricIds, kind })
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
              value={metricOptions.filter((metric) => metricIds.includes(metric.id))}
              options={metricOptions}
              renderInput={(params) => <TextField {...params} label="Metrics" />}
              onChange={(_event, items) => {
                setMetricIds(items.map((item) => item.id))
              }}
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
              {Object.values(ChartKind).map((kind) => (
                <MenuItem key={kind} value={kind}>
                  {kind.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {metricIds.length > 0 ? <MetricChart kind={kind} metricIds={metricIds} /> : 'No metrics yet'}
          <Button type="submit" disabled={!name || !kind || metricIds.length === 0}>
            Add Chart
          </Button>
        </Stack>
      </form>
    </Drawer>
  )
}

export default ChartDrawer
