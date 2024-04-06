import { Avatar, Breadcrumb as BaseBreadcrumb, Button, Dropdown, Tooltip } from 'flowbite-react'
import _ from 'lodash'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useCurrentUser from '../hooks/useCurrentUser'
import { useMetricWatchersCreate, useMetricWatchersDestroy } from '../queries/user/metricWatchers'
import { Metric } from '../queries/user/metrics'
import { Project } from '../queries/user/projects'
import { useUsersIndex } from '../queries/user/users'
import { useViewsIndex } from '../queries/user/views'

// TODO: We shouldn't need to pass projects and metrics here, we should be able to get them from the URL
const Breadcrumb = ({ projects, metrics }: { projects: Project[]; metrics: Metric[] }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate: watchMetric } = useMetricWatchersCreate()
  const { mutate: unwatchMetric } = useMetricWatchersDestroy()
  const user = useCurrentUser()

  const projectId = searchParams.get('project_id')
  const currentProject = projectId ? projects.find((project) => project.id === parseInt(projectId)) : null

  const metricId = parseInt(searchParams.get('metric_id') || '')
  const currentMetric = metricId ? metrics.find((metric) => metric.id === metricId) : null

  const { data: views } = useViewsIndex({ metricId })
  const viewerIds = views ? _.uniq(views.map((view) => view.user_id)) : []
  const { data: viewers } = useUsersIndex({ ids: viewerIds, enabled: !!currentMetric })

  const { data: watchers } = useUsersIndex({ ids: currentMetric?.watcher_ids, enabled: !!currentMetric })

  if (!user) return null
  const isWatching = currentMetric && currentMetric.watcher_ids.includes(user.id)

  return (
    <div className="card mb-3 flex flex-col md:flex-row md:items-center gap-3">
      <BaseBreadcrumb className="">
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
            </div>
          </BaseBreadcrumb.Item>
        )}
      </BaseBreadcrumb>

      {currentMetric && metricId && (
        <div className="flex gap-3 items-center">
          {isWatching ? (
            <Dropdown size="sm" label="Watching">
              <Dropdown.Item onClick={() => unwatchMetric({ metricId })}>Unwatch</Dropdown.Item>
            </Dropdown>
          ) : (
            <Tooltip placement="right" content="By watching you'll be alerted about new contributions to this metric.">
              <Button size="sm" onClick={() => watchMetric({ metricId })}>
                Watch
              </Button>
            </Tooltip>
          )}
          {watchers && (
            <>
              <Avatar.Group>
                {watchers.map((watcher) => (
                  <Tooltip key={watcher.id} content={watcher.name} arrow={false}>
                    <Avatar
                      img={watcher.image}
                      rounded
                      stacked
                      className="cursor-pointer"
                      onClick={() => navigate(`/user/users/${watcher.id}`)}
                    />
                  </Tooltip>
                ))}
              </Avatar.Group>
              {watchers.length} {watchers.length > 1 ? 'watchers' : 'watcher'}
            </>
          )}
        </div>
      )}

      {viewers && views && views.length > 0 && (
        <div className="ml-auto flex items-center gap-3">
          <p>Seen by:</p>
          <Avatar.Group>
            {viewers.map((viewer) => (
              <Tooltip key={viewer.id} content={viewer.name} arrow={false}>
                <Avatar
                  img={viewer.image}
                  rounded
                  stacked
                  className="cursor-pointer"
                  onClick={() => navigate(`/user/users/${viewer.id}`)}
                />
              </Tooltip>
            ))}
          </Avatar.Group>
        </div>
      )}
    </div>
  )
}
export default Breadcrumb
