import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useInvalidateAuthorizationRequestsIndex } from './authorizationsRequests'
import { useInvalidateProjectsIndex } from './projects'

const INDEX_KEY = ['user', 'authorizations']

export const useAuthorizationsIndex = () =>
  useQuery(INDEX_KEY, () => axios.get('/user/authorizations.json').then((response) => response.data))

export const useAuthorizationsCreate = () => {
  const queryClient = useQueryClient()
  const invalidateAuthorizationRequestsIndex = useInvalidateAuthorizationRequestsIndex()

  return useMutation(
    ({ organizationId, email }: { organizationId: number; email: string }) =>
      axios.post('/user/authorizations.json', { organization_id: organizationId, email }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INDEX_KEY)
        toast.success('Authorization created')
        invalidateAuthorizationRequestsIndex()
      },
    }
  )
}

export const useAuthorizationsDestroy = () => {
  const queryClient = useQueryClient()
  const invalidateProjectsIndex = useInvalidateProjectsIndex()

  return useMutation(({ id }: { id: number }) => axios.delete(`/user/authorizations/${id}.json`), {
    onSuccess: () => {
      queryClient.invalidateQueries(INDEX_KEY)
      invalidateProjectsIndex()
      toast.success('Authorization revoked')
    },
  })
}
