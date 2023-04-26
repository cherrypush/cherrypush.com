import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const buildIndexKey = ({ projectId, metricId }: { projectId?: number; metricId?: number }) => [
  'user',
  'owners',
  { projectId, metricId },
]

export const useOwnersIndex = ({ projectId, metricId }: { projectId?: number; metricId?: number }) =>
  useQuery(buildIndexKey({ projectId, metricId }), () =>
    axios
      .get(`/user/owners.json`, { params: { project_id: projectId, metric_id: metricId } })
      .then((response) => response.data)
  )
