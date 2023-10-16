import { Button, Card, Label, Modal, Rating, TextInput } from 'flowbite-react'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { timeAgoInWords } from '../helpers/applicationHelper'
import useCurrentUser from '../hooks/useCurrentUser'
import { useDashboardsCreate, useDashboardsIndex } from '../queries/user/dashboards'
import { useFavoritesCreate, useFavoritesDestroy } from '../queries/user/favorites'
import { useProjectsIndex } from '../queries/user/projects'
import AutocompleteField from './AutocompleteField'
import SortedTable from './SortedTable'

const NewDashboardModal = ({ onClose }: { onClose: () => void }) => {
  const { data: projects } = useProjectsIndex()
  const { mutateAsync: createDashboard } = useDashboardsCreate()
  const [name, setName] = useState('')
  const [projectId, setProjectId] = useState<number | null>(null)
  const navigate = useNavigate()

  return (
    <Modal show onClose={onClose} dismissible>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          invariant(projectId, 'Project ID is required')
          createDashboard(
            { name, project_id: projectId },
            {
              onSuccess: (response) => {
                navigate(`/user/dashboards/${response.data.id}`)
              },
            }
          )
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
  const { mutate: addFavorite } = useFavoritesCreate()
  const { mutate: removeFavorite } = useFavoritesDestroy()
  const { user } = useCurrentUser()
  const sortedDashboards = _.sortBy(
    dashboards,
    (dashboard) => (user.favorite_dashboard_ids.includes(dashboard.id) ? 0 : 1) + dashboard.name.toLowerCase()
  )

  const data = useMemo(() => sortedDashboards, [sortedDashboards])
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }) => (
          <div className="flex items-center text-white">
            <Button
              size="xs"
              color="dark"
              className="mr-3"
              onClick={(event) => {
                event.stopPropagation()
                user.favorite_dashboard_ids.includes(row.original.id)
                  ? removeFavorite({ id: row.original.id, klass: 'Dashboard' })
                  : addFavorite({ id: row.original.id, klass: 'Dashboard' })
              }}
            >
              <Rating>
                <Rating.Star filled={user.favorite_dashboard_ids.includes(row.original.id)} />
              </Rating>
            </Button>
            {row.original.name}
          </div>
        ),
      },
      {
        Header: 'Project',
        accessor: 'project.name',
      },
      {
        Header: '# of charts',
        accessor: 'charts.length',
      },
      {
        Header: 'Last update',
        accessor: 'updated_at',
        Cell: ({ row }) => timeAgoInWords(row.original.updated_at),
      },
    ],
    [user]
  )

  if (!dashboards) return null

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h1>Dashboards</h1>
        <Button onClick={() => setShowNewDashboardModal(true)}>+ New Dashboard</Button>
      </div>
      {dashboards.length > 0 ? (
        <SortedTable
          data={data}
          columns={columns}
          onRowClick={(dashboard) => navigate(`/user/dashboards/${dashboard.id}`)}
        />
      ) : (
        <Card>
          <div className="text-center text-gray-500">No dashboards yet.</div>
        </Card>
      )}
      {showNewDashboardModal && <NewDashboardModal onClose={() => setShowNewDashboardModal(false)} />}
    </div>
  )
}

export default DashboardsIndexPage
