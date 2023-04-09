import { Button, Card, Label, Modal, Table, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardsCreate, useDashboardsIndex } from '../queries/user/dashboards'
import { useProjectsIndex } from '../queries/user/projects'
import AutocompleteField from './AutocompleteField'

const NewDashboardModal = ({ show, setShow }: { show: boolean; setShow: (show) => void }) => {
  const { data: projects } = useProjectsIndex()
  const { mutateAsync: createDashboard } = useDashboardsCreate()

  const initialDashboard = { project_id: null, name: '' }
  const [dashboard, setDashboard] = useState<{
    project_id: number | null
    name: string
  }>(initialDashboard)

  return (
    <Modal show={show} onClose={() => setShow(false)} dismissible>
      <Modal.Header>New Dashboard</Modal.Header>
      <Modal.Body className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="project" value="Project" />
          </div>
          {projects && (
            <AutocompleteField
              placeholder="Select a user..."
              onSelect={(project) => setDashboard({ ...dashboard, project_id: project.id })}
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
            onChange={(event) => setDashboard({ ...dashboard, name: event.target.value })}
          />
        </div>

        <Button
          onClick={() => {
            createDashboard(dashboard)
            setShow(false)
            setDashboard(initialDashboard)
          }}
        >
          Create
        </Button>
      </Modal.Body>
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
          </Table.Head>
          <Table.Body>
            {dashboards.map((dashboard) => (
              <Table.Row
                key={dashboard.id}
                className="border-b dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => navigate(`/user/dashboards/${dashboard.id}`)}
              >
                <Table.Cell>{dashboard.name}</Table.Cell>
                <Table.Cell>{dashboard.project.name}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Card className="text-center">🕵🏻‍♂️ No dashboards yet</Card>
      )}
      <NewDashboardModal show={showNewDashboardModal} setShow={setShowNewDashboardModal} />
    </div>
  )
}

export default DashboardsIndexPage
