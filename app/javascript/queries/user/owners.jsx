import { useQuery } from '@tanstack/react-query'
import httpClient from '../../helpers/httpClient'

export const useOwnersIndex = () =>
  useQuery(['user', 'owners'], () => httpClient.get(`/user/owners.json`).then((response) => response.data))
