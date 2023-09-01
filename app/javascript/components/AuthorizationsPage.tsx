import { Badge, Button, Table } from 'flowbite-react'
import _ from 'lodash'
import { Fragment, useState } from 'react'
import { useAuthorizationsDestroy, useAuthorizationsIndex } from '../queries/user/authorizations'
import { useAuthorizationRequestsIndex } from '../queries/user/authorizationsRequests'
import { useProjectsIndex } from '../queries/user/projects'
import AuthorizationRequestAlert from './AuthorizationsRequestAlert'
import NewAuthorizationModal from './NewAuthorizationModal'
import PageLoader from './PageLoader'

const ProjectAuthorizations = ({ project, authorizations, destroyAuthorization, setEditedProjectId, isLoading }) => {
  return (
    <div className="overflow-x-auto relative">
      <Table>
        <Table.Head>
          <Table.HeadCell className="text-white">{project.name}</Table.HeadCell>
          <Table.HeadCell scope="col" className="py-3 px-6 flex justify-end">
            <Button size="xs" onClick={() => setEditedProjectId(project.id)}>
              + Authorization
            </Button>
          </Table.HeadCell>
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
  const { data: authorizations } = useAuthorizationsIndex()
  const { mutateAsync: destroyAuthorization, isLoading } = useAuthorizationsDestroy()
  const { data: authorizationRequests } = useAuthorizationRequestsIndex()

  const [editedProjectId, setEditedProjectId] = useState()

  if (!projects || !authorizations) return <PageLoader />

  const organizations = _.uniqBy(
    projects.map((project) => project.organization).filter((organization) => !!organization),
    'id'
  )
  const personalProjects = projects.filter((project) => !project.organization)

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
        <h2>Personal projects</h2>
        {personalProjects.map((project) => (
          <ProjectAuthorizations
            key={project.id}
            project={project}
            authorizations={authorizations}
            destroyAuthorization={destroyAuthorization}
            setEditedProjectId={setEditedProjectId}
            isLoading={isLoading}
          />
        ))}
        {organizations.map((organization) => (
          <Fragment key={organization.id}>
            <h2 className="mt-3">{organization.name} organization</h2>
            {projects
              .filter((project) => project.organization_id === organization.id)
              .map((project) => (
                <ProjectAuthorizations
                  key={project.id}
                  project={project}
                  authorizations={authorizations}
                  destroyAuthorization={destroyAuthorization}
                  setEditedProjectId={setEditedProjectId}
                  isLoading={isLoading}
                />
              ))}
          </Fragment>
        ))}

        {editedProjectId && (
          <NewAuthorizationModal projectId={editedProjectId} onClose={() => setEditedProjectId(null)} />
        )}
      </div>
    </div>
  )
}
export default AuthorizationsPage
