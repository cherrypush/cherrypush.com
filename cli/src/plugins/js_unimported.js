import _ from 'lodash'
import { emptyMetric } from '../occurences.js'
import sh from '../sh.js'

const getMetricName = (dir) => {
  if (dir) return `npx unimported files (${dir})`
  return 'npx unimported files'
}

const getCommand = (dir) => {
  if (dir) return `npx unimported ${dir} --show-unused-files`
  return `npx unimported --show-unused-files`
}

const run = async ({ dir }) => {
  const { stdout } = await sh(getCommand(dir), { throwOnError: false })

  const occurrences = _.compact(
    stdout.split('\n').map((line) => {
      const [col1, col2, col3, filepath] = line.split(/\s+/)
      if (!(col1 === '' && typeof parseInt(col2) == 'number' && col3 === '│')) return // remove irrelevant lines

      return {
        text: _.compact([dir, filepath]).join('/'),
        metricName: getMetricName(dir),
      }
    })
  )

  return occurrences.length === 0 ? [emptyMetric(getMetricName(dir))] : occurrences
}

export default { run }
