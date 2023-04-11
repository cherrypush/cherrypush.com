import { Button, Card, Label, Modal, Table, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { useDashboardsCreate, useDashboardsIndex } from '../queries/user/dashboards'
import { useProjectsIndex } from '../queries/user/projects'
import AutocompleteField from './AutocompleteField'

const NewDashboardModal = ({ onClose }: { onClose: () => void }) => {
  const { data: projects } = useProjectsIndex()
  const { mutateAsync: createDashboard } = useDashboardsCreate()
  const [name, setName] = useState('')
  const [projectId, setProjectId] = useState<number | null>(null)

  return (
    <Modal show onClose={onClose} dismissible>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          invariant(projectId, 'Project ID is required')
          createDashboard({ name, project_id: projectId })
          onClose()
        }}
      >
        <Modal.Header>New Dashboard</Modal.Header>
        <Modal.Body className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="project" value="Project" />
            </div>
            {projects && (
              <AutocompleteField
                placeholder="Select a project..."
                onSelect={(project) => setProjectId(project.id)}
                items={projects.map((project) => ({ id: project.id, name: project.name }))}
              />
            )}
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Dashboard name" />
            </div>
            <TextInput
              id="name"
              type="text"
              required={true}
              autoComplete="off"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" disabled={!projectId || !name} className="w-full">
            Create
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

const DashboardsIndexPage = () => {
  const { data: dashboards } = useDashboardsIndex()
  const [showNewDashboardModal, setShowNewDashboardModal] = useState(false)
  const navigate = useNavigate()

  if (!dashboards) return null

  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <h1>Dashboards</h1>
        <Button onClick={() => setShowNewDashboardModal(true)}>+ New Dashboard</Button>
      </div>
      {dashboards.length > 0 ? (
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Project</Table.HeadCell>
            <Table.HeadCell># of Charts</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {dashboards.map((dashboard) => (
              <Table.Row
                key={dashboard.id}
                className="border-b dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => navigate(`/user/dashboards/${dashboard.id}`)}
              >
                <Table.HeadCell className="text-white">{dashboard.name}</Table.HeadCell>
                <Table.Cell>{dashboard.project.name}</Table.Cell>
                <Table.Cell>{dashboard.charts.length}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Card>
          <div className="text-center text-gray-500">No dashboards yet</div>
        </Card>
      )}
      {showNewDashboardModal && <NewDashboardModal onClose={() => setShowNewDashboardModal(false)} />}
    </div>
  )
}

export default DashboardsIndexPage
