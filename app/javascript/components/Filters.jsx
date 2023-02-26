import React from 'react'
import { Breadcrumb, Button, Card, Dropdown } from 'flowbite-react'
import BackspaceIcon from '@mui/icons-material/Backspace'
import { Turbo } from '@hotwired/turbo-rails'
import { useSearchParams } from 'react-router-dom'

const Filters = ({ projects, metrics, selectedOwners, setSelectedOwners }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const projectId = searchParams.get('project_id')
  const currentProject = projects.find((project) => project.id === parseInt(projectId))

  const currentMetricId = searchParams.get('metric_id')
  const currentMetric = metrics.find((metric) => metric.id === parseInt(currentMetricId))

  return (
    <Card className="mb-3">
      <Breadcrumb className="h-10 flex items-center">
        <Breadcrumb.Item>
          <button onClick={() => Turbo.visit('/user/projects')} className="hover:text-white cursor-pointer">
            Projects
          </button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <div className="hover:text-white">
            <Dropdown label={currentProject.name} inline>
              {projects.map((project) => (
                <Dropdown.Item key={project.id} onClick={() => setSearchParams({ project_id: project.id })}>
                  {project.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
        </Breadcrumb.Item>
        {currentMetric && (
          <Breadcrumb.Item>
            <div className="hover:text-white">
              <Dropdown label={currentMetric.name} inline>
                {metrics.map((metric) => (
                  <Dropdown.Item
                    key={metric.id}
                    onClick={() => {
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
        {selectedOwners && selectedOwners.length > 0 && (
          <Breadcrumb.Item>
            {selectedOwners.map((owner) => (
              <Button
                color="light"
                pill
                size="xs"
                key={owner}
                className="mr-1"
                onClick={() => setSelectedOwners(selectedOwners.filter((o) => o !== owner))}
              >
                {owner}
              </Button>
            ))}
            <Button color="light" pill size="xs" onClick={() => setSelectedOwners([])}>
              Clear
              <BackspaceIcon fontSize="inherit" className="ml-1" />
            </Button>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
    </Card>
  )
}
export default Filters
