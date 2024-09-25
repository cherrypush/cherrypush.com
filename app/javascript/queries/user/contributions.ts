import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface Contribution {
  id: number
  commit_sha: string
  commit_date: string
  commit_url: string
  author_name: string
  author_email: string
  diff: number
  metric_id: number
  created_at: string
  updated_at: string
  metric: {
    id: number
    name: string
    project_id: number
    created_at: string
    updated_at: string
    watcher_ids: number[]
    project: {
      id: number
      name: string
      user_id: number
      created_at: string
      updated_at: string
    }
  }
}

const buildIndexKey = ({ metricId, userId }: { metricId?: number; userId?: number }) => [
  'user',
  'contributions',
  { metricId, userId },
]

export const useContributionsIndex = ({ metricId, userId }: { metricId?: number; userId?: number } = {}) =>
  useQuery<Contribution[]>(buildIndexKey({ metricId, userId }), () =>
    axios
      .get(`/user/contributions.json`, { params: { metric_id: metricId, user_id: userId } })
      .then((response) => response.data)
  )
