# Jobtracker prototype

This is the start of a personal project to track job applications. This is very much a WIP to do more with laravel, next and docker. For the actual underlying requirement a well structured spreadsheet would be sufficient in most cases.

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Initial Setup

1. **Clone and navigate to the project:**
   ```bash
   cd job-tracker
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

   This will start three services:
   - Laravel backend API (http://localhost:8000)
   - Next.js frontend (http://localhost:3000)
   - PostgreSQL database

3. **Run database migrations and seed data (first run):**
   ```bash
   docker-compose exec backend php artisan migrate
   docker-compose exec backend php artisan db:seed
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/ping

### Common Commands

**View logs:**
```bash
docker-compose logs -f              # All services
docker-compose logs -f backend      # Backend only
docker-compose logs -f frontend     # Frontend only
```

**Stop services:**
```bash
docker-compose down
```

**Rebuild containers (after dependency changes):**
```bash
docker-compose up -d --build
```

**Run backend commands:**
```bash
docker-compose exec backend php artisan [command]
docker-compose exec backend php artisan test
```

**Run frontend commands:**
```bash
docker-compose exec frontend npm run [command]
```

# Progress

## Phase 1 - Complete ✓
- Docker setup with docker-compose (separate frontend/backend/database services)
- Laravel 12 base install with Sanctum authentication
- Next.js 16 base install with TypeScript and Tailwind CSS v4
- API health check endpoint
- Full authentication flow (login, logout, protected routes)
- Position model with PHP enum for status (Saved, Applied, Interviewing, Offered, Rejected, Withdrawn)
- Complete CRUD API routes for positions (protected by auth:sanctum)
- Backend PHPUnit tests for authentication and positions
- Database factories and seeders
- shadcn/ui component library integration (new-york style)
- Dashboard with positions table
- Position create/edit form with validation
- Delete confirmation with AlertDialog

## Current Features
- **Backend**: RESTful API with Laravel Sanctum token authentication
- **Frontend**: Next.js App Router with TypeScript
- **Database**: PostgreSQL with migrations and seeders
- **UI Components**: shadcn/ui (Dialog, AlertDialog, Button, Input, Textarea, Select, Label, Badge)
- **Position Tracking**: Full CRUD for job applications with company/recruiter support
- **Form Validation**: Client and server-side validation with error handling

# Next Steps - Phase 2
- Add filtering and sorting to positions table
- Add search functionality
- Implement date range filtering (applied_at)
- Add pagination for large datasets
- Model refinement: update position model, add relations, implement user ownership and access control
- Add GitHub Codespaces support
- Companies House API integration for company lookups

