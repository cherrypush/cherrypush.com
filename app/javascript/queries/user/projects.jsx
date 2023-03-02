import { useQuery } from '@tanstack/react-query'
import httpClient from '../../helpers/httpClient'

export const useProjectsIndex = () =>
  useQuery(['user', 'projects'], () => httpClient.get('/user/projects.json').then((response) => response.data))
