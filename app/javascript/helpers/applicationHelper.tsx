import { Turbo } from '@hotwired/turbo-rails'

export const truncateStart = (text, length) => {
  if (text.length > length) {
    return '...' + text.substring(text.length - length, text.length)
  } else {
    return text
  }
}

export const timeAgoInWords = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000)
  let interval = seconds / 31536000

  if (interval > 1) return Math.floor(interval) + ' years ago'

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'

  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'

  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'

  return Math.floor(seconds) + ' seconds ago'
}

export const getParam = (name) => {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(name)
}

export const appendParam = (name, value) => {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.append(name, value)
  Turbo.visit(`${window.location.pathname}?${searchParams}`)
}

export const setParam = (name, value) => {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set(name, value)
  Turbo.visit(`${window.location.pathname}?${searchParams}`)
}

export const setParams = (params) => {
  const searchParams = new URLSearchParams()
  Object.keys(params).forEach((key) => searchParams.set(key, params[key]))
  Turbo.visit(`${window.location.pathname}?${searchParams}`)
}
