import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockPersonIcon from '@mui/icons-material/LockPerson'
import { Button, Card } from 'flowbite-react'
import { useAuthorizationRequestsCreate } from '../queries/user/authorizationsRequests'

const RequestAccessCard = ({ projectId }: { projectId: number }) => {
  const { mutateAsync: requestAccess, isLoading, isSuccess } = useAuthorizationRequestsCreate()

  return (
    <Card className="max-w-xl text-center mx-auto">
      <p>
        {"You don't have access to this project."}
        <br />
        {'Please request access to the project members.'}
      </p>
      {isSuccess ? (
        <Button color="success" disabled>
          <CheckCircleIcon />
          <span className="ml-2">Your request has been sent.</span>
        </Button>
      ) : (
        <Button disabled={isLoading} onClick={() => requestAccess({ projectId })}>
          <LockPersonIcon />
          <span className="ml-2">Request Access</span>
        </Button>
      )}
    </Card>
  )
}

export default RequestAccessCard
