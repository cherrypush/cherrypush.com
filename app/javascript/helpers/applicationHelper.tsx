export const truncateStart = (text, length) => {
  if (text.length > length) {
    return '...' + text.substring(text.length - length, text.length)
  } else {
    return text
  }
}

export const timeAgoInWords = (date: Date) => {
  const parsedDate = new Date(date)

  const seconds = Math.floor((new Date().getTime() - parsedDate.getTime()) / 1000)
  let interval = seconds / 31536000

  if (interval > 1) return Math.floor(interval) + ` year${Math.floor(interval) > 1 ? 's' : ''} ago`

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ` month${Math.floor(interval) > 1 ? 's' : ''} ago`

  interval = seconds / (60 * 60 * 24)
  if (interval > 1) return Math.floor(interval) + ` day${Math.floor(interval) > 1 ? 's' : ''} ago`

  interval = seconds / (60 * 60)
  if (interval > 1) return Math.floor(interval) + ` hour${Math.floor(interval) > 1 ? 's' : ''} ago`

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ` minute${Math.floor(interval) > 1 ? 's' : ''} ago`

  return Math.floor(seconds) + ` second${Math.floor(interval) > 1 ? 's' : ''} ago`
}
