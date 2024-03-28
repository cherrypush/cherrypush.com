import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export type UserShowResponse = {
  api_key: string
  created_at: string
  email: string
  favorite_dashboard_ids: number[]
  favorite_metric_ids: number[]
  favorite_metric_names: string[]
  favorite_owner_handles: string[]
  favorite_project_ids: string[]
  github_handle: string
  github_organizations: string[]
  id: number
  image: string
  name: string
  provider: string
  uid: string
  updated_at: string
  weekly_report: boolean
}

type UsersIndexResponse = {
  id: number
  name: string
  github_handle: string
}[]

const buildIndexKey = (ids?: number[]) => (ids ? ['user', 'users', ids] : ['user', 'users'])

export const useUsersIndex = ({ ids, enabled }: { ids?: number[]; enabled?: boolean } = {}) =>
  useQuery<UsersIndexResponse>(
    buildIndexKey(ids),
    () => axios.get('/user/users.json', { params: { ids } }).then((response) => response.data),
    {
      enabled: enabled && !!ids?.length,
    }
  )

export const useUsersShow = (id: number | undefined) =>
  useQuery<UserShowResponse>(
    ['user', 'users', id],
    () => axios.get(`/user/users/${id}.json`).then((response) => response.data),
    {
      enabled: Boolean(id),
    }
  )

export const useInvalidateUsersIndex = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(buildIndexKey())
}
