import { useQueries } from '@tanstack/react-query'
import { Spinner } from 'flowbite-react'
import _ from 'lodash'
import React from 'react'
import Chart from 'react-apexcharts'
import httpClient from '../helpers/httpClient'
import { ChartKinds } from '../queries/user/charts'

const CHART_HEIGHT = 224
const ONE_DAY = 1000 * 60 * 60 * 24

interface ChartDataPoint {
  date: string
  value: number
}

type ChartData = ChartDataPoint[]

const kindToType = {
  area: 'area',
  line: 'line',
  stacked_area: 'area',
}

const getMinDate = (metrics) =>
  _(metrics)
    .flatMap((metric) => metric.chart_data[0].date)
    .sort()
    .first()

const getMaxDate = (metrics) =>
  _(metrics)
    .flatMap((metric) => metric.chart_data[metric.chart_data.length - 1].date)
    .sort()
    .last()

const fillGaps = (array: ChartData, startDate: string, endDate: string) => {
  const filledArray: { date: string; value: number }[] = []
  let previousValue = 0

  const startTime = new Date(startDate).getTime()
  const endTime = new Date(endDate).getTime()

  for (let time = startTime; time <= endTime; time += ONE_DAY) {
    const date = new Date(time).toISOString().substr(0, 10)
    const currentValue = array.find((item) => item.date === date)?.value ?? previousValue
    filledArray.push({ date, value: currentValue })
    previousValue = currentValue
  }

  return filledArray
}

const MetricChart = ({ metricIds, kind }: { metricIds: number[]; kind: ChartKinds }) => {
  const results = useQueries({
    queries: metricIds.map((id) => ({
      queryKey: ['user', 'metrics', id],
      queryFn: () => httpClient.get(`/user/metrics/${id}.json`).then((response) => response.data),
    })),
  })

  const isLoading = results.some((result) => result.isLoading)
  if (isLoading) return <Spinner />

  if (metricIds.length === 0) return null

  const metrics = results.map((result) => result.data)

  const series = metrics.map((metric) => ({
    name: metric.name,
    data: (metrics.length > 1
      ? fillGaps(metric.chart_data, getMinDate(metrics), getMaxDate(metrics))
      : metric.chart_data
    ).map((item) => ({
      x: item.date,
      y: item.value,
    })),
  }))

  const options = {
    chart: {
      background: 'none',
      type: kindToType[kind],
      stacked: kind === 'stacked_area',
      animations: { enabled: false },
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    theme: { mode: 'dark', palette: 'palette2' },
    grid: { show: false },
    xaxis: { tickAmount: 6, labels: { show: true, rotate: 0 }, type: 'datetime' },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: { formatter: (value) => value.toFixed(0) },
    },
    markers: {
      size: 0,
      style: 'hollow',
    },
    // legend: {
    //   position: 'top',
    //   horizontalAlign: 'left',
    // },
  }

  console.log(options.chart)

  return <Chart type={kindToType[kind]} height={CHART_HEIGHT} options={options} series={series} />
}

export default MetricChart
