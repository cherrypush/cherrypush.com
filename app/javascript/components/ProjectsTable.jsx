import React from 'react'
import { useNavigate } from 'react-router'
import { timeAgoInWords } from '../helpers/applicationHelper'
import { useProjectsIndex } from '../queries/user/projects'
import SortedTable from './SortedTable'

const ProjectsTable = () => {
  const navigate = useNavigate()
  const { data: projects } = useProjectsIndex()

  if (!projects) return null

  const data = React.useMemo(() => projects, [projects])
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

  return <SortedTable data={data} columns={columns} onRowClick={handleClick} />
}

export default ProjectsTable
