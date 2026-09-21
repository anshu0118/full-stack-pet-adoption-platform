# API contract

Base URL: `/api`

## Public

`GET /health` health check.

`GET /pets` paginated directory. Query parameters: `search`, `species`, `size`, `gender`, `page`, `pageSize`. `pageSize` is capped by the backend.

`GET /pets/{id}` pet profile.

`POST /auth/register` accepts `{ name, email, password }` and returns a JWT plus user summary.

`POST /auth/login` accepts `{ email, password }` and returns a JWT plus user summary.

## Authenticated

Send `Authorization: Bearer <token>`.

`GET /users/me` current account.

`GET /favorites` saved pets.

`POST /favorites/{petId}` save a pet. Idempotent for an existing favorite.

`DELETE /favorites/{petId}` remove a favorite.

`GET /applications` current user's adoption applications.

`POST /applications` accepts pet and household/application information. The service checks pet availability and prevents duplicate active applications.

## Data flow

The browser owns presentation state. The API owns business rules. JPA owns persistence. This keeps UI redesigns independent of the domain layer.

## Admin workflow

Admins can review an application and change its status with `PATCH /api/admin/applications/{id}/status?status=UNDER_REVIEW`, `MEET_AND_GREET`, `APPROVED`, or `REJECTED`. This endpoint requires a JWT whose user role is `ADMIN`. Approval also moves the pet to `ADOPTED`.

## Admin workflow

Admins can review an application and change its status with `PATCH /api/admin/applications/{id}/status?status=UNDER_REVIEW`, `MEET_AND_GREET`, `APPROVED`, or `REJECTED`. This endpoint requires a JWT whose user role is `ADMIN`. Approval also moves the pet to `ADOPTED`.
