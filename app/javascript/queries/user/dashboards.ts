import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { ChartKind } from './charts'

const INDEX_KEY = ['user', 'dashboards', 'index']
const buildShowKey = (id: number) => ['user', 'dashboards', id]

export interface ChartMetricType {
  id: number
  chart_id: number
  metric_id: number
  updated_at: string
  created_at: string
}

export interface Chart {
  id: number
  kind: ChartKind
  chart_metrics: ChartMetricType[]
  dashboard_id: number
  updated_at: string
  created_at: string
}

export interface DashboardType {
  id: number
  name: string | null
  project_id: number
  updated_at: string
  created_at: string
  charts: Chart[]
}

interface DashboardPayload {
  project_id: number
  name: string
}

export const useDashboardsIndex = () =>
  useQuery(INDEX_KEY, () => axios.get(`/user/dashboards.json`).then((response) => response.data))

export const useDashboardsCreate = () => {
  const invalidateDashboards = useInvalidateDashboardsIndex()

  return useMutation((dashboard: DashboardPayload) => axios.post(`/user/dashboards.json`, { dashboard }), {
    onSuccess: () => {
      invalidateDashboards()
      toast.success('Dashboard created')
    },
    onError: () => {
      // TODO: establish error handling pattern and use it on all mutation queries
      toast.error('Something went wrong')
    },
  })
}

export const useDashboardsShow = ({ id }: { id: number | undefined }) => {
  const navigate = useNavigate()

  return useQuery(
    ['user', 'dashboards', id],
    () => axios.get(`/user/dashboards/${id}.json`).then((response) => response.data),
    {
      enabled: !!id,
      onError: (error) => {
        if (error.request.status === 401) navigate(error.response.data.redirect_url)
      },
    }
  )
}

export const useDashboardsUpdate = () => {
  const invalidateDashboards = useInvalidateDashboardsIndex()
  const invalidateDashboard = useInvalidateDashboardsShow()

  return useMutation(
    ({ id, dashboard }: { id: number; dashboard: { name: string } }) =>
      axios.put(`/user/dashboards/${id}.json`, { dashboard }).then((response) => response.data),
    {
      onSuccess: (_, { id }) => {
        invalidateDashboards()
        invalidateDashboard(id)
        toast.success('Dashboard updated')
      },
    }
  )
}

export const useDashboardsDestroy = () => {
  const invalidateDashboards = useInvalidateDashboardsIndex()

  return useMutation(
    ({ id }: { id: number }) => axios.delete(`/user/dashboards/${id}.json`).then((response) => response.data),
    {
      onSuccess: () => {
        invalidateDashboards()
        toast.success('Dashboard deleted')
      },
    }
  )
}

export const useInvalidateDashboardsIndex = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(INDEX_KEY)
}

export const useInvalidateDashboardsShow = () => {
  const queryClient = useQueryClient()
  return (id: number) => queryClient.invalidateQueries(buildShowKey(id))
}
