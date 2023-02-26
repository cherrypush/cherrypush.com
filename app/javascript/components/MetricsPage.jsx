import React, { useState } from 'react'
import { useMetricsShow, useMetricsIndex } from '../queries/user/metrics'
import { useProjectsIndex } from '../queries/user/projects'
import Filters from './Filters'
import MetricChart from './MetricChart'
import Owners from './Owners'
import Occurrences from './Occurrences'
import MetricsTable from './MetricsTable'
import BackfillInstructions from './BackfillInstructions'
import { useSearchParams } from 'react-router-dom'
import { Card } from 'flowbite-react'

const MetricsPage = () => {
  let [searchParams, setSearchParams] = useSearchParams()
  const metricId = searchParams.get('metric_id')
  const projectId = searchParams.get('project_id')

  const [selectedOwners, _setSelectedOwners] = useState(searchParams.get('owners')?.split(',') ?? [])
  const setSelectedOwners = (owners) => {
    searchParams.set('owners', owners.join(','))
    setSearchParams(searchParams)
    _setSelectedOwners(owners)
  }

  const { data: metrics } = useMetricsIndex({ projectId })
  const { data: metric } = useMetricsShow({ id: metricId, owners: selectedOwners })
  const { data: projects } = useProjectsIndex()

  if (!projects || !metrics) return null

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
      {!metricId && metrics.length > 0 && <MetricsTable metrics={metrics} />}
      {!metricId && metrics.length === 0 && <BackfillInstructions />}
      {metricId && metric && (
        <>
          <Card className="mb-3">
            <MetricChart metric={metric} />
          </Card>
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

export default MetricsPage
