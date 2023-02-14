module.exports = {
  project_name: 'cherrypush/cherry-app',
  plugins: ['rubocop'],
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
