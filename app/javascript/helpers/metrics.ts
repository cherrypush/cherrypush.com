export const getPrefix = (metricName: string) => {
  const match = metricName.match(/^\[(.*?)\]/)
  return match ? match[1] : ''
}

export const groupMetricsByPrefix = (metrics: { name: string }[]) => {
  const grouped: Record<string, { name: string }[]> = {}
  metrics.forEach((metric) => {
    const prefix = getPrefix(metric.name)
    if (!grouped[prefix]) {
      grouped[prefix] = []
    }
    grouped[prefix].push(metric)
  })
  return grouped
}
