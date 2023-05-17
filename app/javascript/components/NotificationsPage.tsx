import { Card } from 'flowbite-react'
import React from 'react'

const NotificationsPage = () => {
  const notifications = []

  return (
    <div className="container">
      <h1>Notifications</h1>
      <p className="mb-3">To be notified about contributions to a metric, go to its page and watch for changes.</p>
      {notifications.length > 0 ? (
        'hello'
      ) : (
        <Card>
          <div className="text-center text-gray-500">No notification yet</div>
        </Card>
      )}
    </div>
  )
}

export default NotificationsPage
