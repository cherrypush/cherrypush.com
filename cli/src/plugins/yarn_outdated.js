import { panic } from '../error.js'
import sh from '../sh.js'

const run = async ({}) => {
  let outdatedDependencies = []
  let output = ''

  try {
    output = await sh('yarn outdated', { throwOnError: false })
  } catch (error) {
    panic(`An error happened while executing yarn: ${error}\n- Make sure the 'npm outdated' command works`)
  }

  output.split('\n').forEach((line) => {
    const [name, current, wanted, latest, type, url] = line.split(/\s+/)
    if (name === 'Package') return // remove header
    if (!name || !current || !wanted || !latest || !type || !url) return // remove irrelevant lines
    outdatedDependencies.push({ name, current, wanted, latest, type, url })
  })

  return outdatedDependencies.map((dependency) => ({
    text: `${dependency.name} (${dependency.current} -> ${dependency.latest})`,
    metricName: 'yarn outdated dependencies',
  }))
}

export default { run }
