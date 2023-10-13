import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

export interface Organization {
  id: number
  name: string
  updated_at: string
  created_at: string
  user_id: number
  sso_enabled: boolean
  sso_domain: string
}

const BASE_KEY = ['user', 'organizations']

const buildQueryKey = (organizationId: number) => [...BASE_KEY, organizationId]

export const useOrganizationsIndex = () =>
  useQuery<Organization[]>(BASE_KEY, () => axios.get('/user/organizations.json').then((response) => response.data))

export const useOrganizationsShow = ({ organizationId }: { organizationId: number }) =>
  useQuery<Organization>(buildQueryKey(organizationId), () =>
    axios.get(`/user/organizations/${organizationId}.json`).then((response) => response.data)
  )

export const useOrganizationsUpdate = () => {
  const invalidateOrganizations = useInvalidateOrganizations()

  return useMutation(
    (organization: Pick<Organization, 'id' | 'sso_domain' | 'sso_enabled'>) =>
      axios.put(`/user/organizations/${organization.id}.json`, organization),
    {
      onSuccess: () => {
        invalidateOrganizations()
        toast.success('Organization updated')
      },
    }
  )
}

export const useInvalidateOrganizations = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(['user', 'organizations'])
}
