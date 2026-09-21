Jack & Paws 🐾

A full-stack pet adoption platform built to connect adopters with
shelters through a complete adoption workflow.

Jack & Paws goes beyond a simple pet listing website. It includes
authentication, role-based access, pet management, favourites, adoption
applications, shelter-side application review, application status
tracking, and a structured backend built around a service/repository
architecture.

What Jack & Paws Does

Adopters

Users can:

Create an account and authenticate securely

Browse available pets

Search and filter pets

View detailed pet profiles

Save pets to favourites

Submit adoption applications

Track submitted applications

View application status updates

Shelters

Shelter accounts can:

Add pets to the adoption directory

View pets managed by their shelter

Remove available pets from active listings

View incoming adoption applications

Review applicant information

Approve or reject applications

Track adopted pets and application activity

Adoption Workflow

AVAILABLE
    |
    | User submits application
    v
APPLICATION_PENDING
    |
    | Shelter reviews
    v
APPROVED / REJECTED
    |         |
    v         v
ADOPTED    AVAILABLE

Applications move through SUBMITTED, UNDER_REVIEW, MEET_AND_GREET,
then APPROVED or REJECTED.

A removed pet is represented by REMOVED and excluded from active
adoption listings.

Core Features

Authentication & Authorization

User registration and login

JWT-based authentication

BCrypt password hashing

Stateless Spring Security

Role-based authorization

USER, SHELTER and ADMIN roles

Protected frontend routes

Shelter ownership validation

Pet Discovery

Public pet catalogue

Search by name or breed

Species, size and gender filters

Pagination

Pet detail pages

Adoption availability states

Favourites

Authenticated adopters can save, remove and view favourite pets.

Adoption Applications

Applications contain housing information, yard availability, existing
pets, previous experience and a personal message. Duplicate active
applications for the same pet are prevented.

Shelter Dashboard

Shelters can see managed pets, application counts, pending applications,
adopted pets and incoming applications. They can review applicant
details and update application status.

Pet Management

Shelters can create and update pets and remove them from active
listings. Removed pets are soft-removed rather than physically deleted,
preserving history. Adopted pets cannot be removed.

Architecture

React + Vite + Tailwind
          |
       REST/JSON
          v
     Spring Boot
          |
      JPA/Hibernate
          |
          v
        MySQL

The backend follows:

Controller
    |
    v
Service
    |
    v
Repository
    |
    v
Database

Technology Stack

Frontend

React, Vite, Tailwind CSS, React Router, JavaScript, Fetch API, React
Context, React Bits-inspired components and OGL/WebGL visual effects.

Backend

Java 17, Spring Boot, Spring Web, Spring Security, Spring Data JPA,
Hibernate, JWT, BCrypt and Jakarta Validation.

Database

MySQL with JPA/Hibernate ORM and indexed frequently queried fields.

DevOps

Docker, Docker Compose, GitHub Actions and Git.

Security

Authentication uses JWT tokens with BCrypt password hashing.

Protected requests use:

Authorization: Bearer <token>

Authorization is enforced through Spring Security and service-layer
ownership checks. A shelter can only manage its own pets and
applications.

API Overview

POST   /api/auth/register
POST   /api/auth/login

GET    /api/pets
GET    /api/pets/{id}
POST   /api/pets
PUT    /api/pets/{id}
DELETE /api/pets/{id}

GET    /api/favorites
POST   /api/favorites/{petId}
DELETE /api/favorites/{petId}

POST   /api/applications
GET    /api/applications
GET    /api/applications/{id}

GET    /api/shelter/pets
GET    /api/shelter/applications
PATCH  /api/shelter/applications/{id}/status

GET    /api/users/me

GET    /api/health
GET    /actuator/health

Detailed API documentation is available in docs/API.md.

Domain Model

User
 |
 +-- Favourite --> Pet
 |
 +-- AdoptionApplication --> Pet --> Shelter(User)

User roles:

USER
SHELTER
ADMIN

Pet states:

AVAILABLE
APPLICATION_PENDING
ADOPTED
REMOVED

Application states:

SUBMITTED
UNDER_REVIEW
MEET_AND_GREET
APPROVED
REJECTED

Project Structure

jack-and-paws/
├── .github/workflows/ci.yml
├── backend/
│   ├── src/main/java/com/jackandpaws/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   ├── Dockerfile
│   ├── pom.xml
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── .env.example
├── docs/API.md
├── docker-compose.yml
├── README.md
└── .gitignore

Running Locally

Prerequisites

Java 17+

Node.js

npm

MySQL 8+

Git

Docker (optional)

Backend

Create the database:

CREATE DATABASE jack_and_paws;

Set:

$env:DB_URL="jdbc:mysql://localhost:3306/jack_and_paws?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-password"
$env:JWT_SECRET="your-long-random-secret"
$env:CORS_ORIGIN="http://localhost:5173"

Then:

cd backend
./mvnw spring-boot:run

API:

http://localhost:8080

Frontend

cd frontend
npm install

Create frontend/.env:

VITE_API_URL=http://localhost:8080/api

Run:

npm run dev

Frontend:

http://localhost:5173

Docker

The repository includes docker-compose.yml and backend/Dockerfile
for a portable containerized setup.

Environment Variables

Real credentials stay outside source control.

Backend:

DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
JWT_TTL_HOURS=
CORS_ORIGIN=
DB_POOL_SIZE=
DDL_AUTO=
PORT=

Frontend:

VITE_API_URL=

Example files are provided at backend/.env.example and
frontend/.env.example.

Never commit real credentials or production secrets.

CI

GitHub Actions configuration is available at .github/workflows/ci.yml
to catch build and test issues before deployment.

Frontend & Design Approach

The frontend intentionally avoids a generic template-like visual style.
It combines a practical application structure with expressive visual
sections including Aurora/WebGL effects, DriftWall, Grainient, Flowing
interaction sections, Accordion-style pet galleries and compact pet
cards.

Visual effects are separated from application logic so the UI can evolve
independently of the backend architecture.

Engineering Decisions

Soft removal instead of hard deletion

Pets are marked REMOVED instead of physically deleted. This preserves
historical records and application relationships.

Shelter ownership

Pets reference their owning shelter through shelter_id, with backend
ownership checks preventing cross-shelter management.

Application-driven pet state

Submitting an application changes a pet from AVAILABLE to
APPLICATION_PENDING.

Approval changes it to ADOPTED.

Rejection returns it to AVAILABLE.

Database-level filtering

Removed pets are excluded from active shelter listings and public
adoption results rather than relying only on frontend filtering.

Current Status

Authentication                [x]
JWT security                 [x]
Role-based access            [x]
Pet catalogue                [x]
Pet search/filtering         [x]
Pagination                   [x]
Pet details                  [x]
Favourites                   [x]
Adoption applications        [x]
Application status workflow  [x]
Shelter dashboard            [x]
Shelter pet management       [x]
Shelter application inbox   [x]
Approve / reject workflow    [x]
Pet adoption lifecycle      [x]
Soft removal                [x]
Docker configuration        [x]
GitHub Actions CI           [x]

The next stage is production deployment and infrastructure
configuration.

Roadmap

Pet image upload/storage with object storage

Shelter profile pages

Email notifications

Application withdrawal

Admin moderation dashboard

Advanced shelter analytics

More detailed application review workflow

Automated deployment pipeline

Production monitoring and logging

Automated integration tests

Cloud deployment

Author

Built as a full-stack engineering project using React, Spring Boot, JPA,
MySQL, JWT authentication, Docker and GitHub Actions.

Jack & Paws

A pet adoption platform built around the idea that adoption should be a
workflow, not just a button.