import BackspaceIcon from '@mui/icons-material/Backspace'
import CloseIcon from '@mui/icons-material/Close'
import { Breadcrumb, Button, Card, Dropdown } from 'flowbite-react'
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useOwnersIndex } from '../queries/user/owners'

const Filters = ({ projects, metrics, selectedOwners, setSelectedOwners }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const projectId = searchParams.get('project_id')
  const currentProject = projectId ? projects.find((project) => project.id === parseInt(projectId)) : null

  const metricId = searchParams.get('metric_id')
  const currentMetric = metricId ? metrics.find((metric) => metric.id === parseInt(metricId)) : null

  const { data: owners } = useOwnersIndex()

  return (
    <Card className="mb-3">
      <Breadcrumb>
        <Breadcrumb.Item>
          <button onClick={() => navigate('/user/projects')} className="hover:text-white cursor-pointer">
            Projects
          </button>
        </Breadcrumb.Item>

        {currentProject && (
          <Breadcrumb.Item onClick={() => navigate(`/user/projects?project_id=${currentProject.id}`)}>
            <div className="hover:text-white cursor-pointer">{currentProject.name}</div>
          </Breadcrumb.Item>
        )}

        {currentMetric && (
          <Breadcrumb.Item>
            <div className="hover:text-white">
              <Dropdown label={currentMetric?.name || 'Select a metric'} inline>
                {currentMetric && (
                  <Dropdown.Item
                    onClick={() => {
                      searchParams.delete('metric_id')
                      setSearchParams(searchParams)
                    }}
                  >
                    <CloseIcon /> Remove selection
                  </Dropdown.Item>
                )}
                {metrics.map((metric) => (
                  <Dropdown.Item
                    key={metric.id}
                    onClick={() => {
                      searchParams.set('project_id', metric.project_id)
                      searchParams.set('metric_id', metric.id)
                      setSearchParams(searchParams)
                    }}
                  >
                    {metric.name}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          </Breadcrumb.Item>
        )}

        {false && owners && (
          <Breadcrumb.Item>
            <div className="hover:text-white">
              <Dropdown label={selectedOwners.length === 0 ? 'Select an owner' : 'Add an owner'} inline>
                {selectedOwners.length > 0 && (
                  <Dropdown.Item
                    onClick={() => {
                      searchParams.delete('owners')
                      setSearchParams(searchParams)
                    }}
                  >
                    <CloseIcon /> Remove selection
                  </Dropdown.Item>
                )}
                {owners.map((owner) => (
                  <Dropdown.Item
                    key={owner.handle}
                    onClick={() => {
                      searchParams.set('owners', [...selectedOwners, owner.handle])
                      setSearchParams(searchParams)
                    }}
                  >
                    {owner.handle}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>

      {selectedOwners && selectedOwners.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOwners.map((owner) => (
            <Button
              color="light"
              pill
              size="xs"
              key={owner}
              className=""
              onClick={() => setSelectedOwners(selectedOwners.filter((o) => o !== owner))}
            >
              {owner}
            </Button>
          ))}
          <Button
            color="light"
            pill
            size="xs"
            onClick={() => {
              searchParams.delete('owners')
              setSearchParams(searchParams)
            }}
          >
            Clear
            <BackspaceIcon fontSize="inherit" className="ml-1" />
          </Button>
        </div>
      )}
    </Card>
  )
}
export default Filters
