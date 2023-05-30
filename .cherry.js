module.exports = {
  project_name: 'cherrypush/cherry',
  plugins: ['rubocop', 'eslint', 'loc'],
  metrics: [
    {
      name: 'todo',
      pattern: /TODO:/i, // the i flag makes the regex case insensitive
    },
    {
      name: 'fixme',
      pattern: /FIXME:/i,
    },
    {
      name: 'eslint',
      pattern: /eslint-disable/,
    },
  ],
}
