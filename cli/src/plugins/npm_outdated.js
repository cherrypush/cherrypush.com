import _ from 'lodash'
import { panic } from '../error.js'
import sh from '../sh.js'

const BASE_COMMAND = 'npm outdated --json'

const getCommands = (prefix) => {
  if (!prefix) return [{ prefix: '', command: BASE_COMMAND }]
  if (Array.isArray(prefix)) return prefix.map((p) => ({ prefix: p, command: `${BASE_COMMAND} --prefix ${p}` }))
  if (typeof prefix === 'string') return [{ prefix, command: `${BASE_COMMAND} --prefix ${prefix}` }]
  panic(`Invalid prefix: ${prefix}`)
}

const getMetricName = (prefix) => {
  const packageJsonPath = _.compact([prefix, 'package.json']).join('/')
  return `npm outdated dependencies (${packageJsonPath})`
}

const run = async ({ prefix }) => {
  let outdatedDependencies = []
  const commands = getCommands(prefix)

  await Promise.all(
    commands.map(async (command) => {
      try {
        const output = JSON.parse(await sh(command.command, { throwOnError: false }))
        if (output.error) panic(`${output.error.summary}\n${output.error.detail}`)

        Object.keys(output).forEach((dependencyName) =>
          outdatedDependencies.push({
            name: dependencyName,
            current: output[dependencyName].current,
            latest: output[dependencyName].latest,
            location: output[dependencyName].location,
            prefix: command.prefix,
          })
        )
      } catch (error) {
        panic(`An error happened while executing npm: ${error}\n- Make sure the 'npm outdated' command works`)
      }
    })
  )

  return outdatedDependencies.map((dependency) => ({
    text: `${dependency.name} (${dependency.current} -> ${dependency.latest})`,
    metricName: getMetricName(dependency.prefix),
  }))
}

export default { run }
