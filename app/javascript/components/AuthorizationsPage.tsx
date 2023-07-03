import { Button, Modal, Spinner, Table } from 'flowbite-react'
import React, { useState } from 'react'
import {
  useAuthorizationsCreate,
  useAuthorizationsDestroy,
  useAuthorizationsIndex,
} from '../queries/user/authorizations'
import { useAuthorizationRequestsIndex } from '../queries/user/authorizationsRequests'
import { useProjectsIndex } from '../queries/user/projects'
import { useUsersIndex } from '../queries/user/users'
import AuthorizationRequestAlert from './AuthorizationsRequestAlert'
import AutocompleteField from './AutocompleteField'
import PageLoader from './PageLoader'

const AddAuthorizationModal = ({ projectId, onClose }) => {
  const { data: users, isLoading } = useUsersIndex()
  const { mutateAsync: createAuthorization, isLoading: isCreatingAuthorization } = useAuthorizationsCreate()
  const [userId, setUserId] = useState()

  // TODO - this should be done in the backend

  const autocompleteItems = users
    .map((user) => ({ id: user.id, name: `${user.name} (@${user.github_handle})` }))
    .sort((a, b) => a.name.localeCompare(b.name))

  // TODO - another way to do this would be to use a formik form

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

const AuthorizationsPage = () => {
  const { data: projects } = useProjectsIndex()
  const { data: authorizations } = useAuthorizationsIndex()
  const { mutateAsync: destroyAuthorization, isLoading } = useAuthorizationsDestroy()
  const { data: authorizationRequests } = useAuthorizationRequestsIndex()

  const [editedProjectId, setEditedProjectId] = useState()

  if (!projects || !authorizations) return <PageLoader />

  return (
    <div className="container">
      <h1>Authorizations</h1>

      <p className="mb-3">Control who has read and write access to your projects.</p>

      {authorizationRequests &&
        authorizationRequests.length > 0 &&
        authorizationRequests.map((authorizationRequest) => (
          <AuthorizationRequestAlert key={authorizationRequest.id} authorizationRequest={authorizationRequest} />
        ))}

      <div className="flex mb-4">
        {projects.length === 0 && (
          <div
            className="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
            role="alert"
          >
            You first need to create a project.
            <a href="/user/projects" className="text-link">
              Create a project
            </a>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <div className="overflow-x-auto relative" key={project.id}>
            <Table>
              <Table.Head>
                <Table.HeadCell>{project.name}</Table.HeadCell>
                <Table.HeadCell scope="col" className="py-3 px-6 flex justify-end">
                  <a className="cursor-pointer text-link" onClick={() => setEditedProjectId(project.id)}>
                    + Add Authorization
                  </a>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {authorizations
                  .filter((authorization) => authorization.project_id === project.id)
                  .sort((a, b) => a.user.name.localeCompare(b.user.name))
                  .map((authorization) => (
                    <Table.Row
                      key={authorization.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <Table.Cell>
                        {authorization.user.name} (@{authorization.user.github_handle})
                      </Table.Cell>
                      <Table.Cell className="justify-end">
                        <Button
                          onClick={() => destroyAuthorization({ id: authorization.id })}
                          disabled={isLoading}
                          size="xs"
                          className="ml-auto"
                        >
                          Remove
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        ))}
        {editedProjectId && (
          <AddAuthorizationModal projectId={editedProjectId} onClose={() => setEditedProjectId(null)} />
        )}
      </div>
    </div>
  )
}
export default AuthorizationsPage
