import React from 'react'
import MetricsTable from './MetricsTable'
import BackfillInstructions from './BackfillInstructions'
import Filters from './Filters'
import { useMetricsIndex } from '../queries/user/metrics'
import { useProjectsIndex } from '../queries/user/projects'
import { getParam } from '../helpers/applicationHelper'

const MetricsIndex = () => {
  const projectId = getParam('project_id')

  const { data: metrics } = useMetricsIndex({ projectId })
  const { data: projects } = useProjectsIndex()

  if (!metrics || !projects) return null

  return (
    <>
      <Filters projects={projects} metrics={metrics} />
      {metrics.length > 0 ? <MetricsTable metrics={metrics} /> : <BackfillInstructions />}
    </>
  )
}
export default MetricsIndex
