# Jack & Paws

Jack & Paws is a full-stack pet adoption platform built as a portfolio project. The product is designed around a real workflow: discover pets, inspect structured profiles, save favourites, submit an adoption application, and track that application from a user dashboard.

## Architecture

```text
React + Vite
    |
    | REST / JSON + JWT
    v
Spring Boot API
    |
    | Spring Data JPA
    v
MySQL
```

The frontend is intentionally component-based and visually neutral so the UI can be redesigned without changing business logic. The backend owns validation, authentication, filtering, persistence and adoption rules.

## Features

- Paginated pet directory with search and filters
- Pet detail profiles with compatibility and care information
- Account registration/login using BCrypt + JWT
- Favourite pets persisted in MySQL
- Adoption applications with duplicate/availability checks
- User dashboard with application status and saved pets
- Database indexes and bounded pagination for predictable queries
- Centralized API client and environment-based configuration
- Global API error handling and request validation
- Docker Compose development stack
- GitHub Actions CI for frontend builds and backend tests

## Local development

### 1. Database

```bash
docker compose up -d mysql
```

### 2. Backend

Set the environment variables in `backend` or use the defaults, then:

```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:8080/api/health

## Production configuration

Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_TTL_HOURS`, and `CORS_ORIGIN`. Use a long random JWT secret in production. Do not commit `.env` files or credentials.

## Performance choices

The API uses server-side pagination, database indexes for common pet filters, bounded page sizes, DTO responses for application records, Hikari connection pooling and stateless authentication. The React app lazy-loads images and keeps the API base URL in one place so deployments do not contain hard-coded localhost endpoints.

## CI

Every push and pull request runs the frontend production build and backend Maven test suite through `.github/workflows/ci.yml`.

## Deployment notes

For Vercel, set the project root to `frontend` and configure `VITE_API_URL` to the deployed API URL. The included `vercel.json` rewrites client-side routes to the React entry point.

For a container host, build `backend/Dockerfile` and provide the database and JWT environment variables. A managed MySQL-compatible database is recommended for production.
