import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const INDEX_KEY = ['user', 'users']

export const useUsersIndex = () =>
  useQuery(INDEX_KEY, () => axios.get('/user/users.json').then((response) => response.data))

export const useInvalidateUsersIndex = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(INDEX_KEY)
}
