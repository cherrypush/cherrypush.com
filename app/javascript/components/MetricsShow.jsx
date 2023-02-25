import React, { useState } from 'react'
import DebtOwners from './DebtOwners'
import Occurrences from './Occurrences'
import MetricChart from './MetricChart'
import Filters from './Filters'
import { useMetricsShow, useMetricsIndex } from '../queries/user/metrics'
import { useProjectsIndex } from '../queries/user/projects'
import { getParam } from '../helpers/applicationHelper'

const MetricsShow = () => {
  const id = getParam('metric_id')
  const projectId = getParam('project_id')
  const [selectedOwners, setSelectedOwners] = useState([])

  const { data: metrics } = useMetricsIndex({ projectId })
  const { data: metric } = useMetricsShow({ id, owners: selectedOwners })
  const { data: projects } = useProjectsIndex()

  if (!metric) return

  return (
    <>
      {metrics && projects && (
        <Filters
          projects={projects}
          metrics={metrics}
          selectedOwners={selectedOwners}
          setSelectedOwners={setSelectedOwners}
        />
      )}
      <>
        <MetricChart metric={metric} />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
          {metric.owners && (
            <div className="col-span-1">
              <DebtOwners
                selectedOwners={selectedOwners}
                setSelectedOwners={setSelectedOwners}
                owners={metric.owners}
              />
            </div>
          )}
          {metric.occurrences && (
            <div className="col-span-1 xl:col-span-3">
              <Occurrences occurrences={metric.occurrences} />
            </div>
          )}
        </div>
      </>
    </>
  )
}

export default MetricsShow
