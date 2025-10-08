# Shift Planner
FundedYouth Public Tool for Setting Schedules and Shifts

## API
Uses the [FundedYouth API](https://github.com/FundedYouth-Team/raw-php-api) for account management and data storage.

---

## Structure and Local Testing

### Folder structure

```bash
project-root/
├── frontend/              # React TypeScript frontend
├── api/                   # FundedYouth raw PHP API
│   ├── docker-compose.yml # defines PHP, DB, phpMyAdmin
├── Docker/                # top-level Compose orchestration
│   └── docker-compose.yml
└── README.md
```

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

### Docker Setup

The `/Docker/docker-compose.yml` file includes the backend’s existing compose configuration from `/api/docker-compose.yml`.

To start all services (frontend + backend + database):

```bash
cd Docker
docker compose up --build
```

(Mac) - Adjust this command for your operating system.

### Checking your MariaDB

If everything works properly you will get a new folder called `db`. You can check that this has the correct structure by running:

```bash
docker exec -it raw-php-api-mariadb-1 mysql -u example_user -p
```
Then enter the password defined in `.env` (default: `example_password`).

Inside MySQL:

```sql
SHOW DATABASES;
USE funded_youth; -- or your database name
SHOW TABLES;
SELECT * FROM table_name;
```

By default, `/api/db-model/02_fake_data.sql` seeds the database with sample data.

## Running the Webserver

For more detailed instructions read `./frontend/README.md`

Basic usage:

```bash
cd frontend
pnpm install
pnpm run dev
```

to get Axios to pull the api correctly you will need to create `/frontend/.env` and add

```env
VITE_API_BASE_URL=http://localhost
```

## License

This project is licensed under the MIT License.

