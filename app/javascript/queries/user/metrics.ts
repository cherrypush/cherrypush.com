import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Project } from './projects'

export interface Metric {
  id: number
  name: string
  project_id: number
  updated_at: string
  created_at: string
  watcher_ids: number[]
}

type MetricIndexReponse = (Metric & { project: Project })[]

const buildIndexKey = ({ projectId }: { projectId?: number } = {}) =>
  projectId ? ['user', 'metrics', 'index', { projectId }] : ['user', 'metrics', 'index']

const buildShowKey = (id: number | null, owners: string[] = []) => ['user', 'metrics', 'show', id, { owners }]

export const useMetricsIndex = ({ projectId }: { projectId?: number } = {}) =>
  useQuery<MetricIndexReponse>(buildIndexKey({ projectId }), () =>
    axios.get('/user/metrics.json', { params: { project_id: projectId } }).then((response) => response.data)
  )

export const useMetricsShow = (id: number | null, owners: string[] = []) => useQuery(metricShowOptions(id, owners))

export const useMetricsDestroy = () => {
  const invalidateIndex = useInvalidateMetricsIndex()

  return useMutation((metricId: number) => axios.delete(`/user/metrics/${metricId}.json`), {
    onSuccess: () => invalidateIndex(),
  })
}

export const metricShowOptions = (id: number | null, owners: string[] = []) => ({
  queryKey: buildShowKey(id, owners),
  queryFn: () =>
    axios.get(`/user/metrics/${id}.json`, { params: { owner_handles: owners } }).then((response) => response.data),
  staleTime: 1000 * 60,
  enabled: Boolean(id),
  keepPreviousData: true,
})

export const useInvalidateMetricsShow = () => {
  const queryClient = useQueryClient()
  return (metricId: number) => queryClient.invalidateQueries(buildShowKey(metricId))
}

export const useInvalidateMetricsIndex = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(buildIndexKey())
}
