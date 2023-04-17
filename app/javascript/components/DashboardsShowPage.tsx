import { Breadcrumb, Button, Card } from 'flowbite-react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDashboardsShow } from '../queries/user/dashboards'
import ChartCard from './ChartCard'
import ChartDrawer from './ChartDrawer'
import DashboardActionsMenu from './DashboardActionsMenu'
import OwnerSelector from './OwnerSelector'

const DashboardsShowPage = () => {
  const { dashboardId, chartId } = useParams()
  const isNewChartPage = !chartId && window.location.pathname.endsWith('new')
  const navigate = useNavigate()

  const { data: dashboard } = useDashboardsShow({ id: dashboardId ? parseInt(dashboardId) : undefined })

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
            <Button onClick={() => navigate(`/user/dashboards/${dashboard.id}/charts/new`)}>+ Add Chart</Button>
            <DashboardActionsMenu dashboard={dashboard} />
          </div>
        </div>
      </Card>
      {dashboard.charts.length > 0 ? (
        <>
          <Card className="mb-3">
            <OwnerSelector />
          </Card>
          {dashboard.charts.map((chart) => (
            <ChartCard chart={chart} key={chart.id} className="mb-3" />
          ))}
        </>
      ) : (
        <Card>
          <div className="text-center text-gray-500">No charts yet</div>
        </Card>
      )}
      <ChartDrawer
        open={!!chartId || isNewChartPage}
        dashboard={dashboard}
        onClose={() => navigate(`/user/dashboards/${dashboard.id}`)}
      />
    </div>
  )
}

export default DashboardsShowPage
