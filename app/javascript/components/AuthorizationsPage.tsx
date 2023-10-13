import EditIcon from '@mui/icons-material/Edit'
import { Badge, Button, Table } from 'flowbite-react'
import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthorizationsDestroy, useAuthorizationsIndex } from '../queries/user/authorizations'
import { useAuthorizationRequestsIndex } from '../queries/user/authorizationsRequests'
import { useOrganizationsIndex } from '../queries/user/organizations'
import { useProjectsIndex } from '../queries/user/projects'
import { useUsersIndex } from '../queries/user/users'
import AuthorizationRequestAlert from './AuthorizationsRequestAlert'
import NewAuthorizationModal from './NewAuthorizationModal'
import PageLoader from './PageLoader'

const PersonalProjectAuthorizations = ({
  project,
  authorizations,
  destroyAuthorization,
  isLoading,
}: {
  authorizations: { id: number; project_id: number; user: { name: string; github_handle: string } }[]
  project: { name: string; user: { name: string; github_handle: string }; id: number }
  isLoading: boolean
  destroyAuthorization: (arg: { id: number }) => void
}) => {
  return (
    <div className="overflow-x-auto relative">
      <Table>
        <Table.Head>
          <Table.HeadCell className="text-white">{project.name}</Table.HeadCell>
          <Table.HeadCell scope="col" className="py-3 px-6 flex justify-end"></Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {/* OWNER */}
          <Table.Row className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <Table.Cell className="flex gap-3">
              {project.user.name} (@{project.user.github_handle})
              <Badge color="gray" size="xs">
                OWNER
              </Badge>
            </Table.Cell>
            <Table.Cell />
          </Table.Row>
          {/* AUTHORIZATIONS */}
          {authorizations
            .filter((authorization) => authorization.project_id === project.id)
            .sort((a, b) => a.user.name.localeCompare(b.user.name))
            .map((authorization) => (
              <Table.Row key={authorization.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <Table.Cell>
                  {authorization.user.name} (@{authorization.user.github_handle})
                </Table.Cell>
                <Table.Cell className="justify-end">
                  <Button
                    onClick={() => {
                      if (window.confirm('Do you really want to revoke this authorization?')) {
                        destroyAuthorization({ id: authorization.id })
                      }
                    }}
                    disabled={isLoading}
                    size="xs"
                    className="ml-auto"
                    color="light"
                  >
                    Remove
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}

const AuthorizationsPage = () => {
  const { data: projects } = useProjectsIndex()
  const { data: users } = useUsersIndex()
  const { data: authorizations } = useAuthorizationsIndex()
  const { data: organizations } = useOrganizationsIndex()
  const { mutateAsync: destroyAuthorization, isLoading } = useAuthorizationsDestroy()
  const { data: authorizationRequests } = useAuthorizationRequestsIndex()
  const navigate = useNavigate()

  const [editedOrganizationId, setEditedOrganizationId] = useState<number | null>(null)

  if (!projects || !authorizations || !users || !organizations) return <PageLoader />

  const personalProjects = projects.filter((project) => !project.organization)

  return (
    <div className="container">
      <h1 className="mb-3">Authorizations</h1>
      <p className="mb-3">Control who has read and write access to your projects.</p>

      {authorizationRequests &&
        authorizationRequests.length > 0 &&
        authorizationRequests.map((authorizationRequest) => (
          <AuthorizationRequestAlert key={authorizationRequest.id} authorizationRequest={authorizationRequest} />
        ))}

      <div className="flex mb-4">
        {projects.length === 0 && (
          <div className="card w-full text-center">
            <div className="text-gray-500">You first need to create a project.</div>
            <Button onClick={() => navigate('/user/projects/new')} className="mx-auto mt-3">
              + New Project
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        {personalProjects.length > 0 && (
          <>
            <h2>Personal projects</h2>
            <div className="flex flex-col gap-6">
              {personalProjects.map((project) => (
                <PersonalProjectAuthorizations
                  key={project.id}
                  project={project}
                  authorizations={authorizations}
                  destroyAuthorization={destroyAuthorization}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </>
        )}

        {organizations.map((organization) => {
          const organizationOwner = users.find((user) => user.id === organization.user_id)

          return (
            <Fragment key={organization.id}>
              <div className="flex items-center justify-between">
                <h2 className="mt-6">{organization.name} projects</h2>
                <Button size="xs" onClick={() => setEditedOrganizationId(organization.id)}>
                  + Authorization
                </Button>
              </div>

              {organization.sso_enabled && (
                <div className="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400">
                  <div className="ml-3 text-sm font-medium">
                    SSO is enabled for {organization.sso_domain} ({organization.sso_user_count} users)
                  </div>
                  <button
                    type="button"
                    className="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                    onClick={() => navigate('/user/organizations/' + organization.id)}
                  >
                    <EditIcon fontSize="small" />
                  </button>
                </div>
              )}

              <Table>
                <Table.Body>
                  {/* OWNER */}
                  <Table.Row className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <Table.Cell className="flex gap-3">
                      {organizationOwner.name} (@{organizationOwner.github_handle})
                      <Badge color="gray" size="xs">
                        OWNER
                      </Badge>
                    </Table.Cell>
                    <Table.Cell />
                  </Table.Row>
                  {authorizations
                    .filter((authorization) => authorization.organization_id === organization.id)
                    .sort((a, b) => a.user.name.localeCompare(b.user.name))
                    .map((authorization) => (
                      <Fragment key={authorization.id}>
                        {/* AUTHORIZATIONS */}
                        <Table.Row
                          key={authorization.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <Table.Cell className="flex gap-3">
                            {authorization.user.name} (@{authorization.user.github_handle})
                          </Table.Cell>
                          <Table.Cell className="justify-end">
                            <Button
                              onClick={() => {
                                if (window.confirm('Do you really want to revoke this authorization?')) {
                                  destroyAuthorization({ id: authorization.id })
                                }
                              }}
                              disabled={isLoading}
                              size="xs"
                              className="ml-auto"
                              color="light"
                            >
                              Remove
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      </Fragment>
                    ))}
                </Table.Body>
              </Table>
            </Fragment>
          )
        })}

        {editedOrganizationId && (
          <NewAuthorizationModal organizationId={editedOrganizationId} onClose={() => setEditedOrganizationId(null)} />
        )}
      </div>
    </div>
  )
}
export default AuthorizationsPage
