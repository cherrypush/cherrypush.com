import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const buildIndexKey = ({ metricId }: { metricId?: number }) => ['user', 'contributors', { metricId }]

export const useContributorsIndex = ({ metricId }: { metricId?: number } = {}) =>
  useQuery(buildIndexKey({ metricId }), () =>
    axios.get(`/user/contributors.json`, { params: { metric_id: metricId } }).then((response) => response.data)
  )
