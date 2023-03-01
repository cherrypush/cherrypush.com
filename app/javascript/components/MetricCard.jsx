import { Card, Dropdown } from 'flowbite-react'
import React from 'react'
import Chart from 'react-apexcharts'
import MenuIcon from '@mui/icons-material/Menu'
import { useSearchParams } from 'react-router-dom'
import { useMetricsDestroy } from '../queries/user/metrics'

const CHART_HEIGHT = 224

const MetricChart = ({ metric }) => {
  const labels = metric.chart_data.map((data) => data[0])
  const series = [{ name: metric.name, data: metric.chart_data.map((data) => data[1]) }]

  const options = {
    chart: {
      background: 'none',
      type: 'area',
      animations: { enabled: false },
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    theme: { mode: 'dark', palette: 'palette2' },
    grid: { show: false },
    xaxis: { tickAmount: 6, labels: { show: true, rotate: 0 }, categories: labels },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: { formatter: (value) => value.toFixed(0) },
    },
    markers: {
      size: 0,
      style: 'hollow',
    },
  }

  return <Chart type="area" height={CHART_HEIGHT} options={options} series={series} />
}

const MetricCard = ({ metric }) => {
  let [searchParams, setSearchParams] = useSearchParams()

  const { mutate: deleteMetric } = useMetricsDestroy({
    onSuccess: () => {
      searchParams.delete('metric_id')
      setSearchParams(searchParams)
    },
  })

  return (
    <Card className="mb-3">
      <div className="flex justify-end px-4 pt-4">
        <Dropdown arrowIcon={false} inline={true} label={<MenuIcon />}>
          <Dropdown.Item
            onClick={() => {
              if (window.confirm('Do you really want to delete this metric?')) deleteMetric(metric.id)
            }}
          >
            Delete this metric
          </Dropdown.Item>
        </Dropdown>
      </div>
      <MetricChart metric={metric} />
    </Card>
  )
}
export default MetricCard
