import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface User {
  id: number
  name: string
  image: string
}

const buildIndexKey = (ids?: number[]) => (ids ? ['user', 'users', ids] : ['user', 'users'])

export const useUsersIndex = ({ ids, enabled }: { ids?: number[]; enabled?: boolean } = {}) =>
  useQuery(
    buildIndexKey(ids),
    () => axios.get('/user/users.json', { params: { ids } }).then((response) => response.data),
    {
      enabled: enabled && !!ids?.length,
    }
  )

export const useUsersShow = (id: number) =>
  useQuery(['user', 'users', id], () => axios.get(`/user/users/${id}.json`).then((response) => response.data))

export const useInvalidateUsersIndex = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(buildIndexKey())
}
