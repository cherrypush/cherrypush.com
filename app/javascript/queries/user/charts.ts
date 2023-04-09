import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import httpClient from '../../helpers/httpClient'
import { useInvalidateDashboardsShow } from './dashboards'

interface ChartPayload {
  dashboard_id: number
  metric_ids: number[]
  name: string
}

export const useChartsCreate = () => {
  const invalidateDashboard = useInvalidateDashboardsShow()

  return useMutation((chart: ChartPayload) => httpClient.post(`/user/charts.json`, { chart }), {
    onSuccess: (_, chart) => {
      invalidateDashboard(chart.dashboard_id)
      toast.success('New metric added to dashboard')
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
