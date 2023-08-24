import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface Occurrence {
  id: number
  text: string
  url: string
  value: number
  owners: string[]
}

export const useOccurrencesIndex = (metricId: number | null, owners: string[] = []) =>
  useQuery<Occurrence[]>(
    ['user', 'metrics', metricId, 'occurrences', { owners }],
    () => axios.get(`/user/metrics/${metricId}/occurrences`, { params: { owners } }).then((response) => response.data),
    { staleTime: 1000 * 60, enabled: Boolean(metricId), keepPreviousData: true }
  )
