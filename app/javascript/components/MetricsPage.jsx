import React from 'react'
import MetricsShow from './MetricsShow'
import MetricsIndex from './MetricsIndex'

const MetricsPage = ({ metric }) => (metric ? <MetricsShow /> : <MetricsIndex />)

export default MetricsPage
