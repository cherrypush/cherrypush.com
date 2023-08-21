import { panic } from '../error.js'
import sh from '../sh.js'

const run = async () => {
  let outdated

  try {
    outdated = JSON.parse(await sh('npm outdated --json', { throwOnError: false }))
  } catch (error) {
    panic('An error happened while executing npm\n- Make sure the `npm outdated` command works')
  }

  outdated = Object.keys(outdated).map((key) => ({
    name: key,
    current: outdated[key].current,
    latest: outdated[key].latest,
    location: outdated[key].location,
  }))

  return outdated.map((dependency) => ({
    text: `${dependency.name} (${dependency.current} -> ${dependency.latest})`,
    metricName: `[outdated] node dependencies`,
  }))
}

export default { run }
