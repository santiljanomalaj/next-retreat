<h1 align="center">Welcome to NextRetreat API 👋</h1>
<p></p>

## Getting started

### Installation - Docker

1. install [Docker](https://www.docker.com/products/docker-desktop) app
2. `git clone` the project
3. `cp .env-example .env` and fill in your environment variables

   - `PORT` needs to be the same as the one in `Dockerfile` after `EXPOSE`
   - the format for postgres connection string is this: `postgresql://[user[:password]@][netloc][:port][/dbname]` and you can find `user`, `password` and `dbname` in `docker-compose.yml` file in `environment` section
   - for `netloc`, use the name of the database service in `docker-compose.yml` file
   - `port` for postgresql is `5432`

4. run `docker-compose up --build` to start the app

### Connecting to local DB - Docker

Docker maps ports in the container to ports on your local machine. In order to connect to the local database that is running in Docker container through a GUI (e.g. [TablePlus](https://tableplus.com/)) use the values from your environment variables:

- for host use `localhost`
- for port use `5432`
- for user, password and database name, use values from the connection string in your `.env` file (based on the instructions in Installation section)

### Troubleshooting Docker

If there is a new dependency added to backend, the Docker might need a hard reset.
If the local backend is not working after an update, follow these steps:

1. shut down `docker-compose` process
2. `docker-compose rm` to remove the stopped containers
3. `docker-compose up --build` to build and start the containers once again

### Adding new DB migration

To add a new migration, run `npx knex migrate:make add_column --knexfile config/db.js`

### Running migrations

When the database structure gets updated, so do the migrations. Here are the steps you need to take to migrate to the latest database structure.

1. Change the `db` part in `POSTGRES_CONNECTION_STRING` environment variable to `localhost`
2. `npm run db:migrate:latest`
3. `npm run db:seed`
4. if you have errors, you might need to `npm run db:recreate`, but be careful, because this recreates the database from scratch and you might lose your saved data!

### Running specific seed

1. Go to seeds folder `cd seeds`
2. `npx knex seed:run --specific=00_seed_name.js --knexfile ../config/db.js`