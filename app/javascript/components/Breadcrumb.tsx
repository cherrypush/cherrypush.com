import { Breadcrumb as BaseBreadcrumb, Button, Card, Dropdown } from 'flowbite-react'
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useCurrentUser from '../hooks/useCurrentUser'
import { useMetricWatchersCreate, useMetricWatchersDestroy } from '../queries/user/metricWatchers'

const Breadcrumb = ({ projects, metrics }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate: watchMetric } = useMetricWatchersCreate()
  const { mutate: unwatchMetric } = useMetricWatchersDestroy()
  const { user } = useCurrentUser()

  const projectId = searchParams.get('project_id')
  const currentProject = projectId ? projects.find((project) => project.id === parseInt(projectId)) : null

  const metricId = searchParams.get('metric_id')
  const currentMetric = metricId ? metrics.find((metric) => metric.id === parseInt(metricId)) : null

  const isWatching = currentMetric && currentMetric.watcher_ids.includes(user.id)

  return (
    <Card className="mb-3">
      <BaseBreadcrumb>
        <BaseBreadcrumb.Item>
          <button onClick={() => navigate('/user/projects')} className="hover:text-white cursor-pointer">
            Projects
          </button>
        </BaseBreadcrumb.Item>

        {currentProject && (
          <BaseBreadcrumb.Item onClick={() => navigate(`/user/projects?project_id=${currentProject.id}`)}>
            <div className="hover:text-white cursor-pointer">{currentProject.name}</div>
          </BaseBreadcrumb.Item>
        )}

        {currentMetric && (
          <BaseBreadcrumb.Item>
            <div className="gap-3 flex items-center">
              <span className="text-white">{currentMetric.name}</span>
              {isWatching ? (
                <Dropdown size="sm" label="Watching" button>
                  <Dropdown.Item onClick={() => unwatchMetric({ metricId })}>Unwatch</Dropdown.Item>
                </Dropdown>
              ) : (
                <Button size="sm" onClick={() => watchMetric({ metricId })}>
                  Watch
                </Button>
              )}
            </div>
          </BaseBreadcrumb.Item>
        )}
      </BaseBreadcrumb>
    </Card>
  )
}
export default Breadcrumb
