# TypeScript Backend Setup Notes

This document keeps track of the initial setup steps and configuration made to migrate the backend to a TypeScript codebase within the `my-app` mono-repo structure.

## What Was Done

1. **Moved Directory into `my-app`**: 
   Moved the standalone `backend` directory inside `my-app/backend` to act as an adjacent application structure to your frontend.

2. **Reorganized Source Code**:
   Created a new `src` folder inside `my-app/backend/` and moved the structure directories (`config`, `controllers`, `models`, `routes`) into it.

3. **Configured Environment Variables**:
   Used the top-level `.env` file (`my-app/.env`) dynamically. The backend picks up config like the `PORT` (added `PORT=3001`) from its parent directory.

4. **Package & TypeScript Configuration**:
   - Initialized `tsconfig.json` with `"rootDir": "./src"` and `"outDir": "./dist"`.
   - Updated `package.json` to feature `"type": "module"`.
   - Setup an `express` entry-point natively typed in TypeScript (`src/index.ts`).

5. **Scripts Added (`backend/package.json`)**:
   - `"dev": "tsx watch src/index.ts"` (Run the server dynamically with hot-reload).
   - `"build": "tsc"` (Compile the TypeScript down to node executable JS logic).
   - `"start": "node dist/index.js"` (Launch for production inside `dist/`).

## How To Run

From your terminal, navigate into the backend folder:
```bash
cd my-app/backend
```

**Development Mode (Hot Reloading)**:
```bash
npm run dev
```

**Production Mode**:
```bash
npm run build
npm run start
```
