import React from 'react'
import DebtOwners from './DebtOwners'
import Occurrences from './Occurrences'
import MetricChart from './MetricChart'
import MetricsTable from './MetricsTable'
import BackfillInstructions from './BackfillInstructions'
import Filters from './Filters'

const MetricsIndex = ({ selectedOwners, owners, occurrences, metricId, metrics, currentUser, projects }) => {
  const hasReports = metrics.some((metric) => metric.last_report)

  return (
    <>
      <Filters projects={projects} metrics={metrics} />
      {hasReports && (
        <>
          {metricId ? (
            <MetricChart metricId={metricId} selectedOwners={selectedOwners} />
          ) : (
            <MetricsTable metrics={metrics} selectedOwners={selectedOwners} />
          )}
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
      )}
      {!hasReports && <BackfillInstructions currentUser={currentUser} />}
    </>
  )
}
export default MetricsIndex
