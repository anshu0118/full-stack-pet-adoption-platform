# Jack & Paws 🐾

> A full-stack pet adoption platform built around a real adoption workflow, connecting adopters with shelters through discovery, applications, review, and adoption.

Jack & Paws is not just a pet listing site. It is a full-stack application with JWT authentication, role-based access, pet management, favourites, adoption applications, shelter dashboards, application review, state-driven adoption logic, MySQL persistence, Docker support, and CI.

---

## 🐾 What is Jack & Paws?

Jack & Paws gives adopters and shelters different experiences inside the same platform.

### For adopters

- Create an account and sign in securely
- Browse available pets
- Search by pet name or breed
- Filter by species, size, and gender
- View individual pet details
- Save pets to favourites
- Submit adoption applications
- Track applications from the dashboard
- See application status changes made by the shelter

### For shelters

- Sign in using a shelter account
- Add pets to the adoption directory
- Manage their own pet listings
- Remove pets from active listings
- Receive applications for their pets
- Review applicant information
- Approve or reject applications
- Track pending and adopted pets

The backend also enforces shelter ownership, so a shelter cannot modify another shelter's data simply by knowing a resource ID.

---

## 🔄 Adoption Workflow

The important part of the application is the workflow connecting the adopter and the shelter.

```text
                     AVAILABLE
                         │
                         │  User applies
                         ▼
                APPLICATION_PENDING
                         │
                         │  Shelter reviews
                         ▼
                  ┌──────┴──────┐
                  │             │
                  ▼             ▼
              APPROVED       REJECTED
                  │             │
                  ▼             ▼
               ADOPTED      AVAILABLE
```

Applications have their own lifecycle:

```text
SUBMITTED
    │
    ▼
UNDER_REVIEW
    │
    ▼
MEET_AND_GREET
    │
    ├──────► APPROVED
    │
    └──────► REJECTED
```

Pets can also be marked:

```text
REMOVED
```

Removed pets stay in the database for history but are excluded from active public adoption listings.

---

## ✨ Features

### Authentication & Security

- JWT authentication
- BCrypt password hashing
- Stateless Spring Security
- Protected frontend routes
- Role-based authorization
- `USER`, `SHELTER`, and `ADMIN` roles
- Method-level authorization
- Shelter ownership validation
- Environment-based database and JWT secrets

### Pet Discovery

- Public pet catalogue
- Search by name or breed
- Species filtering
- Size filtering
- Gender filtering
- Pagination
- Pet detail pages
- Availability-aware listings

### Favourites

Authenticated adopters can:

- Save pets
- Remove saved pets
- View saved pets from their dashboard

### Adoption Applications

Applications collect:

- Housing type
- Yard availability
- Existing pets
- Previous pet experience
- Applicant message

The backend prevents duplicate active applications for the same pet.

### Shelter Dashboard

The shelter dashboard provides:

- Managed pet count
- Application count
- Pending application count
- Adopted pet count
- Shelter pet listings
- Application inbox
- Applicant details
- Approve/reject actions

### Pet Management

Shelters can:

- Create pets
- Update pet information
- Remove pets from active listings
- View adoption state

Removal is implemented as a soft state transition instead of a hard database delete.

Adopted pets cannot be removed.

---

## 🏗️ Architecture

```text
┌───────────────────────────────┐
│        React Frontend         │
│     Vite + Tailwind CSS       │
└───────────────┬───────────────┘
                │
                │ REST / JSON
                ▼
┌───────────────────────────────┐
│         Spring Boot API       │
│                               │
│         Controllers           │
│              │                │
│              ▼                │
│           Services            │
│              │                │
│              ▼                │
│         Repositories          │
└───────────────┬───────────────┘
                │
                │ JPA / Hibernate
                ▼
┌───────────────────────────────┐
│             MySQL             │
└───────────────────────────────┘
```

The backend follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

This keeps HTTP handling, business rules, and persistence separated.

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- JavaScript
- Fetch API
- React Context
- OGL/WebGL
- React Bits-inspired components

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- BCrypt
- Jakarta Validation

### Database

- MySQL
- JPA / Hibernate ORM
- Indexed fields for common pet queries

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- Git

---

## 🔐 Security Model

Authentication returns a JWT.

Protected requests use:

```http
Authorization: Bearer <token>
```

Authorization is enforced at multiple layers.

| Role | Main capabilities |
|---|---|
| `USER` | Browse, favourite, apply, track applications |
| `SHELTER` | Manage own pets and review own applications |
| `ADMIN` | Administrative operations |

Shelter ownership is checked in the service layer as well as through Spring Security authorization.

Database credentials and JWT secrets are supplied through environment variables and are not stored in the repository.

---

## 🔌 API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Pets

```text
GET    /api/pets
GET    /api/pets/{id}
POST   /api/pets
PUT    /api/pets/{id}
DELETE /api/pets/{id}
```

### Favourites

```text
GET    /api/favorites
POST   /api/favorites/{petId}
DELETE /api/favorites/{petId}
```

