import { Button, Label, Modal, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { useAuthorizationsCreate } from '../queries/user/authorizations'
import { useUsersIndex } from '../queries/user/users'

const NewAuthorizationModal = ({ organizationId, onClose }: { organizationId: number; onClose: () => void }) => {
  const { data: users } = useUsersIndex()
  const { mutateAsync: createAuthorization, isLoading: isCreatingAuthorization } = useAuthorizationsCreate()
  const [email, setEmail] = useState<string>('')

  const isValidEmail = (email: string) => {
    if (!email) return true
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    return re.test(email)
  }

  if (!users) return null

  return (
    <Modal show onClose={onClose} dismissible>
      <Modal.Header>New Authorization</Modal.Header>
      <Modal.Body className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <TextInput
          id="email"
          color={isValidEmail(email) ? 'gray' : 'failure'}
          type="email"
          value={email}
          placeholder="email@example.com"
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
        />
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button
          disabled={!isValidEmail(email) || isCreatingAuthorization}
          onClick={() => createAuthorization({ organizationId, email }).then(onClose)}
          className="align-right"
        >
          Create Authorization
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewAuthorizationModal
