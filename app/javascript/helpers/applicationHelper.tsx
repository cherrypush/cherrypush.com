export const truncateStart = (text, length) => {
  if (text.length > length) {
    return '...' + text.substring(text.length - length, text.length)
  } else {
    return text
  }
}
