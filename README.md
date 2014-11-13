Bttendance
=================
Bttendance a is Bluetooth-based attendance check and "Smart TA" application, established 2013/11/01.

This app uses Sails.js as framework and vanilla JavaScript as its primary development language.

## Guidelines
#### Models
- Attribute names are writen in camel case.
- Models are associated via a [Waterline](https://github.com/balderdashy/waterline) association.

#### API
- API Schema: 'api/:controller/:action' (ex: 'api/user/signup')
- Every API requires email (as parameter), password (as form data)

#### Socket & Session
- Socket & Seesion are using Redis Database

## Installation & Usage
#### Install & Run
    // Pull down the repo
    $ git clone https://github.com/Bttendance/Bttendance-NodeJS.git

    // Install Sails globally
    $ sudo npm install -g sails

    // Install Bttendance dependencies
    $ npm install

    // Start the server
    $ sails lift

#### Install Postgres/Redis
    $ brew update
    $ brew doctor
    $ brew install postgresql redis

    // Start local Postgres/Redis server at boot
    $ ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
    $ ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents

    // Launch server now (without reboot)
    $ launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
    $ launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist

#### Get a backup of a Bttendance database
    // Assuming you have access to Bttendance on Heroku
    1. Go to [HerokuPostgres](https://postgres.heroku.com/databases/) and select the Bttendance database you want a copy of
    2. Scroll down to snapshots and download a copy of the latest database snapshot (xxxx.dump)

#### Configure Postgres
    // Connect to local postgres database (automatically created on install)
    $ psql postgres

    // Create the bttendance role and database and exit psql prompt
    postgres=# CREATE DATABASE bttendance;
    postgres=# \q

    // Restore from dump with options (ignore warnings generated by --no-owner)
    $ pg_restore --verbose --clean --no-acl --no-owner -d bttendance <path to DB dump downloaded above>

    // Edit .bash_profile (will create if it doesn't exist)
    $ vi ~/.bash_profile

    // Add following aliases to .bash_profile for quick starting/stopping of the Postgres server:
    alias pgs='pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start'
    alias pgq='pg_ctl -D /usr/local/var/postgres stop -s -m fast'

#### Configure development database connection settings
``` javascript
// Add the following to config/local.js and fill in the following information
// This will be the database connection settings used for local development
// The values shown below are defaults for the local DB created above

module.exports = {
  connections: {
    postgresDevelopment: {
      module: 'sails-postgresql',
      host: 'localhost',
      port: 5432,
      database: 'bttendance'
    },
  }
}
```

#### NPM commands
    // Removes extraneous NPM modules
    $ sudo npm prune

    // Hard removes all NPM modules
    $ rm -rf node_modules

    // Uninstall Sails globally
    $ sudo npm uninstall -g sails

    // Show global Sails version
    $ npm view sails version

#### Node & Sails commands
    // Start the app with vanilla Node.js
    $ node app.js
    $ node app.js —prod --port 7331

    // Start the app with Sails (identical)
    $ sails lift
    $ sails lift --prod --port 7331

    // Start the app and keep it running
    $ forever start -c nodemon app.js
    $ forever start -c nodemon app.js —prod —port 7331

#### Heroku commands
    // View Heroku instance logs (add --tail option for real-time log streaming to console)
    $ heroku logs —app bttendance-dev
    $ heroku logs —app bttendance

    // Add heroku-accounts plugin and create/set Heroku account automatically
    // Note: "Account nickname" is irrelevant, it can be whatever you want
    $ heroku plugins:install git://github.com/ddollar/heroku-accounts.git
    $ heroku accounts:add <account nickname> --auto
    $ heroku accounts:set <account nickname>

#### Postgres (psql) commands
    // Connect to local Bttendance DB
    $ psql bttendance

    // Connect to a remote DB (prod, dev, etc)
    $ psql <db_url, e.g. postgres://...>

    // List databases on current server
    $ \list

    // List tables in currently-selected database
    $ \dt

    // List Postgres users on current machine
    $ \du

    // Exit psql prompt
    $ \q

#### Redis (redis-cli) commands
    // Connect to local redis-server instance
    $ redis-cli

    // Connect to a remote redis instance
    $ redis-cli <db_url, e.g. redis://...>

    // List all key/value pairs
    $ KEYS *

    // Get value for a specific key
    $ GET <key name>

#### Git commands
    // List local and remote branches
    $ git branch -a

    // List remote repository connections
    $ git remote

    // Add Heroku Git repositories (enables use of Heroku CLI tools within the project)
    $ git remote add bttendance-dev git@heroku.com:bttendance-dev.git
    $ git remote add bttendance git@heroku.com:bttendance.git

    // Push changes to main Git repository
    $ git push origin master

    // Heroku deployment commands -- USE WITH CARE
    $ git push bttendance-dev master
    $ git push bttendance master

## Developer

#### The Finest Artist
- Email: thefinestartist@bttendance.com
- Phone: +82-10-7755-4400

#### Copyright 2014 @Bttendance Inc.
