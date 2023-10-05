// eslint-disable-next-line @typescript-eslint/no-var-requires -- commonjs file (we need the `module` keyword)
const esbuild = require('esbuild')

// https://stackoverflow.com/questions/17581830/load-node-js-module-from-string-in-memory
function requireFromString(src, filename) {
  const Module = module.constructor
  const m = new Module()
  m._compile(src, filename)
  return m.exports
}

function buildAndImport(filename) {
  const output = esbuild.buildSync({
    entryPoints: [filename],
    platform: 'node',
    bundle: true,
    write: false,
  })

  return requireFromString(output.outputFiles[0].text, filename)
}

module.exports = buildAndImport
