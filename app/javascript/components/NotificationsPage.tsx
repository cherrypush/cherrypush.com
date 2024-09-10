import { Button, Card } from 'flowbite-react'
import { buildCommitUrl, formatDiff, timeAgoInWords } from '../helpers/applicationHelper'
import {
  useNotificationsIndex,
  useNotificationsMarkAllAsSeen,
  useNotificationsMarkAsSeen,
} from '../queries/user/notifications'

import { useNavigate } from 'react-router-dom'
import { useMetricsIndex } from '../queries/user/metrics'

const NotificationsPage = () => {
  const { data, fetchNextPage, hasNextPage } = useNotificationsIndex()
  const notifications = data?.pages.flat()
  const { data: metrics } = useMetricsIndex()
  const { mutate: markAsSeen } = useNotificationsMarkAsSeen()
  const { mutate: markAllAsSeen } = useNotificationsMarkAllAsSeen()
  const navigate = useNavigate()

  if (!notifications || !metrics) return null

  return (
    <div className="container">
      <div className="md:flex md:flex-row flex-col gap-6 items-center justify-between mb-6">
        <h1>Notifications</h1>
        <Button className="md:mb-0" onClick={() => markAllAsSeen()}>
          Mark all as seen
        </Button>
      </div>
      {notifications.length > 0 ? (
        notifications.map((notification) => {
          const metric = metrics.find((metric) => metric.id === notification.item.metric_id)

          if (!metric) return null

          return (
            <Card
              className="mb-3 dark:hover:bg-gray-700 cursor-pointer relative"
              key={notification.id}
              onClick={() => {
                window.open(
                  buildCommitUrl({ projectName: metric.project.name, commitSha: notification.item.commit_sha }),
                  '_blank'
                )
                markAsSeen(notification.id)
              }}
            >
              {!notification.seen_at && <div className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full" />}
              <div>
                {notification.item.author_name} contributed to the metric{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    navigate(`/user/projects?project_id=${metric.project.id}&metric_id=${metric.id}`)
                    e.stopPropagation()
                  }}
                  className="text-link"
                >
                  {metric.name}
                </button>
                : {formatDiff(notification.item.diff)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {metric.project.name} • {timeAgoInWords(notification.item.created_at)}
              </div>
            </Card>
          )
        })
      ) : (
        <Card>
          <div className="text-center text-gray-500">No notification yet</div>
        </Card>
      )}
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} fullSized>
          Show more
        </Button>
      )}
    </div>
  )
}

export default NotificationsPage
