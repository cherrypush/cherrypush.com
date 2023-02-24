import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useUsersIndex = () =>
  useQuery(['user', 'users'], () => axios.get('/user/users').then((response) => response.data))
