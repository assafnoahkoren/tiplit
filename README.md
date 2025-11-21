# Tiplit

A full-stack monorepo with React (Vite) webapp and tRPC server.

## Project Structure

```
tiplit/
├── webapp/          # React + Vite frontend
├── server/          # tRPC + Express backend
├── packages/        # Shared packages (if any)
└── docker-compose.yml
```

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm (comes with Node.js)

## Getting Started

### 1. Install Dependencies

From the root directory:

```bash
npm install
```

This will install dependencies for all workspaces (webapp and server).

### 2. Start Docker Services

Start PostgreSQL:

```bash
docker compose up -d
```

**Services:**
- **PostgreSQL**: `localhost:5432`
  - Database: `tiplit`
  - User: `tiplit`
  - Password: `tiplit_dev_password`

### 3. Environment Variables

Copy the example env files and update as needed:

```bash
# Server
cp server/.env.example server/.env

# Webapp
cp webapp/.env.example webapp/.env
```

### 4. Start Development Servers

**Start the server:**
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:3001`

**Start the webapp (in a new terminal):**
```bash
cd webapp
npm run dev
```
Webapp runs on: `http://localhost:5173`

## Docker Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Stop and remove volumes (will delete database data)
docker compose down -v
```

## Available Scripts

### Root
- `npm install` - Install all workspace dependencies

### Server (`server/`)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Type check without emitting files

### Webapp (`webapp/`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check without emitting files

## Technologies

### Frontend (webapp)
- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router v7
- i18next (internationalization)
- tRPC React Query

### Backend (server)
- Node.js
- TypeScript
- Express
- tRPC
- Zod (validation)

### Infrastructure
- PostgreSQL 16
- Docker Compose

## Development

### Adding a New tRPC Route

1. Add your route in `server/src/router.ts`
2. The webapp will automatically have type-safe access to it via `trpc.yourRoute.useQuery()` or `trpc.yourRoute.useMutation()`

## License

ISC
