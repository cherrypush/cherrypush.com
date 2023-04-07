import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockPersonIcon from '@mui/icons-material/LockPerson'
import { Button, Card } from 'flowbite-react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuthorizationRequestsCreate } from '../queries/user/authorizationsRequests'
import { useMetricsIndex, useMetricsShow } from '../queries/user/metrics'
import { useProjectsIndex } from '../queries/user/projects'
import BackfillInstructions from './BackfillInstructions'
import Filters from './Filters'
import MetricCard from './MetricCard'
import MetricsTable from './MetricsTable'
import NewProjectPage from './NewProjectPage'
import Occurrences from './Occurrences'
import Owners from './Owners'
import PageLoader from './PageLoader'
import ProjectsTable from './ProjectsTable'

const RequestAccessCard = ({ projectId }: { projectId: number }) => {
  const { mutateAsync: requestAccess, isLoading, isSuccess } = useAuthorizationRequestsCreate()

  return (
    <Card className="max-w-xl text-center mx-auto">
      <p>
        {"You don't have access to this project."}
        <br />
        {'Please request access to the project members.'}
      </p>
      {isSuccess ? (
        <Button color="success" disabled>
          <CheckCircleIcon />
          <span className="ml-2">Your request has been sent.</span>
        </Button>
      ) : (
        <Button disabled={isLoading} onClick={() => requestAccess({ projectId })}>
          <LockPersonIcon />
          <span className="ml-2">Request Access</span>
        </Button>
      )}
    </Card>
  )
}

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const metricId = searchParams.get('metric_id')
  const projectIdFromUrl = searchParams.get('project_id')

  const selectedOwners = searchParams.get('owners')?.split(',') ?? []
  const setSelectedOwners = (owners) => {
    if (owners.length > 0) {
      searchParams.set('owners', owners.join(','))
    } else {
      searchParams.delete('owners')
    }
    setSearchParams(searchParams)
  }

  const { data: metric } = useMetricsShow({ id: metricId, owners: selectedOwners })
  const { data: projects, isLoading: isLoadingProjects } = useProjectsIndex()
  const { data: metrics, isLoading: isLoadingMetrics } = useMetricsIndex({
    projectId: projectIdFromUrl
      ? projects?.find((project) => project.id === parseInt(projectIdFromUrl))?.id
      : undefined,
  })

  if (isLoadingMetrics || isLoadingProjects) return <PageLoader />

  if (projectIdFromUrl && projects && projects.some((project) => project.id === parseInt(projectIdFromUrl)) === false)
    return <RequestAccessCard projectId={parseInt(projectIdFromUrl)} />

  if (projects && projects.length === 0) return <NewProjectPage />

  if (!projectIdFromUrl)
    return (
      <>
        <Filters
          projects={projects}
          metrics={metrics}
          selectedOwners={selectedOwners}
          setSelectedOwners={setSelectedOwners}
        />
        <ProjectsTable />
      </>
    )

  return (
    <>
      {metrics && projects && projects.length > 0 && (
        <Filters
          projects={projects}
          metrics={metrics}
          selectedOwners={selectedOwners}
          setSelectedOwners={setSelectedOwners}
        />
      )}
      {projectIdFromUrl && !metricId && metrics.length > 0 && (
        <MetricsTable metrics={metrics} selectedOwners={selectedOwners} />
      )}
      {!metricId && metrics.length === 0 && <BackfillInstructions />}
      {metricId && metric && (
        <>
          <MetricCard metric={metric} />
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
            {metric.owners && (
              <div className="col-span-1">
                <Owners selectedOwners={selectedOwners} setSelectedOwners={setSelectedOwners} owners={metric.owners} />
              </div>
            )}
            {metric.occurrences && (
              <div className="col-span-1 xl:col-span-3">
                <Occurrences occurrences={metric.occurrences} />
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ProjectsPage
