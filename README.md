# Getting started

```sh
# clone the project
git clone git@github.com:cherrypush/cherry-app.git
cd cherry-app

# install dependencies
bundle install
npm install

# restore database from production
production backup
development restore production
```

# Usage

Start required services

```sh
brew services start postgresql@14
# or if using docker
docker compose up -d
```

```sh
bin/dev
```
