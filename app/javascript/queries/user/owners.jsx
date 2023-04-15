import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useOwnersIndex = () =>
  useQuery(['user', 'owners'], () => axios.get(`/user/owners.json`).then((response) => response.data))
