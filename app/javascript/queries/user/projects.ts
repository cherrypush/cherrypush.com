import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface Project {
  id: number
  name: string
  updated_at: string
  created_at: string
  user_id: number
  user: { name: string }
  organization_id: null | number
  organization?: { id: number; name: string }
}

type ProjectsIndexResponse = (Project & { user: { name: string } })[]

export const useProjectsIndex = () =>
  useQuery<ProjectsIndexResponse>(['user', 'projects'], () =>
    axios.get('/user/projects.json').then((response) => response.data)
  )
