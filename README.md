# Installation

```sh
npm install -g cherrypush
```

# Usage

Set up a .cherry.js config file inside your project.

```sh
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
```

Run the script locally. Useful for debugging your config file.

```sh
cherry run
```

```json
[
  {
    "commit_sha": "master",
    "file_path": "bin/cherry.js",
    "line_number": 8,
    "line_content": "const API_BASE_URL = 'http://localhost:3000/api' // TODO: convert to production url",
    "repo": "cherrypush/cherry-cli",
    "owners": [],
    "metric_name": "todos"
  }
]
```

Submit the latest occurrences to your cherry server.

```sh
cherry push
```

```sh
Uploading 12 occurrences...
Response: { status: 'ok' }
```
