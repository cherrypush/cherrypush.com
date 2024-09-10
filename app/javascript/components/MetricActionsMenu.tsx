import { HiDotsVertical, HiTrash } from 'react-icons/hi'

import { Dropdown } from 'flowbite-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useMetricsDestroy } from '../queries/user/metrics'

const MetricActionsMenu = ({ metricId, projectId }: { metricId: number; projectId: number }) => {
  const { mutateAsync: deleteMetric } = useMetricsDestroy()
  const navigate = useNavigate()

  const handleDelete = async () => {
    navigate(`/user/projects?project_id=${projectId}`)
    await toast.promise(deleteMetric(metricId), {
      loading: 'Deleting metric...',
      success: 'Metric deleted',
      error: 'Error deleting metric',
    })
  }

  return (
    <>
      <Dropdown
        arrowIcon={false}
        label={<HiDotsVertical />}
        color="dark"
        placement="bottom-end"
        size="lg"
        data-testid="project-menu"
      >
        <Dropdown.Item icon={HiTrash} onClick={handleDelete}>
          Delete metric
        </Dropdown.Item>
      </Dropdown>
    </>
  )
}

export default MetricActionsMenu
