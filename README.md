# Getting started

```sh
# clone the project
git clone git@github.com:cherrypush/cherry-app.git
cd cherry-app

# install dependencies
bundle install
npm install
```

If you have access to the Heroku project in production:

```
# add heroku production to your git remote
git remote add production https://git.heroku.com/cherrypush-production.git

# start postgres using brew
brew services start postgresql@14

# backup production database
production backup

# restore database from production
development restore production
```

If you DON'T have access to Heroku production, then you can use Docker.

In this case, your local database will have no initial data, but it's super simple:

```sh
docker compose up -d
```

Finally, you can launch your server with:

```sh
bin/dev
```
