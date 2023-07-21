const JS_FILES = 'app/**/*.{js,jsx}'
const TS_FILES = 'app/**/*.{ts,tsx}'

module.exports = {
  project_name: 'cherrypush/cherry',
  plugins: ['rubocop', 'eslint', 'loc'],
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
