# Shift Planner
FundedYouth Public Tool for Setting Schedules and Shifts

## API
Uses the [FundedYouth API](https://github.com/FundedYouth-Team/raw-php-api) for account management and data storage.

---

## Structure and Local Testing

![alt text](/readme-media/shift-planner_BasicFlow.svg "Title")

By default, we create 4 fake users:

| Name | Email | Password |
|---|:---:|---:|
| Alice Smith | alice@example.com | password123 |
| Bob Jones | bob@example.com | password123 |
| Carol Lee | carol@example.com | password123 |
| David Brown | david@example.com | password123 |

If you want to add more you will have to manually add those by going into the MariaDB and manually adding them.

### Folder structure

```bash
project-root/
├── frontend/              # React TypeScript frontend
├── api/                   # FundedYouth raw PHP API
│   ├── docker-compose.yml # defines PHP, DB, phpMyAdmin
└── README.md
```

### How to Run

1. Clone this repo
2. Change your `api/.env.example` to `api/.env` and add your MariaDB credentials
3. Setup your Docker environment with Docker Compose
4. Make sure Litespeed Web Server is running in Docker
5. Open a browser: `http://localhost/api/` - If everything is configured correctly you should see:

```json
{ "msg": "Connected" }
```

6. Start your web server with `pnpm run dev`.
7. Open `http://localhost:5173` to view the website.


### CPU Architecture Note (ARM vs x86_64)

This project was initially configured for ARM64 CPUs (e.g., Apple Silicon).
If you are running on Intel or AMD (x86_64), make the following adjustments:

In `api/Dockerfile` change:
```dockerfile
FROM ghcr.io/ndigitals/openlitespeed:latest
```
to
```dockerfile
FROM litespeedtech/openlitespeed:latest
```

In `api/docker-compose.yml` change:
```yaml
    platform: linux/arm64
```
to
```yaml
    image: litespeedtech/openlitespeed:latest
```
and 
```yaml
    volumes:
      - ./src:/var/www/vhosts/localhost/html
```
to
```yaml
    volumes:
      - ./:/var/www/vhosts/localhost/html
```

This changes the image to an architecture compatible with x86 avoiding errors from emulating ARM processors.

## Environment Variables (.env)

▶️ **Development** this is set to `mariadb` to reference the Docker Container. Otherwise you might not be able to connect, since you are not running the api directly in docker.

Change the `api/.env.example` to `api/.env` and enter in your desired credentials

```yaml
# .env.example
# # Production
# DB_HOST=XXX.XXX.XXX.XXX

# Development
DB_HOST=mariadb

# Common
DB_NAME=
DB_USER=
DB_PASS=
```

### Docker Setup

To start all services (backend + database):

```bash
cd api
docker compose up -d
```

(Mac) - Adjust this command for your operating system.

### Checking your MariaDB

If everything works properly you will get a new folder called `db`. You can check that this has the correct structure by running:

```bash
docker exec -it raw-php-api-mariadb-1 mysql -u example_user -p
```
Then enter the password defined in `api/.env`.

Inside MySQL:

```sql
SHOW DATABASES;
USE funded_youth; -- or your database name
SHOW TABLES;
SELECT * FROM table_name; -- one of roles, users, dates
```

By default, `/api/db-model/02_fake_data.sql` seeds the database with sample data. If you don't want the fake testing data then delelete this file before building. Otherwise you can drop the tables to erase all values.

## Running the Web Server

For more detailed instructions read `./frontend/README.md`


Basic usage:

Rename `frontend/.env.example` to `frontend/.env.development`

If you go into production you will have to create a similar `.env.production` file that has information on calling the api over the web.

```bash
cd frontend
pnpm install
pnpm run dev
```

## License

This project is licensed under the MIT License.

