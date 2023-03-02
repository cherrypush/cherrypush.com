import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import httpClient from '../../helpers/httpClient'
import { useInvalidateUsersIndex } from './users'

export const useFavoritesCreate = () => {
  const invalidateUsers = useInvalidateUsersIndex()

  return useMutation(({ id, type }) => httpClient.post(`/user/favorites.json`, { id, type }), {
    onSuccess: () => {
      invalidateUsers()
      toast.success('Added to favorites')
    },
  })
}

export const useFavoritesDestroy = () => {
  const invalidateUsers = useInvalidateUsersIndex()

  return useMutation(({ id, type }) => httpClient.delete(`/user/favorites.json`, { id, type }), {
    onSuccess: () => {
      invalidateUsers()
      toast.success('Removed from favorites')
    },
  })
}
