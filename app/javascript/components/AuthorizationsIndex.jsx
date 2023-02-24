import { Button, Modal } from 'flowbite-react'
import React, { useState } from 'react'
import {
  useAuthorizationsCreate,
  useAuthorizationsIndex,
  useAuthorizationsDestroy,
} from '../queries/user/authorizations'
import { useProjectsIndex } from '../queries/user/projects'
import { useUsersIndex } from '../queries/user/users'
import AutocompleteField from './AutocompleteField'

const AddAuthorizationModal = ({ projectId, onClose }) => {
  const { data: users } = useUsersIndex()
  const { mutateAsync, isLoading: isCreatingAuthorization } = useAuthorizationsCreate()
  const [userId, setUserId] = useState()

  if (!users) return null

  return (
    <Modal show onClose={onClose}>
      <Modal.Header>Add authorization</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          {<AutocompleteField placeholder="Select a user..." onSelect={(user) => setUserId(user?.id)} items={users} />}
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button
          disabled={!userId || isCreatingAuthorization}
          onClick={() => mutateAsync({ projectId, userId }).then(onClose)}
          className="align-right"
        >
          Create authorization
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const AuthorizationsIndex = () => {
  const { data: projects } = useProjectsIndex()
  const { data: authorizations } = useAuthorizationsIndex()
  const destroyAuthorization = useAuthorizationsDestroy()

  const [editedProjectId, setEditedProjectId] = useState()

  if (!projects || !authorizations) return null

  return (
    <div className="px-0 pt-3">
      <h1>Authorizations</h1>

      <p className="mb-3">Control who has read-access to the projects you own.</p>

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
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {projects.map((project) => (
          <div className="overflow-x-auto relative" key={project.id}>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="py-3 px-6 text-gray-700 uppercase dark:text-gray-400">
                    {project.name}
                  </th>
                  <th scope="col" className="py-3 px-6 flex justify-end">
                    <a className="cursor-pointer text-link" onClick={() => setEditedProjectId(project.id)}>
                      + Add Authorization
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                {authorizations
                  .filter((authorization) => authorization.project_id === project.id)
                  .map((authorization) => (
                    <tr key={authorization.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        @{authorization.user.github_handle}
                      </th>
                      <td className="py-4 px-6 justify-end">
                        <Button
                          onClick={() => destroyAuthorization.mutateAsync({ id: authorization.id })}
                          disabled={destroyAuthorization.isLoading}
                          size="xs"
                          className="ml-auto"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
        {editedProjectId && (
          <AddAuthorizationModal projectId={editedProjectId} onClose={() => setEditedProjectId(null)} />
        )}
      </div>
    </div>
  )
}
export default AuthorizationsIndex
