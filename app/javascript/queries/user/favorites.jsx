import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useInvalidateUsersIndex } from './users'

export const useFavoritesCreate = () => {
  const invalidateUsers = useInvalidateUsersIndex()

  return useMutation(({ id, type }) => axios.post(`/user/favorites.json`, { id, type }), {
    onSuccess: () => {
      invalidateUsers()
      toast.success('Added to favorites')
    },
  })
}

export const useFavoritesDestroy = () => {
  const invalidateUsers = useInvalidateUsersIndex()

  return useMutation(({ id, type }) => axios.delete(`/user/favorites.json`, { data: { id, type } }), {
    onSuccess: () => {
      invalidateUsers()
      toast.success('Removed from favorites')
    },
  })
}
