# MongoDB Connection URI

## Local Development
For connecting from your application to MongoDB running in Docker Compose:

```
mongodb://admin:your-secure-password@localhost:27017/myapp?authSource=admin
```

## Environment Variables
Add this to your `.env` for your Next.js app:

```
MONGO_URI=mongodb://admin:your-secure-password@localhost:27017/myapp?authSource=admin
```

## Connection String Components
- `admin` - Root username (MONGO_ROOT_USER)
- `your-secure-password` - Root password (MONGO_ROOT_PASSWORD)
- `localhost` - MongoDB host
- `27017` - MongoDB port
- `myapp` - Database name (MONGO_DB)
- `?authSource=admin` - Authenticate against admin database

## For Container-to-Container Communication (when adding other services)
If you add a Node.js/Next.js service in the same compose file:

```
mongodb://admin:your-secure-password@mongodb:27017/myapp?authSource=admin
```
(Use `mongodb` instead of `localhost` - it's the service name)

## MongoDB Compass Connection
Open MongoDB Compass and use:
```
mongodb://admin:your-secure-password@localhost:27017
```

## How to Run
```bash
# Auto-detect your UID/GID
USER_ID=$(id -u) GROUP_ID=$(id -g) docker compose up

# Or with .env values
docker compose up
```
