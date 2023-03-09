import { useQuery } from '@tanstack/react-query'
import httpClient from '../../helpers/httpClient'

interface Project {
  id: number
}

export const useProjectsIndex = () =>
  useQuery<Project[]>(['user', 'projects'], () =>
    httpClient.get('/user/projects.json').then((response) => response.data)
  )
