import glob from 'glob'
import madge from 'madge'

const run = async ({ include, tsConfig }) => {
  const paths = glob.sync(include)

  const madgeConfig = { tsConfig } // https://github.com/pahen/madge#configuration
  const madgeResult = await madge(paths, madgeConfig)
  const dependencies = madgeResult.circular()

  return dependencies.map((files) => ({
    text: files.join(' > '),
    filePath: files[0],
    metricName: `JS circular dependencies`,
  }))
}

export default { run }
