import 'flowbite'
import '~/initializers/init_react_components'
import { UserShowResponse } from '../queries/user/users'

declare global {
  interface Window {
    current_user: UserShowResponse | null
  }
}
