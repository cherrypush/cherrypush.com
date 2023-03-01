import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export const useMetricsShow = ({ id, owners }) =>
  useQuery(
    ['user', 'metrics', id, { owners }],
    () =>
      id
        ? axios.get(`/user/metrics/${id}.json`, { params: { owner_handles: owners } }).then((response) => response.data)
        : null,
    { keepPreviousData: true }
  )

export const useMetricsIndex = ({ projectId } = {}) =>
  useQuery(['user', 'metrics', { projectId }], () =>
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
