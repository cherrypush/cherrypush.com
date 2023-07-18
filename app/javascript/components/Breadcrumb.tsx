import { Avatar, Breadcrumb as BaseBreadcrumb, Button, Card, Dropdown, Tooltip } from 'flowbite-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useCurrentUser from '../hooks/useCurrentUser'
import { useMetricWatchersCreate, useMetricWatchersDestroy } from '../queries/user/metricWatchers'
import { Metric } from '../queries/user/metrics'
import { Project } from '../queries/user/projects'
import { User, useUsersIndex } from '../queries/user/users'

// TODO: We shouldn't need to pass projects and metrics here, we should be able to get them from the URL
const Breadcrumb = ({ projects, metrics }: { projects: Project[]; metrics: Metric[] }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate: watchMetric } = useMetricWatchersCreate()
  const { mutate: unwatchMetric } = useMetricWatchersDestroy()
  const { user } = useCurrentUser()

  const projectId = searchParams.get('project_id')
  const currentProject = projectId ? projects.find((project) => project.id === parseInt(projectId)) : null

  const metricId = parseInt(searchParams.get('metric_id') || '')
  const currentMetric = metricId ? metrics.find((metric) => metric.id === metricId) : null

  const { data: watchers } = useUsersIndex({ ids: currentMetric?.watcher_ids, enabled: !!currentMetric })

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

        {currentMetric && metricId && (
          <BaseBreadcrumb.Item>
            <div className="gap-3 flex items-center">
              <span className="text-white">{currentMetric.name}</span>
              {isWatching ? (
                <Dropdown size="sm" label="Watching">
                  <Dropdown.Item onClick={() => unwatchMetric({ metricId })}>Unwatch</Dropdown.Item>
                </Dropdown>
              ) : (
                <Tooltip
                  placement="right"
                  content="By watching you'll be alerted about new contributions to this metric."
                >
                  <Button size="sm" onClick={() => watchMetric({ metricId })}>
                    Watch
                  </Button>
                </Tooltip>
              )}
              {watchers && (
                <>
                  <Avatar.Group>
                    {watchers.map((watcher: User) => (
                      <Avatar key={watcher.id} img={watcher.image} rounded stacked />
                    ))}
                  </Avatar.Group>
                  {watchers.length} {watchers.length > 1 ? 'people' : 'person'} watch this metric
                </>
              )}
            </div>
          </BaseBreadcrumb.Item>
        )}
      </BaseBreadcrumb>
    </Card>
  )
}
export default Breadcrumb
