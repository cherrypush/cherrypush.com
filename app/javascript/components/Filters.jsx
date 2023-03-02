import React from 'react'
import { Breadcrumb, Button, Card, Dropdown } from 'flowbite-react'
import BackspaceIcon from '@mui/icons-material/Backspace'
import { Turbo } from '@hotwired/turbo-rails'
import { useSearchParams } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'

const Filters = ({ projects, metrics, selectedOwners, setSelectedOwners }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const projectId = searchParams.get('project_id')
  const currentProject = projects.find((project) => project.id === parseInt(projectId))

  const currentMetricId = searchParams.get('metric_id')
  const currentMetric = metrics.find((metric) => metric.id === parseInt(currentMetricId))

  return (
    <Card className="mb-3">
      <Breadcrumb>
        <Breadcrumb.Item>
          <button onClick={() => Turbo.visit('/user/projects')} className="hover:text-white cursor-pointer">
            Projects
          </button>
        </Breadcrumb.Item>

        {/* PROJECTS */}
        <Breadcrumb.Item>
          <div className="hover:text-white">
            <Dropdown label={currentProject?.name || 'Select a project'} inline>
              {currentProject && (
                <Dropdown.Item
                  onClick={() => {
                    searchParams.delete('project_id')
                    setSearchParams(searchParams)
                  }}
                >
                  <CloseIcon /> Remove selection
                </Dropdown.Item>
              )}
              {projects.map((project) => (
                <Dropdown.Item key={project.id} onClick={() => setSearchParams({ project_id: project.id })}>
                  {project.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
        </Breadcrumb.Item>

        {/* METRICS */}
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
          <Button color="light" pill size="xs" onClick={() => setSelectedOwners([])}>
            Clear
            <BackspaceIcon fontSize="inherit" className="ml-1" />
          </Button>
        </div>
      )}
    </Card>
  )
}
export default Filters
