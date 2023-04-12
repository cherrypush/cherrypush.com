import { Autocomplete, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import { Button } from 'flowbite-react'
import React, { useState } from 'react'
import { ChartKind, useChartsCreate } from '../queries/user/charts'
import { useMetricsIndex } from '../queries/user/metrics'
import MetricChart from './MetricChart'

const ChartDrawer = ({ onClose, dashboard, show }) => {
  const [name, setName] = useState('')
  const [kind, setKind] = useState<ChartKind>(ChartKind.Area)
  const { data: metrics } = useMetricsIndex({ projectId: dashboard.project_id })
  const [metricIds, setMetricIds] = useState<number[]>([])
  const { mutate: createChart } = useChartsCreate()

  if (!metrics) return null

  return (
    <Drawer anchor="right" open={show} onClose={onClose} SlideProps={{ className: 'w-11/12 p-12' }}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          createChart({ dashboard_id: dashboard.id, name, metric_ids: metricIds, kind })
          onClose()
        }}
      >
        <h1>New Chart</h1>
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
              options={metrics.map((metric) => ({ id: metric.id, label: metric.name }))}
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
