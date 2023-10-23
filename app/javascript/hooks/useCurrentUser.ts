import { useUsersShow } from '../queries/user/users'

const useCurrentUser = () => {
  const { data: user } = useUsersShow(window.current_user?.id)

  if (!window.current_user) return { user: null }
  if (!user) return { user: window.current_user }

  return { user }
}

export default useCurrentUser
