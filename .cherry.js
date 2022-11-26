module.exports = {
  repo: 'cherrypush/cherry-cli',
  metrics: [
    {
      name: 'todos',
      pattern: /TODO:/,
    },
    {
      name: 'rubocop',
      pattern: /rubocop:disable/,
    },
  ],
}
