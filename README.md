# Cherry

## Getting started

```sh
# clone the project
git clone git@github.com:cherrypush/cherry.git
cd cherry

# install dependencies
bundle install
npm install
```

Start your database:

```bash
docker compose up -d
rails db:setup
```

Setup your local env vars:

```bash
cp .rbenv-vars.template .rbenv-vars
```

> If you don't have rbenv-vars plugin, check the docs here: https://github.com/rbenv/rbenv-vars

Finally, you can launch your server with:

```sh
bin/dev
```

## Running in Production

The current stack is :

- a PostgreSQL database
- the cherry app itself

### Using Docker

Use the `cherrypush/cherry` image. You will need a running instance of Postgres.

```
docker run \
  -e SECRET_KEY_BASE=<secret> \
  -e DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/<db_name> \
  cherrypush/cherry
```

## Contributing

The best way to get started is by watching some of the live sessions where we implement together some of the Cherry
features that you currently use in production.

#### Cherry CLI (JavaScript)

- Add support for array of globs: https://youtu.be/zPrVUFDcQ5Y
- Sort results of cherry run: https://youtu.be/ZjJqDBLbM-E

#### Cherry App (Ruby on Rails)

- Add a new API endpoint + controller tests: https://youtu.be/vh1bCTe16Bs

## Any questions or suggestions?

Just shoot me a message on Twitter 🐥 [@fwuensche](https://twitter.com/intent/user?screen_name=fwuensche)
