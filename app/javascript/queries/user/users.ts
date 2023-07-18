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

export const useInvalidateUsersIndex = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(buildIndexKey())
}
