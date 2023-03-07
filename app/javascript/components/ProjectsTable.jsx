import AddIcon from '@mui/icons-material/Add'
import { Table } from 'flowbite-react'
import React from 'react'
import { useNavigate } from 'react-router'
import { useProjectsIndex } from '../queries/user/projects'

const ProjectsTable = () => {
  const navigate = useNavigate()
  const { data: projects } = useProjectsIndex()

  if (!projects) return null

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Owner</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {projects.length === 0 && (
          <Table.Row>
            <Table.Cell colSpan={2} className="text-center bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              First time here? 👇
            </Table.Cell>
          </Table.Row>
        )}
        {projects.map((project) => (
          <Table.Row
            key={project.id}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
            onClick={() => navigate(`/user/projects?project_id=${project.id}`)}
          >
            <Table.Cell className="text-white">{project.name}</Table.Cell>
            <Table.Cell>{project.user.name}</Table.Cell>
          </Table.Row>
        ))}
        <Table.Row
          onClick={() => navigate('/user/projects/new')}
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
        >
          <Table.Cell colSpan={2} className="text-center">
            <div className="flex items-center justify-center">
              <AddIcon /> {projects.length === 0 ? 'Create your first project' : 'New Project'}
            </div>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}

export default ProjectsTable
