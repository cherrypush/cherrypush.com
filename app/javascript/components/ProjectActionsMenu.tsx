import { HiDotsVertical, HiTrash } from 'react-icons/hi'

import { Dropdown } from 'flowbite-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useProjectsDestroy } from '../queries/user/projects'

const ProjectActionsMenu = ({ projectId }: { projectId: number }) => {
  const { mutateAsync: deleteProject } = useProjectsDestroy()
  const navigate = useNavigate()

  const handleDelete = async () => {
    navigate('/user/projects')
    await toast.promise(deleteProject(projectId), {
      loading: 'Deleting project...',
      success: 'Project deleted',
      error: 'Error deleting project',
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
          Delete project
        </Dropdown.Item>
      </Dropdown>
    </>
  )
}

export default ProjectActionsMenu
