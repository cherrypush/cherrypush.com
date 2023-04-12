import { Breadcrumb, Button, Card } from 'flowbite-react'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDashboardsShow } from '../queries/user/dashboards'
import ChartCard from './ChartCard'
import ChartDrawer from './ChartDrawer'
import DashboardActionsMenu from './DashboardActionsMenu'

const AddNewChartButton = ({ dashboard }) => {
  const [show, setShow] = useState(false)

  return (
    <>
      <Button onClick={() => setShow(true)}>+ Add Chart</Button>
      <ChartDrawer show={show} dashboard={dashboard} onClose={() => setShow(false)} />
    </>
  )
}

const DashboardsShowPage = () => {
  const { id } = useParams()
  const { data: dashboard } = useDashboardsShow({ id: id ? parseInt(id) : undefined })

  if (!dashboard) return null

  return (
    <div>
      <Card className="mb-3">
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <Breadcrumb.Item href="/user/dashboards">Dashboards</Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="text-white">{dashboard.name}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <AddNewChartButton dashboard={dashboard} />
            <DashboardActionsMenu dashboard={dashboard} />
          </div>
        </div>
      </Card>
      {dashboard.charts.length > 0 ? (
        dashboard.charts.map((chart) => <ChartCard chart={chart} key={chart.id} className="mb-3" />)
      ) : (
        <Card>
          <div className="text-center text-gray-500">No charts yet</div>
        </Card>
      )}
    </div>
  )
}

export default DashboardsShowPage
