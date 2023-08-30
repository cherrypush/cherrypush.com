import { Grid } from '@mui/material'
import { Card, Sidebar } from 'flowbite-react'
import useCurrentUser from '../hooks/useCurrentUser'

const DocsPage = () => {
  const { user } = useCurrentUser()

  return (
    <div className="container">
      <h1>Docs</h1>
      <Card>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <div className="border rounded mb-6 md:border-none md:h-screen md:sticky md:top-0">
              <Sidebar className="w-full">
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="#installation">Initial setup ⚡️</Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="#commands">CLI commands 😌</Sidebar.Item>
                  <Sidebar.Item href="#cherry-init" className="text-sm ml-3">
                    · cherry init
                  </Sidebar.Item>
                  <Sidebar.Item href="#cherry-run" className="text-sm ml-3">
                    · cherry run
                  </Sidebar.Item>
                  <Sidebar.Item href="#cherry-push" className="text-sm ml-3">
                    · cherry push
                  </Sidebar.Item>
                  <Sidebar.Item href="#cherry-backfill" className="text-sm ml-3">
                    · cherry backfill
                  </Sidebar.Item>
                  <Sidebar.Item href="#cherry-diff" className="text-sm ml-3">
                    · cherry diff
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="#integrations">Integrations 🧩</Sidebar.Item>
                  <Sidebar.Item href="#github-actions" className="text-sm ml-3">
                    · GitHub Actions
                  </Sidebar.Item>
                  <Sidebar.Item href="#gitlab-cicd" className="text-sm ml-3">
                    · GitLab CI/CD
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="#demo">Live demo 🔴</Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar>
            </div>
          </Grid>

          <Grid item xs={12} md={8}>
            <div className="prose dark:prose-invert w-full max-w-full py-4 pr-3">
              <h1 id="installation">Initial setup ⚡️</h1>
              <p>Install the CLI globally with:</p>
              <pre>npm install -g cherrypush</pre>
              <p>Inside the root of your project, initialize your cherry configuration:</p>
              <pre>cherry init</pre>
              <p>Add your API key into a .env file at the root of your project:</p>
              <pre>
                CHERRY_API_KEY=
                {user ? (
                  user.api_key
                ) : (
                  <a className="text-white" href="/user/settings">
                    find-your-api-key-here
                  </a>
                )}
              </pre>
              {user && <p>🚨 This is your real API key. Keep it safe.</p>}

              <hr />
              <h1 id="commands">CLI commands 😌</h1>
              <h2 id="cherry-init">cherry init</h2>
              <p>
                The init command will initialize your config file `.cherry.js` and create a sample GitHub workflow file
                that you can use to integrate Cherry to your CI/CD workflow via GitHub Actions.
              </p>
              <p>A very minimal config file can look something like this:</p>
              <pre>{`module.exports = {
  project_name: 'PROJECT_NAME',
  plugins: ['loc'],
  metrics: [
    {
      name: 'TODO/FIXME',
      pattern: /(TODO|FIXME):/i, // the i flag makes the regex case insensitive
    },
  ],
}
`}</pre>
              <p>
                For more info about CI/CD integration, refer to the <a href="#integrations">Integrations</a> section
                below.
              </p>
              <h2 id="cherry-run">cherry run</h2>
              <p>The run command accepts a couple of different options:</p>
              <pre>{`cherry run [--metric=<metric>] [--owner=<owners>]`}</pre>
              <p>When used without options, it logs ALL metric stats for your project:</p>
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
              <p>To filter metrics, you can combine the different options such as:</p>
              <pre>{`cherry run --metric="Skipped tests"`}</pre>
              <pre>{`cherry run --owner=@fwuensche,@rchoquet`}</pre>
              <pre>{`cherry run --metric="Skipped tests" --owner=@fwuensche,@rchoquet`}</pre>
              <h2 id="cherry-push">cherry push</h2>
              <p>{`Your most used command. It submits current project stats to cherrypush.com:`}</p>

              <pre>{`$ cherry push
Uploading 42 occurrences...
Response: { status: 'ok' }
Your dashboard is available at https://www.cherrypush.com/user/projects
`}</pre>
              <h2 id="cherry-backfill">cherry backfill</h2>
              <p>Totally optional. This will submit your historic data to cherrypush.com:</p>
              <pre>{`cherry backfill [--since=<date>] [--until=<date>] [--interval=<days>]`}</pre>
              <ul>
                <li>
                  <b>--since</b> will default to a month ago
                </li>
                <li>
                  <b>--until</b> will default to today
                </li>
                <li>
                  <b>--interval</b> will default to 1 day
                </li>
              </ul>
              <p>Use the options to customize the dates you want to generate reports for:</p>
              <pre>cherry backfill --since=2023-01-01 --until=2022-01-07</pre>
              <p>If the range is too wide, increase your interval to save time:</p>
              <pre>cherry backfill --since=2023-01-01 --until=2023-12-01 --interval=30</pre>
              <h2 id="cherry-diff">cherry diff</h2>
              <p>
                You can run this command directly in your terminal to compare the current status of a certain metric to
                the last reported status on cherrypush.com.
              </p>
              <pre>cherry diff --metric="JS lines of code"</pre>
              <p>
                This command is specifically useful when you want to enforce blocking certain patterns in your codebase.
              </p>
              <p>
                It will check the diff between the current commit and the previous one. If there is an increase in your
                metric, it will raise an error, making the CI build fail.
              </p>
              <pre>{`name: Block the introduction of new violations

on:
  pull_request:

jobs:
  cherry_diff:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Install dependencies
        run: npm i -g cherrypush

      - name: Raise if new JS code added
        run: ./cli/bin/cherry.js diff --metric='todo' --api-key=\${{ secrets.CHERRY_API_KEY }} --error-if-increase
`}</pre>

              <hr />
              <h1 id="integrations">Integrations 🧩</h1>
              <h2 id="github-actions">GitHub Actions</h2>
              <p>You can automate Cherry to submit reports on every commit to master.</p>
              <p>For a basic use case, all you need is a workflow file as below:</p>
              <pre>{`# .github/workflows/cherry_push.yml

name: Track codebase metrics

on:
  push:
    branches:
      - main

jobs:
  cherry_push:
    runs-on: ubuntu-latest
    env:
      CHERRY_API_KEY: \${{ secrets.CHERRY_API_KEY }}

    steps:
      - name: Checkout project
        uses: actions/checkout@v3
        with:
          fetch-depth: 2 // required to track contributions, i.e, the diff between commits

      - name: Install cherry
        run: npm i -g cherrypush

      - name: Push metrics
        run: cherry push --api-key=\${{ secrets.CHERRY_API_KEY }}`}</pre>
              <h2 id="gitlab-cicd">GitLab CI/CD</h2>
              <p>Same as with GitHub Actions, but for GitLab. A minimalist example:</p>
              <pre>{`# .gitlab-ci.yml

cherry_push:
  stage: build
  image: node:latest
  variables:
    CHERRY_API_KEY: $CHERRY_API_KEY

  script:
    - npm i -g cherrypush
    - git checkout $CI_COMMIT_REF_NAME
    - cherry push

  only:
    refs:
      - main`}</pre>

              <hr />
              <h1 id="demo">Live demo 🔴</h1>
              <p>
                To see what Cherry looks like in a real project, you can refer to our own project here:{' '}
                <a href="https://www.cherrypush.com/demo">https://www.cherrypush.com/demo</a>
              </p>
              <p>
                Found a bug? Report directly to me via{' '}
                <a target="_blank" href="https://twitter.com/@fwuensche">
                  Twitter
                </a>{' '}
                or{' '}
                <a target="_blank" href="mailto:flavio@cherrypush.com">
                  email
                </a>
                .
              </p>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default DocsPage
