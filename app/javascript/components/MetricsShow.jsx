import React from 'react'
import DebtOwners from './DebtOwners'
import Occurrences from './Occurrences'
import MetricChart from './MetricChart'
import Filters from './Filters'

const MetricsShow = ({ selectedOwners, owners, occurrences, metricId, metrics, projects }) => (
  <>
    <Filters projects={projects} metrics={metrics} />
    <>
      <MetricChart metricId={metricId} selectedOwners={selectedOwners} />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {owners && (
          <div className="col-span-1">
            <DebtOwners selectedOwners={selectedOwners} owners={owners} />
          </div>
        )}
        {occurrences && (
          <div className="col-span-1 xl:col-span-3">
            <Occurrences occurrences={occurrences} />
          </div>
        )}
      </div>
    </>
  </>
)

export default MetricsShow
