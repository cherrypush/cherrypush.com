module.exports = {
  repo: 'cherrypush/cherry-app',
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
      name: 'rubocop',
      pattern: /rubocop:disable/,
    },
    {
      name: 'eslint',
      pattern: /eslint-disable/,
    },
  ],
}
