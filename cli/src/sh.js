import child_process from 'child_process'
import { debug } from './log.js'

// From https://stackoverflow.com/a/68958420/9847645, to avoid 200Kb limit causing ENOBUFS errors for large output
const sh = (cmd, { throwOnError = true } = {}) =>
  new Promise((resolve, reject) => {
    debug('#', cmd)
    const [command, ...args] = cmd.split(/\s+/)
    const spawnedProcess = child_process.spawn(command, args)

    let data = ''
    let errorData = ''

    spawnedProcess.stdout.on('data', (chunk) => (data += chunk.toString()))
    spawnedProcess.stderr.on('data', (chunk) => (errorData += chunk.toString()))
    spawnedProcess.on('close', (code) => {
      if (throwOnError && code > 0) return reject(new Error(`${errorData} (Failed Instruction: ${cmd})`))
      debug(data)
      resolve(data)
    })
    spawnedProcess.on('error', (err) => reject(err))
  })

export default sh
