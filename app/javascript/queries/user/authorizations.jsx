import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const useAuthorizationsIndex = () =>
  useQuery(['user', 'authorizations'], () => axios.get('/user/authorizations.json').then((response) => response.data))

export const useAuthorizationsCreate = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ projectId, userId }) => axios.post('/user/authorizations', { project_id: projectId, user_id: userId }),
    { onSuccess: () => queryClient.invalidateQueries(['user', 'authorizations']) }
  )
}

export const useAuthorizationsDestroy = () => {
  const queryClient = useQueryClient()

  return useMutation(({ id }) => axios.delete(`/user/authorizations/${id}`), {
    onSuccess: () => queryClient.invalidateQueries(['user', 'authorizations']),
  })
}
