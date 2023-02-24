import { Card, Spinner } from 'flowbite-react'
import React from 'react'
import Chart from 'react-apexcharts'
import { useMetricsShow } from '../queries/user/metrics'

const MetricChart = ({ metricId, selectedOwners }) => {
  const { data: metric, isLoading } = useMetricsShow({ metricId, owners: selectedOwners.map((o) => o.handle) })

  if (isLoading)
    return (
      <Card className="mb-3 text-center">
        <Spinner />
      </Card>
    )

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

  return (
    <Card className="mb-3 text-center">
      <Chart type="area" height={224} options={options} series={series} />
    </Card>
  )
}

export default MetricChart
