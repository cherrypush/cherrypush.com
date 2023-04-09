import { Dropdown } from 'flowbite-react'
import React from 'react'
import { HiDotsVertical, HiPencil, HiTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useDashboardsDestroy } from '../queries/user/dashboards'

const DashboardMenu = ({ dashboardId }: { dashboardId: number }) => {
  const { mutate: deleteDashboard } = useDashboardsDestroy()
  const navigate = useNavigate()

  const handleDelete = () => {
    deleteDashboard({ id: dashboardId }, { onSuccess: () => navigate('/user/dashboards') })
  }

  return (
    <Dropdown arrowIcon={false} label={<HiDotsVertical />} color="dark" placement="bottom-end" size="lg">
      <Dropdown.Item icon={HiPencil} onClick={() => alert('Not possible yet. Coming soon.')}>
        Rename dashboard
      </Dropdown.Item>
      <Dropdown.Item icon={HiTrash} onClick={handleDelete}>
        Delete dashboard
      </Dropdown.Item>
    </Dropdown>
  )
}

export default DashboardMenu
