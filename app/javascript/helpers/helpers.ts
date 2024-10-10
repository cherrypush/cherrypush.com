const getMetricPrefix = (metricName: string) => {
  const match = metricName.match(/^\[(.*?)\]/)
  return match ? match[1] : ''
}

export const groupMetricsByPrefix = (metrics: { name: string }[]) => {
  const grouped: Record<string, { name: string }[]> = {}
  metrics.forEach((metric) => {
    const prefix = getMetricPrefix(metric.name)
    if (!grouped[prefix]) {
      grouped[prefix] = []
    }
    grouped[prefix].push(metric)
  })
  return grouped
}

export const isValidDomain = (domain: string) => domain.match(/^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/)

export const getDomainFromEmail = (email: string) => email.split('@')[1]
