import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

export type Subscription = {
  id: string
  current_period_end: number
  status: string
  plan: {
    active: boolean
    amount: number
    interval: string
  }
}

type OrganizationIndexResponse = {
  created_at: string
  id: number
  name: string
  sso_domain: string | null
  sso_enabled: boolean
  sso_user_count: number
  stripe_customer_id: string
  updated_at: string
  user_id: number
}[]

export type OrganizationShowResponse = {
  id: number
  name: string
  updated_at: string
  created_at: string
  user_id: number
  sso_enabled: boolean
  sso_domain: string
  sso_user_count: number
  stripe_customer_portal_url: string
  subscriptions: Subscription[]
  user: { name: string; email: string; id: number }
}

const BASE_KEY = ['user', 'organizations']

const buildQueryKey = (organizationId: number) => [...BASE_KEY, organizationId]

export const useOrganizationsIndex = () =>
  useQuery<OrganizationIndexResponse>(BASE_KEY, () =>
    axios.get('/user/organizations.json').then((response) => response.data)
  )

export const useOrganizationsShow = ({ organizationId }: { organizationId: number }) =>
  useQuery<OrganizationShowResponse>(buildQueryKey(organizationId), () =>
    axios.get(`/user/organizations/${organizationId}.json`).then((response) => response.data)
  )

export const useOrganizationsUpdate = () => {
  const invalidateOrganizations = useInvalidateOrganizations()

  return useMutation(
    (organization: Pick<OrganizationShowResponse, 'id' | 'sso_domain' | 'sso_enabled'>) =>
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
