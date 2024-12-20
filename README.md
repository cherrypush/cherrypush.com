<h1 align="center">
  <a href="https://cherrypush.com">🍒 Cherry</a>
</h1>

<p align="center">
Cherry allows you to track your technical debt with minimal setup. You configure the codebase patterns you want to track
once. Cherry will then run on every commit and report the stats to your dashboard. It's that simple.
</p>

<p align="center">
  <a href="https://github.com/cherrypush/cherrypush.com/actions/workflows/ci_tests.yml"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/cherrypush/cherrypush.com/ci_tests.yml"/></a>
  <a href="https://www.npmjs.com/package/cherrypush"><img alt="Visit the NPM page" src="https://img.shields.io/npm/v/cherrypush"/></a>
  <a href="https://github.com/cherrypush/cherrypush.com/graphs/contributors"><img src="https://img.shields.io/github/commit-activity/m/cherrypush/cherrypush.com" alt="Commits per month"></a>
  <a href="https://twitter.com/intent/follow?screen_name=fwuensche"><img alt="Follow us on 𝕏" src="https://img.shields.io/twitter/follow/fwuensche?style=social"/></a>
</p>

<p align="center">
  <a href="https://oss.skylight.io/app/applications/670fP418RH7v"><img src="https://badges.skylight.io/problem/670fP418RH7v.svg" alt="View performance data on Skylight" /></a>
  <a href="https://oss.skylight.io/app/applications/670fP418RH7v"><img src="https://badges.skylight.io/typical/670fP418RH7v.svg" alt="View performance data on Skylight" /></a>
  <a href="https://oss.skylight.io/app/applications/670fP418RH7v"><img src="https://badges.skylight.io/rpm/670fP418RH7v.svg" alt="View performance data on Skylight" /></a>
</p>

<h3 align="center">
  <b><a href="https://cherrypush.com/docs">📄 Read the docs</a></b>
  •
  <b><a href="https://github.com/cherrypush/cherrypush.com/issues">📣 Report an issue</a></b>
</h3>

<br />

## Getting started

```sh
# clone the project
git clone git@github.com:cherrypush/cherry.git
cd cherry

# install dependencies
bundle install
npm install

# setup database
docker compose up -d
rails db:setup

# setup local env vars
cp .rbenv-vars.template .rbenv-vars

# launch the server
bin/dev

# populate the database
npm install -g cherrypush
API_URL=http://localhost:3001/api cherry push --api-key=00000000-0000-0000-0000-000000000000
```

> The env vars step above assumes you're using the rbenv-vars plugin. If you don't have it installed, check their docs
> [here](https://github.com/rbenv/rbenv-vars) or use an alternative method to load your environment variables.

## Contributing

In addition to the above-mentioned docs, a great way to get started is to watch some of the live sessions below. This
should give you insights on how to navigate the codebase and start contributing.

Cherry CLI (JavaScript):

- Add support for array of globs: https://youtu.be/zPrVUFDcQ5Y
- Sort results of cherry run: https://youtu.be/ZjJqDBLbM-E

Cherry App (Ruby on Rails):

- Add a new API endpoint + controller tests: https://youtu.be/vh1bCTe16Bs
- Fixing N+1 queries on metrics#index: https://youtu.be/isqa9r0SpsA
- Fixing N+1 queries on dashboards#index: https://youtu.be/vcGpfbLuliA

And here's a list of tasks that are great for first-time contributors:

- Remove the "watch" feature from metrics as this is not generally used
- Address TODO comments in the codebase

## Any further question or suggestion?

- Report a bug via [GitHub Issues](https://github.com/cherrypush/cherrypush.com/issues)
