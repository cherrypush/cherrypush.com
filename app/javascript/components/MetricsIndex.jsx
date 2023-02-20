import React from 'react'
import DebtOwners from './DebtOwners'
import Occurrences from './Occurrences'
import MetricChart from './MetricChart'

const MetricsIndex = ({ selectedOwners, owners, occurrences, metricId }) => (
  <>
    {metricId && <MetricChart metricId={metricId} />}
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
