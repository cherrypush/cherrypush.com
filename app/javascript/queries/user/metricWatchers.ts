import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useInvalidateMetricsIndex, useInvalidateMetricsShow } from './metrics'

export const useMetricWatchersCreate = () => {
  const invalidateMetrics = useInvalidateMetricsIndex()
  const invalidateMetric = useInvalidateMetricsShow()

  return useMutation(
    ({ metricId }: { metricId: number }) => axios.post(`/user/metric_watchers.json`, { metric_id: metricId }),
    {
      onSuccess: (_, { metricId }) => {
        invalidateMetric(metricId)
        invalidateMetrics()
        toast.success("You're now watching this metric")
      },
    }
  )
}

export const useMetricWatchersDestroy = () => {
  const invalidateMetrics = useInvalidateMetricsIndex()
  const invalidateMetric = useInvalidateMetricsShow()

  return useMutation(
    ({ metricId }: { metricId: number }) =>
      axios.delete(`/user/metric_watchers.json`, { data: { metric_id: metricId } }),
    {
      onSuccess: (_, { metricId }) => {
        invalidateMetric(metricId)
        invalidateMetrics()
        toast.success("You're no longer watching this metric")
      },
    }
  )
}
