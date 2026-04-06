# MongoDB Connection Guide

## Quick Start
```bash
# Auto-detect your user's UID/GID and start MongoDB
USER_ID=$(id -u) GROUP_ID=$(id -g) docker compose up

# Or simply (uses defaults from .env)
docker compose up
```

## Connection URIs

### From Your Host Machine
```
mongodb://admin:mongodb123!secure@localhost:27017/myapp?authSource=admin
```

### From Another Container (service name)
```
mongodb://admin:mongodb123!secure@mongodb:27017/myapp?authSource=admin
```

### MongoDB Compass
- Host: `localhost`
- Port: `27017`
- Username: `admin`
- Password: `mongodb123!secure`
- Authentication Database: `admin`

## Environment Variables
All configurable in `.env`:

| Variable | Default | Purpose |
|----------|---------|---------|
| `MONGO_PORT` | 27017 | MongoDB port |
| `MONGO_ROOT_USER` | admin | Root username |
| `MONGO_ROOT_PASSWORD` | mongodb123!secure | Root password |
| `MONGO_DB` | myapp | Default database name |
| `MONGO_DATA_DIR` | ./data/mongodb | Data volume path |
| `USER_ID` | 1000 | Container user UID |
| `GROUP_ID` | 1000 | Container user GID |
| `MONGO_URI` | Full connection string | For your application |

## File Structure
```
my-app/
├── ci/
│   └── Dockerfile              # MongoDB container definition
├── docker-compose.yml          # Orchestration
├── .env                        # Configuration (add to .gitignore)
├── .env.example               # Template for .env
└── data/
    └── mongodb/               # Data volume (auto-created)
```

## Troubleshooting

### Permission Denied Error
If you see permission errors, use auto-detection:
```bash
USER_ID=$(id -u) GROUP_ID=$(id -g) docker compose up
```

### Cannot Connect to MongoDB
1. Check container is running: `docker ps`
2. Check logs: `docker compose logs mongodb`
3. Verify port: `docker compose ps`
4. Check .env password matches URI

### Reset Everything
```bash
docker compose down -v          # Stop and remove volumes
rm -rf data/                    # Delete data
docker compose up               # Start fresh
```

## Security Notes
- ⚠️ Change `MONGO_ROOT_PASSWORD` in `.env` before production
- ⚠️ Never commit `.env` to git (already in .gitignore)
- ⚠️ Use strong passwords in production
- ⚠️ Don't expose MongoDB to public network without firewall

## Production Considerations
- Use separate read-only user accounts (not root)
- Enable MongoDB authentication (already enabled)
- Use SSL/TLS for connections
- Regular backups of `/data/mongodb`
- Monitor MongoDB logs
- Set resource limits in docker-compose.yml
