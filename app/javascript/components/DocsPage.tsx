import React from 'react'
import useCurrentUser from '../hooks/useCurrentUser'

const DocsPage = () => {
  const { user } = useCurrentUser()

  return (
    <div className="container prose dark:prose-invert">
      <h1>Easy installation 😌</h1>
      <pre>npm install -g cherrypush</pre>
      <p>Create your .cherry.js configuration file:</p>
      <pre>cherry init</pre>
      <p>Add your API key into a .env file at the root of your project:</p>
      <pre>
        CHERRY_API_KEY=
        {user ? (
          `${user.api_key} <== This is your real API key, keep it safe.`
        ) : (
          <a className="text-white" href="/user/settings">
            find-your-api-key-here
          </a>
        )}
      </pre>

      <h1>Running commands 🏃🏻‍♂️</h1>
      <h2>cherry run</h2>
      <p>Outputs stats for current commit. Useful for debugging your config file.</p>
      <pre>
        {`$ cherry run
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│  todo   │   16   │
│  fixme  │   12   │
│ rubocop │    1   │
│ eslint  │   13   │
└─────────┴────────┘`}
      </pre>
      <p>You can also filter occurrences by metrics and owners:</p>
      <pre>cherry run --metric=eslint --owner=@fwuensche,@rchoquet</pre>
      <h2>cherry push</h2>
      <p>Submits stats to cherrypush.com:</p>

      <pre>{`$ cherry push
Uploading 42 occurrences...
Response: { status: 'ok' }
Your dashboard is available at https://www.cherrypush.com/user/projects
`}</pre>
      <h2>cherry backfill</h2>
      <p>Submits historic data to cherrypush.com:</p>
      <pre>$ cherry backfill --since=2023-01-01</pre>
      <p>If you want to limit to a certain date range you can provide an additional param:</p>
      <pre>$ cherry backfill --since=2023-01-01 --until=2022-01-07</pre>
      <p>If the date range is too wide, you might want to set a custom interval (defaults to 1 day):</p>
      <pre>$ cherry backfill --since=2023-01-01 --until=2023-12-01 --interval=30</pre>
      <h1>Automatically upload stats via GitHub Actions</h1>
      <p>You can easily automate Cherry to submit reports on every commit to master.</p>
      <pre>{`# .github/workflows/cherry_push.yml

name: Cherry push

on:
  push:
    branches:
      - master

jobs:
  cherry:
    name: runner / cherry
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Install cherry
        run: npm i -g cherrypush
      - name: Push metrics
        run: cherry push --api-key=\${{ secrets.CHERRY_API_KEY }}`}</pre>
      <h1>Live demo 🔴</h1>
      <p>
        Here you can watch a <a href="https://www.cherrypush.com/demo">live demo</a> of the product.
      </p>
      <p>
        Found a bug? Report to us on Twitter: <a href="https://twitter.com/@fwuensche">@fwuensche</a> or{' '}
        <a href="https://twitter.com/@r_chqt">@r_chqt</a>
      </p>
    </div>
  )
}

export default DocsPage
