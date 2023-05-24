import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const INDEX_KEY = ['user', 'notifications', 'index']

export const useNotificationsIndex = () =>
  useQuery(INDEX_KEY, () => axios.get(`/user/notifications.json`).then((response) => response.data))

export const useNotificationsMarkAsSeen = () => {
  const invalidateNotificationsIndex = useInvalidateNotificationsIndex()

  return useMutation((id: number) => axios.put(`/user/notifications/${id}/mark_as_seen.json`), {
    onSuccess: () => {
      toast.success('Notification marked as seen')
      invalidateNotificationsIndex()
    },
  })
}

export const useNotificationsMarkAllAsSeen = () => {
  const invalidateNotificationsIndex = useInvalidateNotificationsIndex()

  return useMutation(() => axios.put(`/user/notifications/mark_all_as_seen.json`), {
    onSuccess: () => {
      toast.success('Notifications marked as seen')
      invalidateNotificationsIndex()
    },
  })
}

export const useInvalidateNotificationsIndex = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries(INDEX_KEY)
}
