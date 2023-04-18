import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useInvalidateUsersIndex } from './users'

interface SettingsPayload {
  weekly_report: boolean
}

export const useSettingsUpdate = () => {
  const invalidateUsers = useInvalidateUsersIndex()

  return useMutation((settings: SettingsPayload) => axios.put('/user/settings', { ...settings }), {
    onSuccess: () => {
      invalidateUsers()
      toast.success('Settings updated')
    },
  })
}
