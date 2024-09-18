import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export type ProjectsIndexResponse = (Project & { user: { name: string } })[]

const INDEX_KEY = ['user', 'projects', 'index']

export const useInvalidateProjectsIndex = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(INDEX_KEY)
}

export const useProjectsIndex = () =>
  useQuery<ProjectsIndexResponse>(INDEX_KEY, () => axios.get('/user/projects.json').then((response) => response.data))

export const useProjectsDestroy = () => {
  const invalidateProjects = useInvalidateProjectsIndex()

  return useMutation(
    (projectId: number) => axios.delete(`/user/projects/${projectId}.json`).then((response) => response.data),
    {
      onSuccess: () => invalidateProjects(),
    }
  )
}
