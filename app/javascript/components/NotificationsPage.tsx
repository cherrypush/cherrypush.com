import { Button, Card } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { buildCommitUrl, formatDiff, timeAgoInWords } from '../helpers/applicationHelper'
import { useMetricsIndex } from '../queries/user/metrics'
import {
  useNotificationsIndex,
  useNotificationsMarkAllAsSeen,
  useNotificationsMarkAsSeen,
} from '../queries/user/notifications'

const NotificationsPage = () => {
  const { data: notifications } = useNotificationsIndex()
  const { data: metrics } = useMetricsIndex()
  const { mutate: markAsSeen } = useNotificationsMarkAsSeen()
  const { mutate: markAllAsSeen } = useNotificationsMarkAllAsSeen()
  const navigate = useNavigate()

  if (!notifications || !metrics) return null

  return (
    <div className="container">
      <div className="md:flex items-center justify-between">
        <div>
          <h1>Notifications</h1>
          <p className="mb-3">To be notified about contributions to a metric, go to its page and watch for changes.</p>
        </div>
        <Button className="mb-3 md:mb-0" onClick={() => markAllAsSeen()}>
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
    </div>
  )
}

export default NotificationsPage
