import React from 'react'
import DebtOwners from './DebtOwners'
import Occurrences from './Occurrences'
import MetricChart from './MetricChart'
import MetricsTable from './MetricsTable'

const MetricsIndex = ({ selectedOwners, owners, occurrences, metricId, metrics }) => (
  <>
    {metricId ? (
      <MetricChart metricId={metricId} />
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
)

export default MetricsIndex
