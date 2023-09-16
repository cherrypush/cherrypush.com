import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useInvalidateAuthorizationRequestsIndex } from './authorizationsRequests'

const INDEX_KEY = ['user', 'authorizations']

export const useAuthorizationsIndex = () =>
  useQuery(INDEX_KEY, () => axios.get('/user/authorizations.json').then((response) => response.data))

export const useAuthorizationsCreate = () => {
  const queryClient = useQueryClient()
  const invalidateAuthorizationRequestsIndex = useInvalidateAuthorizationRequestsIndex()

  return useMutation(
    ({ organizationId, userId }: { organizationId: number; userId: number }) =>
      axios.post('/user/authorizations.json', { organization_id: organizationId, user_id: userId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INDEX_KEY)
        toast.success('Authorization created')
        invalidateAuthorizationRequestsIndex()
      },
      onError: (error) => toast.error(error.response.data?.error),
    }
  )
}

export const useAuthorizationsDestroy = () => {
  const queryClient = useQueryClient()

  return useMutation(({ id }: { id: number }) => axios.delete(`/user/authorizations/${id}.json`), {
    onSuccess: () => {
      queryClient.invalidateQueries(INDEX_KEY)
      toast.success('Authorization revoked')
    },
    onError: (error) => {
      // Should this be hear? Or should we catch on the axios call?
      toast.error(error.response.data?.error || error.message)
    },
  })
}
