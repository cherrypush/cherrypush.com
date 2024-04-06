import { Avatar, Card } from 'flowbite-react'
import { useParams } from 'react-router-dom'
import { useContributionsIndex } from '../queries/user/contributions'
import { useUsersShow } from '../queries/user/users'
import ContributionsTable from './ContributionsTable'

const UserPage = () => {
  const { userId } = useParams()
  if (!userId) return null

  const { data: user } = useUsersShow(parseInt(userId))
  const { data: contributions } = useContributionsIndex({ userId: parseInt(userId) })

  if (!user) return null

  return (
    <div className="container">
      <Card className="mb-3">
        <div className="flex flex-col items-center gap-3">
          <Avatar size="xl" img={user.image} rounded />
          <h2 className="mb-0">{user.name}</h2>
          <a className="text-link" href={`mailto:${user.email}`}>
            {user.email}
          </a>
        </div>
      </Card>

      <h2>Recent contributions</h2>
      {contributions && <ContributionsTable contributions={contributions} />}
    </div>
  )
}

export default UserPage
