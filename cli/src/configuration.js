import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { guessProjectName } from './git.js'

export const CONFIG_FILE_LOCAL_PATH = '.cherry.js'
export const WORKFLOW_FILE_LOCAL_PATH = '.github/workflows/cherry_push.yml'

export const CONFIG_FILE_FULL_PATH = `${process.cwd()}/${CONFIG_FILE_LOCAL_PATH}`
export const WORKFLOW_FILE_FULL_PATH = `${process.cwd()}/${WORKFLOW_FILE_LOCAL_PATH}`

const CONFIG_TEMPLATE_PATH = dirname(fileURLToPath(import.meta.url)) + '/templates/.cherry.js.template'
const WORKFLOW_TEMPLATE_PATH = dirname(fileURLToPath(import.meta.url)) + '/templates/.cherry_push.yml.template'

export const createConfigurationFile = (projectName) =>
  fs.writeFileSync(
    CONFIG_FILE_FULL_PATH,
    fs.readFileSync(CONFIG_TEMPLATE_PATH).toString().replace('PROJECT_NAME', projectName)
  )

export const createWorkflowFile = () => {
  fs.mkdirSync(`${process.cwd()}/.github/workflows`, { recursive: true })
  fs.writeFileSync(WORKFLOW_FILE_FULL_PATH, fs.readFileSync(WORKFLOW_TEMPLATE_PATH).toString())
}

export const configurationExists = () => fs.existsSync(CONFIG_FILE_FULL_PATH)
export const workflowExists = () => fs.existsSync(WORKFLOW_FILE_FULL_PATH)

export const getConfiguration = async () => {
  if (!configurationExists()) {
    const guessedProjectName = await guessProjectName()
    console.log('ℹ️  No .cherry.js file found, using default configuration...')
    return { project_name: guessedProjectName, plugins: ['loc'] }
  }

  return (await import(CONFIG_FILE_FULL_PATH)).default
}
