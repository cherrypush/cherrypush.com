import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'

type AuthorizationRequestsIndexResponse = {
  created_at: string
  id: number
  organization_id: number
  organization: { id: number; name: string }
  updated_at: string
  user: { id: number; name: string }
  user_id: number
}[]

export const useAuthorizationRequestsIndex = () =>
  useQuery<AuthorizationRequestsIndexResponse>(['user', 'authorization_requests', 'index'], () =>
    axios.get('/user/authorization_requests.json').then((response) => response.data)
  )

export const useAuthorizationRequestsCreate = () => {
  return useMutation(
    ['user', 'authorization_requests', 'create'],
    ({ projectId }: { projectId: number }) =>
      axios.post('/user/authorization_requests.json', { project_id: projectId }),
    {
      onSuccess: () => {
        toast.success('Access request sent')
      },
    }
  )
}

export const useAuthorizationRequestsDestroy = () => {
  const invalidateIndex = useInvalidateAuthorizationRequestsIndex()

  return useMutation(
    ['user', 'authorization_requests', 'destroy'],
    ({ authorizationRequestId }: { authorizationRequestId: number }) =>
      axios.delete(`/user/authorization_requests/${authorizationRequestId}.json`),
    {
      onSuccess: () => {
        toast.success('Authorization request dismissed')
        invalidateIndex()
      },
    }
  )
}

export const useInvalidateAuthorizationRequestsIndex = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(['user', 'authorization_requests', 'index'])
}
