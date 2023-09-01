import { Button, Modal, Spinner } from 'flowbite-react'
import { useState } from 'react'
import { useAuthorizationsCreate } from '../queries/user/authorizations'
import { useUsersIndex } from '../queries/user/users'
import AutocompleteField from './AutocompleteField'

const NewAuthorizationModal = ({ projectId, onClose }: { projectId: number; onClose: () => void }) => {
  const { data: users, isLoading } = useUsersIndex()
  const { mutateAsync: createAuthorization, isLoading: isCreatingAuthorization } = useAuthorizationsCreate()
  const [userId, setUserId] = useState()

  const autocompleteItems = users
    .map((user) => ({ id: user.id, name: `${user.name} (@${user.github_handle})` }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Modal show onClose={onClose} dismissible>
      <Modal.Header>Add authorization</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          {isLoading ? (
            <Spinner />
          ) : (
            <AutocompleteField
              placeholder="Select a user..."
              onSelect={(user) => setUserId(user?.id)}
              items={autocompleteItems}
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button
          disabled={!userId || isCreatingAuthorization}
          onClick={() => createAuthorization({ projectId, userId }).then(onClose)}
          className="align-right"
        >
          Create authorization
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewAuthorizationModal
