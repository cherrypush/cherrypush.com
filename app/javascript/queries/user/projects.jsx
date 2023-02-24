import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useProjectsIndex = () =>
  useQuery(['user', 'projects'], () => axios.get('/user/projects.json').then((response) => response.data))
