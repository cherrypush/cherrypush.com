import { panic } from '../error.js'
import sh from '../sh.js'

const run = async () => {
  const out = await sh('rubocop --format=json', { throwOnError: false })
  let report
  try {
    report = JSON.parse(out)
  } catch (error) {
    panic(
      'An error happened while executing rubocop\n- Make sure the `rubocop` command works\n- Make sure to `bundle install` if you are using bundler'
    )
  }

  return report.files
    .filter((file) => file.offenses.length)
    .flatMap((file) =>
      file.offenses.map((offense) => ({
        text: `${file.path}:${offense.location.line}`,
        filePath: file.path,
        metricName: `[rubocop] ${offense.cop_name}`,
      }))
    )
}

export default { run }
