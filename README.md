# Shift Planner
FundedYouth Public Tool for Setting Schedules and Shifts

## API
Used the FundedYouth API for Account Management

## Structure and Local Testing

## Setting up Docker

1. Update files based on your CPU
2. Change your `.env.example` to `.env` and add your MariaDB credentials
3. Setup your docker environment with Docker Compose
4. Make sure Litespeed Web Server is running in Docker
5. Open a browser: `http://localhost/api/` - If everything is configured correctly you should see:

```json
{ "msg": "Connected" }
```

### Updating files for AMD

This repository was developed with ARM based CPUs in mind. If you have an AMD CPU then you will have to make the following changes.

In `Dockerfile` change:

```
FROM ghcr.io/ndigitals/openlitespeed:latest
```

to

```
FROM litespeedtech/openlitespeed:latest
```

In `docker-compose.yml` change:

```
    platform: linux/arm64
```

to

```
    image: litespeedtech/openlitespeed:latest
```

### Docker Compose

Make sure you clone the whole repo. This must include the `Dockerfile` and the `docker-compose.yml`

🏃‍➡️ Run Docker Compose in `detached-mode`.

Docker must be running. This means `Mac` and `Windows` users make sure you are running `Docker Desktop` in the background. Running this command will create a new docker service called "raw-php-api".

```bash
docker compose up -d
```

(Mac) - Adjust this command for your operating system.

### Checking your MariaDB

If everything works properly you will get a new folder called `db`. You can check that this has the correct structure by running:

```bash
docker exec -it raw-php-api-mariadb-1 mysql -u $DB_USERNAME -p
```

then type your database password from .env

Check you have a databse.

```SQL
SHOW DATABASES;
```

Now to check the tables.

```SQL
USE *database_name;
SHOW TABLES;
```

the output should be:

asdfasdfas TODO: ADD THIS

To check that you have data already in the tables run

```SQL
SELECT * FROM *table_name
```

By default the `db-model/02_fake_data.sql` adds the following data:

asdfasdfasdfasdf TODO: ADD THIS

## Running the Webserver

For more detailed instructions read `./frontend/README.md`

Install dependencies with:

```bash
pnpm install
```

start dev with:

```bash
pnpm run dev
```

## License

This project is licensed under the MIT License.

