import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface Organization {
  id: number
  name: string
  updated_at: string
  created_at: string
  user_id: number
}

export const useOrganizationsShow = ({ organizationId }: { organizationId: number }) =>
  useQuery<Organization>(['user', 'organizations', organizationId], () =>
    axios.get(`/user/organizations/${organizationId}.json`).then((response) => response.data)
  )
