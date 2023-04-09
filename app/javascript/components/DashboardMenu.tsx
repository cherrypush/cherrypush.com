import { Button, Dropdown, Label, Modal, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { HiDotsVertical, HiPencil, HiTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useDashboardsDestroy, useDashboardsUpdate } from '../queries/user/dashboards'

const DashboardEditModal = ({
  dashboard,
  show,
  setShow,
}: {
  dashboard: { id: number; name: string }
  show: boolean
  setShow: (boolean) => void
}) => {
  const { mutate: updateDashboard } = useDashboardsUpdate()
  const [name, setName] = useState(dashboard.name)

  return (
    <Modal show={show} onClose={() => setShow(false)} dismissible>
      <Modal.Header>Rename dashboard</Modal.Header>
      <Modal.Body>
        <div>
          <Label htmlFor="name" value="Name" className="block mb-2" />
          <TextInput
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dashboard name"
            className="w-full"
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button
          onClick={() => {
            updateDashboard({ id: dashboard.id, dashboard: { name } }, { onSuccess: () => setShow(false) })
          }}
        >
          Rename
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const DashboardMenu = ({ dashboard }: { dashboard: { id: number; name: string } }) => {
  const { mutate: deleteDashboard } = useDashboardsDestroy()
  const navigate = useNavigate()
  const [showDashboardEditModal, setShowDashboardEditModal] = useState(false)

  const handleDelete = () => {
    deleteDashboard({ id: dashboard.id }, { onSuccess: () => navigate('/user/dashboards') })
  }

  return (
    <Dropdown
      arrowIcon={false}
      label={<HiDotsVertical />}
      color="dark"
      placement="bottom-end"
      size="lg"
      id="dashboard-menu"
    >
      <Dropdown.Item icon={HiPencil} onClick={() => setShowDashboardEditModal(true)}>
        Rename dashboard
      </Dropdown.Item>
      <Dropdown.Item icon={HiTrash} onClick={handleDelete}>
        Delete dashboard
      </Dropdown.Item>
      <DashboardEditModal dashboard={dashboard} show={showDashboardEditModal} setShow={setShowDashboardEditModal} />
    </Dropdown>
  )
}

export default DashboardMenu
