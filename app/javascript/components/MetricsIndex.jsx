import React from 'react'
import MetricsTable from './MetricsTable'
import BackfillInstructions from './BackfillInstructions'
import Filters from './Filters'

const MetricsIndex = ({ selectedOwners = [], metrics, currentUser, projects }) => {
  const hasReports = metrics.some((metric) => metric.last_report)

  return (
    <>
      <Filters projects={projects} metrics={metrics} />
      {hasReports ? (
        <MetricsTable metrics={metrics} selectedOwners={selectedOwners} />
      ) : (
        <BackfillInstructions currentUser={currentUser} />
      )}
    </>
  )
}
export default MetricsIndex
