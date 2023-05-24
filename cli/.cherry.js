export default {
  project_name: 'cherrypush/cherry-cli',
  plugins: ['loc'],
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
