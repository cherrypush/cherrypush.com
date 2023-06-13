import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface Project {
  id: number
  name: string
  updated_at: string
  created_at: string
  user_id: number
}

type ProjectsIndexResponse = Project & { user: { name: string } }[]

export const useProjectsIndex = () =>
  useQuery<ProjectsIndexResponse>(['user', 'projects'], () =>
    axios.get('/user/projects.json').then((response) => response.data)
  )
