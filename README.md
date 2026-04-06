# Season - Luxury Eyewear E-Commerce

A unified full-stack repository for the Season luxury eyewear e-commerce platform with frontend and backend services.

## Repository Structure

```
season/
├── frontend/          # Next.js React application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   │   ├── menu/     # Mega menu navigation
│   │   ├── sections/ # Page sections
│   │   └── ui/       # shadcn/ui components
│   ├── lib/          # Utilities
│   ├── public/       # Static assets
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/           # Express.js API server
│   ├── src/          # TypeScript source
│   │   ├── app.ts
│   │   ├── models/   # Database models
│   │   ├── routes/   # API endpoints
│   │   └── services/ # Business logic
│   ├── season_data/  # Product JSON data
│   ├── package.json
│   └── tsconfig.json
│
└── .gitignore        # Git ignore rules
```

## Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

## Features

### Frontend
- **Mega Menu Navigation**
  - Responsive: 80vw (mobile) / 40vw (desktop)
  - 3-column layout: Eyeglasses, Sunglasses, Support
  - Badge system: Bestsellers (yellow), View All (gray), Sale (red)
  
- **Tech Stack**
  - Next.js 16.2.1
  - React 19
  - TypeScript
  - Tailwind CSS v4
  - shadcn/ui

### Backend
- **RESTful API**
  - Product management
  - Collection filtering
  - Sale/clearance items
  
- **Tech Stack**
  - Express.js
  - TypeScript
  - MongoDB (configurable)
  - Node.js

## Development Workflow

### Committing Changes

When making changes, commit to the unified Season repository:

```bash
# Frontend changes
git add frontend/components/...
git commit -m "feat: description of change"

# Backend changes
git add backend/src/...
git commit -m "feat: description of change"

# Both
git add frontend/ backend/
git commit -m "feat: description of changes"
```

## Environment Configuration

Create `.env` files in both directories:

**frontend/.env**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**backend/.env**
```
MONGODB_URI=mongodb://localhost:27017/season
PORT=3001
```

## Project Status

✅ Unified repository structure  
✅ Mega menu with responsive design  
✅ Badge system for categorization  
✅ Frontend and backend ready for development  

## License

Season Eyewear © 2024
