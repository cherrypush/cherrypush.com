import { useQuery } from '@tanstack/react-query'
import httpClient from '../../helpers/httpClient'

interface Project {
  id: number
  name: string
  updated_at: string
  created_at: string
  user_id: number
  user: { name: string }
}

export const useProjectsIndex = () =>
  useQuery<Project[]>(['user', 'projects'], () =>
    httpClient.get('/user/projects.json').then((response) => response.data)
  )
