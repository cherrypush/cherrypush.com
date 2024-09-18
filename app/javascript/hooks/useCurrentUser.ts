import { UserShowResponse, useUsersShow } from '../queries/user/users'

const useCurrentUser = () => {
  const windowUser = window.current_user as UserShowResponse | null
  const { data: backendUser } = useUsersShow(windowUser?.id)

  return backendUser || windowUser
}

export default useCurrentUser
