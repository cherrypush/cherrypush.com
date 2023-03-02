import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import httpClient from '../../helpers/httpClient'

export const useMetricsShow = ({ id, owners }) =>
  useQuery(
    ['user', 'metrics', id, { owners }],
    () =>
      id
        ? httpClient
            .get(`/user/metrics/${id}.json`, { params: { owner_handles: owners } })
            .then((response) => response.data)
        : null,
    { keepPreviousData: true }
  )

export const useMetricsIndex = ({ projectId } = {}) =>
  useQuery(['user', 'metrics', { projectId }], () =>
    httpClient.get('/user/metrics.json', { params: { project_id: projectId } }).then((response) => response.data)
  )

export const useMetricsDestroy = ({ onSuccess }) => {
  const queryClient = useQueryClient()

  return useMutation((metricId) => httpClient.delete(`/user/metrics/${metricId}.json`), {
    onSuccess: () => {
      onSuccess?.()
      queryClient.invalidateQueries(['user', 'metrics'])
      toast.success('Metric deleted')
    },
  })
}
