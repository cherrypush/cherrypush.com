import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

type View = {
  created_at: string
  id: number
  updated_at: string
  user_id: number
  viewable_id: number
  viewable_type: string
}

export const useViewsIndex = ({ metricId }: { metricId: number }) =>
  useQuery(
    ['user', 'views', { metricId }],
    () =>
      axios
        .get<View[]>(`/user/views.json`, { params: { metric_id: metricId } })
        .then((response) => response.data),
    {
      enabled: !!metricId,
    }
  )

export const useViewsCreate = () =>
  useMutation((metricId: number) => axios.post(`/user/views.json`, { metric_id: metricId }))
