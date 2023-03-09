import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import { Alert, Button } from 'flowbite-react'
import React from 'react'
import { useAuthorizationsCreate } from '../queries/user/authorizations'
import { useAuthorizationRequestsDestroy } from '../queries/user/authorizationsRequests'

const AuthorizationRequestAlert = ({ authorizationRequest }) => {
  const { mutateAsync: createAuthorization } = useAuthorizationsCreate()
  const { mutateAsync: destroyAuthorizationRequest } = useAuthorizationRequestsDestroy()

  return (
    <Alert withBorderAccent>
      <p>
        <span className="font-bold">
          {authorizationRequest.user.name} (@{authorizationRequest.user.github_handle})
        </span>{' '}
        wants to access <span className="font-bold">{authorizationRequest.project.name}</span>.
      </p>
      <div className="flex gap-3 mt-2">
        <Button
          size="xs"
          onClick={() =>
            createAuthorization({ projectId: authorizationRequest.project.id, userId: authorizationRequest.user.id })
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
