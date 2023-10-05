import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import buildAndImport from './build-and-import.cjs'
import { guessProjectName } from './git.js'

export const CONFIG_FILE_LOCAL_PATHS = ['.cherry.js', '.cherry.ts']
export const WORKFLOW_FILE_LOCAL_PATH = '.github/workflows/cherry_push.yml'

export const CONFIG_FILE_FULL_PATHS = CONFIG_FILE_LOCAL_PATHS.map((filePath) => `${process.cwd()}/${filePath}`)
export const WORKFLOW_FILE_FULL_PATH = `${process.cwd()}/${WORKFLOW_FILE_LOCAL_PATH}`

const CONFIG_TEMPLATE_PATH = dirname(fileURLToPath(import.meta.url)) + '/templates/.cherry.js.template'
const WORKFLOW_TEMPLATE_PATH = dirname(fileURLToPath(import.meta.url)) + '/templates/.cherry_push.yml.template'

export const createConfigurationFile = (projectName) =>
  fs.writeFileSync(
    CONFIG_FILE_FULL_PATHS[0],
    fs.readFileSync(CONFIG_TEMPLATE_PATH).toString().replace('PROJECT_NAME', projectName)
  )

export const createWorkflowFile = () => {
  fs.mkdirSync(`${process.cwd()}/.github/workflows`, { recursive: true })
  fs.writeFileSync(WORKFLOW_FILE_FULL_PATH, fs.readFileSync(WORKFLOW_TEMPLATE_PATH).toString())
}

export const getConfigurationFile = () => CONFIG_FILE_FULL_PATHS.find((filePath) => fs.existsSync(filePath))
export const workflowExists = () => fs.existsSync(WORKFLOW_FILE_FULL_PATH)

export const getConfiguration = async () => {
  const configurationFile = getConfigurationFile()
  if (!configurationFile) {
    const guessedProjectName = await guessProjectName()
    console.log('ℹ️  No .cherry.js file found, using default configuration...')
    return { project_name: guessedProjectName, plugins: ['loc'] }
  }

  const imported = buildAndImport(configurationFile)

  // Allow both syntaxes on configuration files:
  // - module.exports = ...
  // - export default ...   => will be wrapped in a { default } after being processed by buildAndImport
  return imported.default ?? imported
}
