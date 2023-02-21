import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useMetricsShow = ({ metricId, owners }) =>
  useQuery(['user', 'metrics', metricId], () =>
    axios.get(`/user/metrics/${metricId}`, { params: { owners } }).then((response) => response.data)
  )
