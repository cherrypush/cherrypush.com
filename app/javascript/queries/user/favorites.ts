import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useInvalidateUsersIndex } from './users'

interface FavoritesPayload {
  id: number
  klass: 'Metric'
}

export const useFavoritesCreate = () => {
  const invalidateUsers = useInvalidateUsersIndex()

  return useMutation(({ id, klass }: FavoritesPayload) => axios.post(`/user/favorites.json`, { id, klass }), {
    onSuccess: () => {
      invalidateUsers()
      toast.success('Added to favorites')
    },
  })
}

export const useFavoritesDestroy = () => {
  const invalidateUsers = useInvalidateUsersIndex()

  return useMutation(
    ({ id, klass }: FavoritesPayload) => axios.delete(`/user/favorites.json`, { data: { id, klass } }),
    {
      onSuccess: () => {
        invalidateUsers()
        toast.success('Removed from favorites')
      },
    }
  )
}
