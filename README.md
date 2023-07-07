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
