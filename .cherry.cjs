const JS_FILES = 'app/**/*.{js,jsx}'
const TS_FILES = 'app/**/*.{ts,tsx}'

module.exports = {
  project_name: 'cherrypush/cherrypush.com',
  plugins: {
    npmOutdated: {},
    loc: {},
    eslint: {},
    rubocop: {},
    jsCircularDependencies: { include: 'app/javascript/**' },
    jsUnimported: {},
  },
  metrics: [
    {
      name: '[TS Migration] JS loc',
      include: JS_FILES,
      groupByFile: true,
    },
    {
      name: '[TS Migration] TS loc',
      include: TS_FILES,
      groupByFile: true,
    },
    {
      name: 'TODO/FIXME',
      pattern: /(TODO|FIXME)/i,
    },
  ],
}
