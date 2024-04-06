import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useInvalidateUsersIndex } from './users'

interface SettingsPayload {
  weekly_report?: boolean
  github_handle?: string
}

export const useSettingsUpdate = () => {
  const invalidateUsers = useInvalidateUsersIndex()

  return useMutation((user: SettingsPayload) => axios.put('/user/settings', { user }), {
    onSuccess: () => {
      invalidateUsers()
      toast.success('Your changes have been saved!')
    },
  })
}
