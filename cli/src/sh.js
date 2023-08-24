import child_process from 'child_process'
import { debug } from './log.js'

// From https://stackoverflow.com/a/68958420/9847645, to avoid 200Kb limit causing ENOBUFS errors for large output
const sh = (cmd, { throwOnError = true } = {}) =>
  new Promise((resolve, reject) => {
    debug('#', cmd)
    const [command, ...args] = cmd.split(/\s+/)
    const spawnedProcess = child_process.spawn(command, args)

    let stdout = ''
    let stderr = ''

    spawnedProcess.stdout.on('data', (chunk) => (stdout += chunk.toString()))
    spawnedProcess.stderr.on('data', (chunk) => (stderr += chunk.toString()))
    spawnedProcess.on('close', (code) => {
      if (throwOnError && code > 0) return reject(new Error(`${stderr} (Failed Instruction: ${cmd})`))
      debug(stdout)
      resolve({ stderr, stdout })
    })
    spawnedProcess.on('error', (err) => reject(err))
  })

export default sh
