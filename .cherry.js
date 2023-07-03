module.exports = {
  project_name: 'cherrypush/cherry',
  plugins: ['rubocop', 'eslint', 'loc'],
  metrics: [
    {
      name: 'todo',
      pattern: /TODO:/i, // i for case insensitive
    },
    {
      name: 'fixme',
      pattern: /FIXME:/i,
    },
  ],
}
