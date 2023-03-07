import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMetricsIndex, useMetricsShow } from '../queries/user/metrics'
import { useProjectsIndex } from '../queries/user/projects'
import BackfillInstructions from './BackfillInstructions'
import Filters from './Filters'
import MetricCard from './MetricCard'
import MetricsTable from './MetricsTable'
import Occurrences from './Occurrences'
import Owners from './Owners'
import PageLoader from './PageLoader'
import ProjectsTable from './ProjectsTable'

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const metricId = searchParams.get('metric_id')
  const projectId = searchParams.get('project_id')

  const selectedOwners = searchParams.get('owners')?.split(',') ?? []
  const setSelectedOwners = (owners) => {
    if (owners.length > 0) {
      searchParams.set('owners', owners.join(','))
    } else {
      searchParams.delete('owners')
    }
    setSearchParams(searchParams)
  }

  const { data: metrics, isLoading: isLoadingMetrics } = useMetricsIndex({ projectId })
  const { data: metric } = useMetricsShow({ id: metricId, owners: selectedOwners })
  const { data: projects, isLoading: isLoadingProjects } = useProjectsIndex()

  useEffect(() => {
    if (projects && projects.length === 0) {
      toast('You need to create a project first', { icon: '💡' })
      navigate('/user/projects/new')
    }
  }, [projects])

  if (isLoadingMetrics || isLoadingProjects) return <PageLoader />

  return (
    <>
      {metrics && projects.length > 0 && (
        <Filters
          projects={projects}
          metrics={metrics}
          selectedOwners={selectedOwners}
          setSelectedOwners={setSelectedOwners}
        />
      )}
      {!projectId && <ProjectsTable />}
      {projectId && !metricId && metrics.length > 0 && (
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
