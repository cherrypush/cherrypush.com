import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const INDEX_KEY = ['user', 'notifications', 'index']

export const useNotificationsIndex = () =>
  useQuery(INDEX_KEY, () => axios.get(`/user/notifications.json`).then((response) => response.data))
