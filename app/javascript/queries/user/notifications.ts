import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface Contribution {
  author_email: string
  author_name: string
  commit_date: string
  commit_sha: string
  created_at: string
  diff: number
  id: number
  metric_id: number
  updated_at: string
}

type Item = Contribution

interface Notification {
  created_at: string
  id: number
  item_id: number
  item: Item
  seen_at: string
  title: string
  updated_at: string
  user_id: number
}

const INDEX_KEY = ['user', 'notifications', 'index']

export const useNotificationsIndex = () =>
  useQuery<Notification[]>(INDEX_KEY, () => axios.get(`/user/notifications.json`).then((response) => response.data))

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
