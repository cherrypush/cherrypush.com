import { useUsersIndex } from '../queries/user/users'

const useCurrentUser = () => {
  const { data: users } = useUsersIndex()

  if (!window.current_user) return { user: null }
  if (!users) return { user: window.current_user }

  return { user: users.find((user) => user.id === window.current_user.id) }
}

export default useCurrentUser
