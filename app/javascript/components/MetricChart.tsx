import { useQueries } from '@tanstack/react-query'
import { Spinner } from 'flowbite-react'
import _ from 'lodash'
import React, { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { useNavigate } from 'react-router-dom'
import useSelectedOwners from '../hooks/useSelectedOwners'
import { ChartKind } from '../queries/user/charts'
import { metricShowOptions } from '../queries/user/metrics'

const CHART_HEIGHT = 224

type ChartData = { [date: string]: number }

const kindToType = {
  area: 'area',
  line: 'line',
  stacked_area: 'area',
  stacked_percentage_area: 'area',
}

const buildSeries = (metrics, kind) => {
  let chartsData = metrics.map((metric) => metric.chart_data)
  if (chartsData.length > 1) chartsData = fillGaps(chartsData)
  if (kind === ChartKind.StackedPercentageArea) chartsData = toPercentages(chartsData)

  return toApexChartsData(metrics, chartsData)
}

const fillGaps = (inputChartsData: ChartData[]) => {
  const chartsData = _.cloneDeep(inputChartsData)
  const allDays = _.uniq(chartsData.flatMap((chartData) => Object.keys(chartData))).sort()
  chartsData.forEach((chartData) => {
    let previousValue = 0
    allDays.forEach((day) => {
      if (chartData[day] === undefined) chartData[day] = previousValue
      previousValue = chartData[day]
    })
  })
  return chartsData
}

const toPercentages = (inputChartsData: ChartData[]) => {
  const chartsData = _.cloneDeep(inputChartsData)
  Object.keys(chartsData[0]).forEach((day) => {
    const total = chartsData.reduce((sum, serie) => sum + serie[day], 0)
    chartsData.forEach((serie) => (serie[day] = (serie[day] / total) * 100))
  })
  return chartsData
}

const toApexChartsData = (metrics, chartsData: ChartData[]) =>
  chartsData.map((chartData, index) => ({
    name: metrics[index].name,
    data: _.sortBy(
      Object.entries(chartData).map(([day, value]) => ({ x: day, y: value })),
      'x'
    ),
  }))

interface Props {
  metricIds: number[]
  kind: ChartKind
  owners?: string[]
}

const MetricChart = ({ metricIds, kind, owners }: Props) => {
  const navigate = useNavigate()
  const results = useQueries({ queries: metricIds.map((id) => metricShowOptions(id, owners)) })
  const metrics = results.map((result) => result.data)
  const isLoading = results.some((result) => result.isLoading)
  const { selectedOwners, setSelectedOwners } = useSelectedOwners()

  const series = useMemo(() => (metrics.every(Boolean) ? buildSeries(metrics, kind) : []), [metrics, kind])

  if (isLoading)
    return (
      <div className={`h-[${CHART_HEIGHT}px]`}>
        <Spinner />
      </div>
    )

  if (metricIds.length === 0) return null

  const options = {
    chart: {
      background: 'none',
      type: kindToType[kind],
      stacked: kind === 'stacked_area' || kind === 'stacked_percentage_area',
      animations: { enabled: false },
      zoom: { enabled: false },
      toolbar: { show: false },
      events: {
        legendClick: (chartContext, seriesIndex) => {
          let url = `/user/projects?project_id=${metrics[seriesIndex].project_id}&metric_id=${metrics[seriesIndex].id}`
          url += selectedOwners.length > 0 ? `&owners=${selectedOwners.join(',')}` : ''
          navigate(url)
        },
      },
    },
    dataLabels: { enabled: false },
    theme: { mode: 'dark', palette: 'palette6' },
    grid: { show: false },
    xaxis: { tickAmount: 6, labels: { show: true, rotate: 0 }, type: 'datetime' },
    yaxis: {
      min: 0,
      forceNiceScale: kind !== ChartKind.StackedPercentageArea,
      labels: {
        formatter: (value) =>
          kind === ChartKind.StackedPercentageArea ? value.toFixed(0).toString() + '%' : value.toFixed(0).toString(),
      },
      max: kind === ChartKind.StackedPercentageArea ? 100 : undefined,
    },
    markers: {
      size: 0,
      style: 'hollow',
    },
    legend: {
      showForSingleSeries: true,
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '16px',
      onItemClick: {
        toggleDataSeries: false,
      },
    },
  }

  return <Chart type={kindToType[kind]} height={CHART_HEIGHT} options={options} series={series} />
}

export default MetricChart
