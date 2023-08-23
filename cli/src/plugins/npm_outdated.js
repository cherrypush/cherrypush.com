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
        const { stdout } = await sh(command.command, { throwOnError: false })
        const response = JSON.parse(stdout)
        if (response.error) panic(`${response.error.summary}\n${response.error.detail}`)

        Object.keys(response).forEach((dependencyName) =>
          outdatedDependencies.push({
            name: dependencyName,
            current: response[dependencyName].current,
            latest: response[dependencyName].latest,
            location: response[dependencyName].location,
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
