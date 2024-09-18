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
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Organization',
        accessorKey: 'organization.name',
        cell: ({ row }) =>
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
        header: 'Owner',
        accessorKey: 'user.name',
      },
      {
        header: 'Last report',
        accessorKey: 'updated_at',
        cell: ({ row }) => timeAgoInWords(row.original.updated_at),
      },
    ],
    []
  )

  const handleClick = (project) => navigate(`/user/projects?project_id=${project.id}`)

  return <SortedTable data={data} columns={columns} onRowClick={handleClick} />
}

export default ProjectsTable
