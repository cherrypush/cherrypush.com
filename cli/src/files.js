import { promises as fs } from 'fs'
import intersection from 'lodash/intersection.js'
import * as git from './git.js'

class File {
  constructor(path) {
    this.path = path
  }

  async readLines() {
    try {
      return Buffer.from(await fs.readFile(this.path))
        .toString()
        .split(/\r\n|\r|\n/)
    } catch (error) {
      if (error.code === 'ENOENT') return []
      if (error.code === 'EISDIR') return []
      throw error
    }
  }
}

export const getFiles = async (owners, codeOwners) => {
  const allPaths = await git.files()
  let selectedPaths = allPaths
  if (owners) selectedPaths = intersection(codeOwners.getFiles(owners), selectedPaths)

  return selectedPaths.map((path) => new File(path))
}
