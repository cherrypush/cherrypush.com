import React from 'react'
import Chart from 'react-apexcharts'
import { useMetricsShow } from '../queries/user/metrics'

const CHART_HEIGHT = 224

const MetricChart = ({ metricId }) => {
  const { data: metric } = useMetricsShow({ id: metricId })

  if (!metric) return null

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

export default MetricChart
