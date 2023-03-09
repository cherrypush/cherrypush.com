import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import httpClient from '../../helpers/httpClient'

export const useAuthorizationRequestsIndex = () =>
  useQuery(['user', 'authorization_requests', 'index'], () =>
    httpClient.get('/user/authorization_requests.json').then((response) => response.data)
  )

export const useAuthorizationRequestsCreate = () => {
  return useMutation(
    ['user', 'authorization_requests', 'create'],
    ({ projectId }: { projectId: number }) =>
      httpClient.post('/user/authorization_requests.json', { project_id: projectId }),
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
      httpClient.delete(`/user/authorization_requests/${authorizationRequestId}.json`),
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
