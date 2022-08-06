<h1 align="center">Welcome to NextRetreat Flights API 👋</h1>
<p></p>

## Getting started

### Installation - Docker

1. install [Docker](https://www.docker.com/products/docker-desktop) app
2. `git clone` the project
3. `cp .env-example .env` and fill in your environment variables

   - `PORT` needs to be the same as the one in `Dockerfile` after `EXPOSE`
   - the format for postgres connection string is this: `postgresql://[user[:password]@][netloc][:port][/dbname]` and you can find `user`, `password` and `dbname` in `docker-compose.yml` file in `environment` section
   - for `netloc`, if you want to connect to local DB running in Docker use `docker.for.mac.host.internal`

4. run `docker-compose up --build` to start the app

### Connecting to local DB - Docker

Docker maps ports in the container to ports on your local machine. In order to connect to the local database that is running in Docker container through a GUI (e.g. [TablePlus](https://tableplus.com/)) use the values from your environment variables:

- for host use `localhost`
- for port use `5433`
- for user, password and database name, use values from the connection string in your `.env` file (based on the instructions in Installation section)

### Troubleshooting Docker

If there is a new dependency added to backend, the Docker might need a hard reset.
If the local backend is not working after an update, follow these steps:

1. shut down `docker-compose` process
2. `docker-compose rm` to remove the stopped containers
3. `docker-compoe up --build` to build and start the containers once again

### Adding new DB migration

To add a new migration, run `npx knex migrate:make add_column --knexfile config/db.js`
