import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const buildIndexKey = ({ metricId }: { metricId: number }) => ['user', 'contributions', { metricId }]

export const useContributionsIndex = ({ metricId }: { metricId: number }) =>
  useQuery(buildIndexKey({ metricId }), () =>
    axios.get(`/user/contributions.json`, { params: { metric_id: metricId } }).then((response) => response.data)
  )