### Applications

```text
POST /api/applications
GET  /api/applications
GET  /api/applications/{id}
```

### Shelter

```text
GET   /api/shelter/pets
GET   /api/shelter/applications
PATCH /api/shelter/applications/{id}/status
```

### User

```text
GET /api/users/me
```

### Health

```text
GET /api/health
GET /actuator/health
```

Detailed endpoint information is available in [`docs/API.md`](docs/API.md).

---

## 🗃️ Domain Model

```text
User
 │
 ├── Favourite ──────────► Pet
 │
 └── AdoptionApplication ─► Pet
                              │
                              └── Shelter (User)
```

### User roles

```text
USER
SHELTER
ADMIN
```

### Pet states

```text
AVAILABLE
APPLICATION_PENDING
ADOPTED
REMOVED
```

### Application states

```text
SUBMITTED
UNDER_REVIEW
MEET_AND_GREET
APPROVED
REJECTED
```

---

## 📁 Project Structure

```text
jack-and-paws/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/jackandpaws/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── exception/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   └── test/
│   ├── Dockerfile
│   ├── pom.xml
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── .env.example
│
├── docs/
│   └── API.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 🚀 Run Locally

### Requirements

- Java 17+
- Node.js
- npm
- MySQL 8+
- Git
- Docker (optional)

### 1. Create the database

```sql
CREATE DATABASE jack_and_paws;
```

### 2. Configure the backend

Set the required environment variables.

PowerShell:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/jack_and_paws?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-password"
$env:JWT_SECRET="your-long-random-secret"
$env:CORS_ORIGIN="http://localhost:5173"
```

Run the API:

```powershell
cd backend
./mvnw spring-boot:run
```

Backend:

```text
http://localhost:8080
```

### 3. Run the frontend

```powershell
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

Then:

```powershell
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🐳 Docker

The repository includes:

```text
docker-compose.yml
backend/Dockerfile
```

Docker provides a portable way to run the application across development and deployment environments.

---

## 🌎 Environment Variables

### Backend

```env
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
JWT_TTL_HOURS=
CORS_ORIGIN=
DB_POOL_SIZE=
DDL_AUTO=
PORT=
```

### Frontend

```env
VITE_API_URL=
```

Example files are included:

```text
backend/.env.example
frontend/.env.example
```

Never commit real credentials or production secrets.

---

## ⚙️ CI

GitHub Actions configuration is located at:

```text
.github/workflows/ci.yml
```

The workflow is used to catch build and test problems before deployment.

---

## 🎨 Frontend Design

The frontend deliberately avoids a generic dashboard/template appearance.

The visual system combines practical application UI with expressive sections and effects, including:

- Aurora/WebGL hero
- DriftWall
- Grainient
- Flowing interaction sections
- Accordion-style pet galleries
- Compact pet cards
- Structured application interfaces

Visual effects are kept separate from application logic so the visual layer can evolve without changing the backend architecture.

---

## 🧠 Engineering Decisions

### Soft removal instead of hard deletion

Pets are marked `REMOVED` rather than physically deleted.

This preserves historical records and application relationships.

### Shelter ownership

Pets reference their owning shelter through `shelter_id`.

The backend verifies ownership before allowing shelter management operations.

### Application-driven pet state

Submitting an application:

```text
AVAILABLE → APPLICATION_PENDING
```

Approval:

```text
APPLICATION_PENDING → ADOPTED
```

Rejection:

```text
APPLICATION_PENDING → AVAILABLE
```

### Public catalogue filtering

The public catalogue only returns pets that are currently `AVAILABLE`.

Removed and adopted pets are not presented as active adoption listings.

---

## ✅ Current Status

The core platform is functional end-to-end.

| Feature | Status |
|---|:---:|
| Authentication | ✅ |
| JWT security | ✅ |
| Role-based access | ✅ |
| Pet catalogue | ✅ |
| Search & filtering | ✅ |
| Pagination | ✅ |
| Pet details | ✅ |
| Favourites | ✅ |
| Adoption applications | ✅ |
| Application workflow | ✅ |
| Shelter dashboard | ✅ |
| Shelter pet management | ✅ |
| Shelter application inbox | ✅ |
| Approve / reject workflow | ✅ |
| Pet adoption lifecycle | ✅ |
| Soft removal | ✅ |
| Docker configuration | ✅ |
| GitHub Actions CI | ✅ |

**Next:** production deployment and infrastructure configuration.

---

## 🗺️ Roadmap

- Production deployment
- Pet image upload/storage
- Shelter profile pages
- Email notifications
- Application withdrawal
- Admin moderation dashboard
- Advanced shelter analytics
- Automated integration tests
- Production monitoring and logging
- Automated deployment pipeline

---

## 👨‍💻 Author

Built as a full-stack engineering project using React, Spring Boot, JPA, MySQL, JWT authentication, Docker, and GitHub Actions.

### Jack & Paws

**Adoption should be a workflow, not just a button.**
