import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface User {
  id: number
  name: string
  image: string
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
  useQuery(['user', 'users', id], () => axios.get(`/user/users/${id}.json`).then((response) => response.data), {
    enabled: !!id,
  })

export const useInvalidateUsersIndex = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(buildIndexKey())
}
