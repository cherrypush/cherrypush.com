import glob from 'glob'
import madge from 'madge'

const run = async ({ include }) => {
  const paths = glob.sync(include)
  const madgeResult = await madge(paths)
  const dependencies = madgeResult.circular()

  return dependencies.map((files) => ({
    text: files.join(' > '),
    filePath: files[0],
    metricName: `JS circular dependencies`,
  }))
}

export default { run }
