import _ from 'lodash'

const toCountByMetricName = (occurrences) =>
  _.mapValues(_.groupBy(occurrences, 'metricName'), (occurrences) => occurrences.length)

export const computeContributions = (occurrences, previousOccurrences) => {
  const counts = toCountByMetricName(occurrences)
  const previousCounts = toCountByMetricName(previousOccurrences)

  const metrics = _.uniq(Object.keys(counts).concat(Object.keys(previousCounts)))
  const contributions = []
  metrics.forEach((metric) => {
    const diff = (counts[metric] || 0) - (previousCounts[metric] || 0)
    if (diff !== 0) contributions.push({ metricName: metric, diff })
  })

  return contributions
}
