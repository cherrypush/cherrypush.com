const JS_FILES = 'app/**/*.{js,jsx}'
const TS_FILES = 'app/**/*.{ts,tsx}'

module.exports = {
  project_name: 'cherrypush/cherry',
  plugins: {
    npmOutdated: { prefix: ['', 'cli'] },
    loc: {},
    eslint: {},
    rubocop: {},
    jsCircularDependencies: { include: 'app/javascript/**' },
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
  ],
}
