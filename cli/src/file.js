import fs from 'fs'

export const isDirectory = (path) => {
  try {
    return fs.statSync(path).isDirectory()
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}
