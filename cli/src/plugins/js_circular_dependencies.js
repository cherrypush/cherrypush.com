import glob from 'glob'
import madge from 'madge'
import { emptyMetric } from '../occurences.js'

const DEFAULT_FILES = '**/*.{js,jsx,ts,tsx}'

const run = async ({ include, tsConfig }) => {
  const paths = glob.sync(include || DEFAULT_FILES, { ignore: 'node_modules/**/*' })

  const madgeConfig = { tsConfig } // https://github.com/pahen/madge#configuration
  const madgeResult = await madge(paths, madgeConfig)
  const dependencies = madgeResult.circular()

  const occurrences = dependencies.map((files) => ({
    text: files.join(' > '),
    filePath: files[0],
    metricName: 'JS circular dependencies',
  }))

  return occurrences.length === 0 ? [emptyMetric('JS circular dependencies')] : occurrences
}

export default { run }
