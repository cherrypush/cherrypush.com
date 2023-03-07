import AddIcon from '@mui/icons-material/Add'
import { Table } from 'flowbite-react'
import React from 'react'
import { useNavigate } from 'react-router'
import { timeAgoInWords } from '../helpers/applicationHelper'
import { useProjectsIndex } from '../queries/user/projects'
import SortedTable from './SortedTable'

const ProjectsTable = () => {
  const navigate = useNavigate()
  const { data: projects } = useProjectsIndex()

  if (!projects) return null

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Owner',
        accessor: 'user.name',
      },
      {
        Header: 'Last report',
        accessor: 'updated_at',
        Cell: ({ row }) => timeAgoInWords(row.original.updated_at),
      },
    ],
    []
  )

  const handleClick = (project) => navigate(`/user/projects?project_id=${project.id}`)

  const Footer = () => (
    <Table.Row
      onClick={() => navigate('/user/projects/new')}
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
    >
      <Table.Cell colSpan="100%" className="text-center">
        <div className="flex items-center justify-center">
          <AddIcon /> {projects.length === 0 ? 'Create your first project' : 'New Project'}
        </div>
      </Table.Cell>
    </Table.Row>
  )

  const data = React.useMemo(() => projects, [projects])

  return <SortedTable data={data} columns={columns} onRowClick={handleClick} Footer={Footer} />
}

export default ProjectsTable
