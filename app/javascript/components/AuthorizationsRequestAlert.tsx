import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import { Alert, Button } from 'flowbite-react'
import { useAuthorizationsCreate } from '../queries/user/authorizations'
import { useAuthorizationRequestsDestroy } from '../queries/user/authorizationsRequests'

const AuthorizationRequestAlert = ({
  authorizationRequest,
}: {
  authorizationRequest: {
    id: number
    user: { name: string; email: string }
    organization: { id: number; name: string }
  }
}) => {
  const { mutateAsync: createAuthorization } = useAuthorizationsCreate()
  const { mutateAsync: destroyAuthorizationRequest } = useAuthorizationRequestsDestroy()

  return (
    <Alert withBorderAccent>
      <p>
        <span className="font-bold">
          {authorizationRequest.user.name} ({authorizationRequest.user.email})
        </span>{' '}
        requested access to <span className="font-bold">{authorizationRequest.organization.name} organization</span>.
      </p>
      <div className="flex gap-3 mt-2">
        <Button
          size="xs"
          onClick={() =>
            createAuthorization({
              organizationId: authorizationRequest.organization.id,
              email: authorizationRequest.user.email,
            })
          }
        >
          <CheckCircleIcon />
          <span className="ml-2">Grant access</span>
        </Button>
        <Button
          size="xs"
          color="light"
          onClick={() => destroyAuthorizationRequest({ authorizationRequestId: authorizationRequest.id })}
        >
          <DoNotDisturbAltIcon />
          <span className="ml-2">Dismiss</span>
        </Button>
      </div>
    </Alert>
  )
}

export default AuthorizationRequestAlert
