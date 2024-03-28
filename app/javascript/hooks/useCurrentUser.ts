import { UserShowResponse, useUsersShow } from '../queries/user/users'

const useCurrentUser = () => {
  const windowUser = window.current_user as UserShowResponse | null
  const { data: user } = useUsersShow(windowUser?.id)

  return user || windowUser
}

export default useCurrentUser
