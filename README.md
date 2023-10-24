<h1 align="center">
  <a href="https://cherrypush.com">🍒 Cherry</a>
</h1>

<p align="center">
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/cherrypush/cherrypush.com/ci_tests.yml"/>
  <a href="https://www.npmjs.com/package/cherrypush"><img alt="Visit the NPM page" src="https://img.shields.io/npm/v/cherrypush"/></a>
  <a href="https://github.com/cherrypush/cherrypush.com/graphs/contributors"><img src="https://img.shields.io/github/commit-activity/m/cherrypush/cherrypush.com" alt="Commits per month"></a>
  <a href="https://twitter.com/intent/follow?screen_name=fwuensche">
    <img alt="Follow us on Twitter" src="https://img.shields.io/twitter/follow/fwuensche?style=social"/>
  </a>
</p>

<p align="center">
  <a href="https://oss.skylight.io/app/applications/670fP418RH7v"><img src="https://badges.skylight.io/problem/670fP418RH7v.svg" alt="View performance data on Skylight" /></a>
  <a href="https://oss.skylight.io/app/applications/670fP418RH7v"><img src="https://badges.skylight.io/typical/670fP418RH7v.svg" alt="View performance data on Skylight" /></a>
  <a href="https://oss.skylight.io/app/applications/670fP418RH7v"><img src="https://badges.skylight.io/rpm/670fP418RH7v.svg" alt="View performance data on Skylight" /></a>
</p>

<h3 align="center">
  <b><a href="https://cherrypush.com/docs">📄 read the docs</a></b>
  •
  <b><a href="https://github.com/cherrypush/cherrypush.com/discussions">🤔 ask a question</a></b>
  •
  <b><a href="https://github.com/cherrypush/cherrypush.com/issues">📣 report an issue</a></b>
</h3>

<br />

Cherry helps you track and manage your technical debt with minimal setup. You configure the codebase patterns you want
to track once. Cherry will then run on every commit and report the stats to your dashboard. It's really that simple.

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
```

> The env vars step above assumes you're using the rbenv-vars plugin. If you don't have it installed, check their docs
> [here](https://github.com/rbenv/rbenv-vars) or use an alternative method to load your environment variables.

## Running in production

You can either use Heroku or the `fwuensche/cherry` image from Docker Hub.

Note that, in both cases, you'll also need a running instance of Postgres and Redis.

<!-- TODO: update this command to reflect all recent changes to our infra
```
docker run \
  -e SECRET_KEY_BASE=<secret> \
  -e DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/<db_name> \
  cherrypush/cherrypush.com
``` -->

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

Big thanks to contributors 🙏

<a href="https://github.com/cherrypush/cherrypush.com/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=cherrypush/cherrypush.com" />
</a>

## Any further question or suggestion?

- report a bug via [GitHub Issues](https://github.com/cherrypush/cherrypush.com/issues)
- suggest new features via [GitHub Discussions](https://github.com/cherrypush/cherrypush.com/discussions)
- or shoot me a private message on [Twitter](https://twitter.com/messages/compose?recipient_id=38940653)
