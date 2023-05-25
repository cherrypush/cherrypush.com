import { Button, Card } from 'flowbite-react'
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSelectedOwners from '../hooks/useSelectedOwners'
import { useMetricsIndex, useMetricsShow } from '../queries/user/metrics'
import { useOccurrencesIndex } from '../queries/user/metrics/occurrences'
import { useProjectsIndex } from '../queries/user/projects'
import BackfillInstructions from './BackfillInstructions'
import Breadcrumb from './Breadcrumb'
import Contributions from './Contributions'
import MetricCard from './MetricCard'
import MetricsTable from './MetricsTable'
import NewProjectPage from './NewProjectPage'
import Occurrences from './Occurrences'
import OwnerSelector from './OwnerSelector'
import PageLoader from './PageLoader'
import ProjectsTable from './ProjectsTable'
import RequestAccessCard from './RequestAccessCard'

const ProjectsPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const metricId = searchParams.get('metric_id')
  const projectIdFromUrl = searchParams.get('project_id')
  const { selectedOwners } = useSelectedOwners()

  const { data: metric } = useMetricsShow(metricId ? parseInt(metricId) : null, selectedOwners)
  const { data: projects } = useProjectsIndex()
  const { data: metrics } = useMetricsIndex({
    projectId: projectIdFromUrl
      ? projects?.find((project) => project.id === parseInt(projectIdFromUrl))?.id
      : undefined,
  })
  const { data: occurrences } = useOccurrencesIndex(metricId ? parseInt(metricId) : null, selectedOwners)

  if (!metrics || !projects) return <PageLoader />

  if (projectIdFromUrl && projects && projects.some((project) => project.id === parseInt(projectIdFromUrl)) === false)
    return <RequestAccessCard projectId={parseInt(projectIdFromUrl)} />

  if (projects && projects.length === 0) return <NewProjectPage />

  if (!projectIdFromUrl)
    return (
      <div className="container">
        <div className="flex items-center justify-between">
          <h1>Projects</h1>
          <Button onClick={() => navigate('/user/projects/new')}>+ New Project</Button>
        </div>

        <ProjectsTable />
      </div>
    )

  const currentProject = projects.find((project) => project.id === parseInt(projectIdFromUrl))

  return (
    <>
      {metrics && projects && projects.length > 0 && <Breadcrumb projects={projects} metrics={metrics} />}
      {projectIdFromUrl && !metricId && metrics.length > 0 && (
        <MetricsTable metrics={metrics} selectedOwners={selectedOwners} />
      )}
      {!metricId && metrics.length === 0 && <BackfillInstructions />}
      {currentProject && metricId && metric && (
        <>
          <Card className="mb-3">
            <OwnerSelector projectId={parseInt(projectIdFromUrl)} metricId={parseInt(metricId)} />
          </Card>
          <MetricCard metricId={metric.id} owners={selectedOwners} />
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
            {metricId && (
              <div className="col-span-1">
                <Contributions projectName={currentProject.name} metricId={parseInt(metricId)} />
              </div>
            )}
            {occurrences && (
              <div className="col-span-1 xl:col-span-3">
                <Occurrences occurrences={occurrences} />
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ProjectsPage
