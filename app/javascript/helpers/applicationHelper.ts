export const truncateStart = (text: string, length: number) => {
  if (text.length > length) {
    return '...' + text.substring(text.length - length, text.length)
  } else {
    return text
  }
}

export const timeAgoInWords = (date: string) => {
  const parsedDate = new Date(date)
  const seconds = Math.floor((new Date().getTime() - parsedDate.getTime()) / 1000)

  let interval = seconds / (60 * 60 * 24 * 365)
  if (interval > 1) return `${Math.floor(interval)} year${Math.floor(interval) > 1 ? 's' : ''} ago`

  interval = seconds / (60 * 60 * 24 * 7)
  if (interval > 1) return `${Math.floor(interval)} week${Math.floor(interval) > 1 ? 's' : ''} ago`

  interval = seconds / (60 * 60 * 24)
  if (interval > 1) return `${Math.floor(interval)} day${Math.floor(interval) > 1 ? 's' : ''} ago`

  interval = seconds / (60 * 60)
  if (interval > 1) return `${Math.floor(interval)} hour${Math.floor(interval) > 1 ? 's' : ''} ago`

  interval = seconds / 60
  if (interval > 1) return `${Math.floor(interval)} minute${Math.floor(interval) > 1 ? 's' : ''} ago`

  return `${Math.floor(seconds)} second${Math.floor(interval) > 1 ? 's' : ''} ago`
}

export const buildCommitUrl = ({ projectName, commitSha }: { projectName: string; commitSha: string }) =>
  `https://github.com/${projectName}/commit/${commitSha}`

export const formatDiff = (number: number) => (number < 0 ? '' : '+') + number

export const getEnvironment = () => {
  const subdomain = window.location.hostname.split('.')[0]

  if (subdomain === 'localhost') return 'development'
  if (subdomain === 'www') return 'production'
  if (subdomain === '127') return 'test' // tests run on 127.0.0.1
  throw new Error("Can't determine environment")
}
