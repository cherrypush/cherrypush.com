import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export interface Metric {
  id: number
  name: string
}

export const useMetricsIndex = ({ projectId }: { projectId?: number }) =>
  useQuery<Metric[]>(['user', 'metrics', { projectId }], () =>
    axios.get('/user/metrics.json', { params: { project_id: projectId } }).then((response) => response.data)
  )

export const useMetricsDestroy = ({ onSuccess }) => {
  const queryClient = useQueryClient()

  return useMutation((metricId) => axios.delete(`/user/metrics/${metricId}.json`), {
    onSuccess: () => {
      onSuccess?.()
      queryClient.invalidateQueries(['user', 'metrics'])
      toast.success('Metric deleted')
    },
  })
}

export const metricShowOptions = (id: number | null, owners: string[] = []) => ({
  queryKey: ['user', 'metrics', id, { owners }],
  queryFn: () =>
    axios.get(`/user/metrics/${id}.json`, { params: { owner_handles: owners } }).then((response) => response.data),
  staleTime: 1000 * 60,
  enabled: Boolean(id),
  keepPreviousData: true,
})

export const useMetricsShow = (id: number | null, owners: string[] = []) => useQuery(metricShowOptions(id, owners))
