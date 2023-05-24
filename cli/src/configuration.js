import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { guessProjectName } from './git.js'

export const CONFIG_FILE_NAME = '.cherry.js'

export const CONFIG_FILE_FULL_PATH = `${process.cwd()}/${CONFIG_FILE_NAME}`
const TEMPLATE_PATH = dirname(fileURLToPath(import.meta.url)) + '/../.cherry.js.template'

export const createConfigurationFile = (projectName) =>
  fs.writeFileSync(
    CONFIG_FILE_FULL_PATH,
    fs.readFileSync(TEMPLATE_PATH).toString().replace('PROJECT_NAME', projectName)
  )

export const configurationExists = () => fs.existsSync(CONFIG_FILE_FULL_PATH)

export const getConfiguration = async () => {
  if (!configurationExists()) {
    const guessedProjectName = await guessProjectName()
    console.log('ℹ️  No .cherry.js file found, using default configuration...')
    return { project_name: guessedProjectName, plugins: ['loc'] }
  }

  return (await import(CONFIG_FILE_FULL_PATH)).default
}
