import { Dropdown } from 'flowbite-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardsDestroy } from '../queries/user/dashboards'

const DashboardMenu = ({ dashboardId }: { dashboardId: number }) => {
  const { mutate: deleteDashboard } = useDashboardsDestroy()
  const navigate = useNavigate()

  const handleDelete = () => {
    deleteDashboard({ id: dashboardId }, { onSuccess: () => navigate('/user/dashboards') })
  }

  return (
    <Dropdown label="Actions" color="dark">
      <Dropdown.Item onClick={() => alert('Not possible yet. Coming soon.')}>Rename dashboard</Dropdown.Item>
      <Dropdown.Item onClick={handleDelete}>Delete dashboard</Dropdown.Item>
    </Dropdown>
  )
}

export default DashboardMenu
