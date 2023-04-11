import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import httpClient from '../../helpers/httpClient'

const INDEX_KEY = ['user', 'dashboards', 'index']
const buildShowKey = (id: number) => ['user', 'dashboards', id]

interface DashboardType {
  id: number
}

interface DashboardPayload {
  project_id: number
  name: string
}

export const useDashboardsIndex = () =>
  useQuery(INDEX_KEY, () => httpClient.get(`/user/dashboards.json`).then((response) => response.data))

export const useDashboardsCreate = () => {
  const invalidateDashboards = useInvalidateDashboardsIndex()

  return useMutation((dashboard: DashboardPayload) => httpClient.post(`/user/dashboards.json`, { dashboard }), {
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

export const useDashboardsShow = ({ id }: { id: number | undefined }) =>
  useQuery(
    ['user', 'dashboards', id],
    () => httpClient.get(`/user/dashboards/${id}.json`).then((response) => response.data),
    { enabled: !!id }
  )

export const useDashboardsUpdate = () => {
  const invalidateDashboards = useInvalidateDashboardsIndex()
  const invalidateDashboard = useInvalidateDashboardsShow()

  return useMutation(
    ({ id, dashboard }: { id: number; dashboard: { name: string } }) =>
      httpClient.put(`/user/dashboards/${id}.json`, { dashboard }).then((response) => response.data),
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
    ({ id }: { id: number }) => httpClient.delete(`/user/dashboards/${id}.json`).then((response) => response.data),
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
