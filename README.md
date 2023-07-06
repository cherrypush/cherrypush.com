# Getting started

```sh
# clone the project
git clone git@github.com:cherrypush/cherry-app.git
cd cherry-app

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
