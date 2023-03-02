import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import httpClient from '../../helpers/httpClient'

const INDEX_KEY = ['user', 'authorizations']

export const useAuthorizationsIndex = () =>
  useQuery(INDEX_KEY, () => httpClient.get('/user/authorizations.json').then((response) => response.data))

export const useAuthorizationsCreate = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ projectId, userId }) => httpClient.post('/user/authorizations.json', { project_id: projectId, user_id: userId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INDEX_KEY)
        toast.success('Authorization created')
      },
    }
  )
}

export const useAuthorizationsDestroy = () => {
  const queryClient = useQueryClient()

  return useMutation(({ id }) => httpClient.delete(`/user/authorizations/${id}.json`), {
    onSuccess: () => {
      queryClient.invalidateQueries(INDEX_KEY)
      toast.success('Authorization revoked')
    },
    onError: (error) => {
      // Should this be hear? Or should we catch on the httpClient call?
      toast.error(error.response.data?.error || error.message)
    },
  })
}
