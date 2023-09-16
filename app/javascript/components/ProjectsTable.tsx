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
        Header: 'Organization',
        accessor: 'organization.name',
        Cell: ({ row }) =>
          row.original.organization && (
            <a
              onClick={(event) => {
                event.stopPropagation()
                navigate(`/user/organizations/${row.original.organization.id}`)
              }}
              className="text-link"
            >
              {row.original.organization.name}
            </a>
          ),
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
