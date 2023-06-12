import { panic } from '../error.js'
import sh from '../sh.js'

const run = async () => {
  const out = await sh(
    './node_modules/eslint/bin/eslint.js . --format=json --ext .js,.jsx,.ts,.tsx --no-inline-config',
    {
      throwOnError: false,
    }
  )
  let files
  try {
    files = JSON.parse(out)
  } catch (error) {
    panic('An error happened while executing eslint\n- Make sure eslint is properly installed')
  }

  return files
    .filter((file) => file.errorCount > 0)
    .flatMap((file) =>
      file.messages.map((message) => ({
        text: `${file.filePath}:${message.line}`,
        filePath: file.filePath,
        metricName: `[eslint] ${message.ruleId}`,
      }))
    )
}

export default { run }
