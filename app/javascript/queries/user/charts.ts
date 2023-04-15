import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import httpClient from '../../helpers/httpClient'
import { useInvalidateDashboardsShow } from './dashboards'

export enum ChartKind {
  Area = 'area',
  StackedArea = 'stacked_area',
  StackedPercentageArea = 'stacked_percentage_area',
  Line = 'line',
}

type Chart = {
  id: number
  dashboard_id: number
  metric_ids: number[]
  name: string
  kind: ChartKind
}

type CreateChartPayload = Omit<Chart, 'id'>

export const useChartsCreate = () => {
  const invalidateDashboard = useInvalidateDashboardsShow()

  return useMutation((chart: CreateChartPayload) => httpClient.post(`/user/charts.json`, { chart }), {
    onSuccess: (_, chart) => {
      invalidateDashboard(chart.dashboard_id)
      toast.success('New chart added to dashboard')
    },
  })
}

export const useChartsUpdate = () => {
  const invalidateDashboard = useInvalidateDashboardsShow()

  return useMutation((chart: Chart) => httpClient.put(`/user/charts/${chart.id}.json`, { chart }), {
    onSuccess: (_, chart) => {
      invalidateDashboard(chart.dashboard_id)
      toast.success('Chart updated')
    },
  })
}

export const useChartsDestroy = () => {
  const invalidateDashboard = useInvalidateDashboardsShow()

  return useMutation(
    ({ chartId }: { chartId: number; dashboardId: number }) => httpClient.delete(`/user/charts/${chartId}.json`),
    {
      onSuccess: (_, { dashboardId }) => {
        invalidateDashboard(dashboardId)
        toast.success('Chart deleted')
      },
    }
  )
}
