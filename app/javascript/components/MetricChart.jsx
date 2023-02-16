import React from 'react'
import Chart from 'react-apexcharts'
import { useMetricsShow } from '../queries/user/metrics'

const MetricChart = ({ metricId }) => {
  const { data: metric } = useMetricsShow({ metricId })

  if (!metric) return null // TODO: Handle loading state

  // TODO: Simplify chart data formatting on backend
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
    xaxis: { tickAmount: 6, labels: { show: true }, categories: labels },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: { formatter: (value) => value.toFixed(0) },
    },
  }

  return (
    <div className="card mb-3 text-center">
      {/* TODO: Add a button to favorite metric */}
      <h3 className="flex items-center">{metric.name}</h3>
      <Chart type="area" height={224} options={options} series={series} />
    </div>
  )
}

export default MetricChart
