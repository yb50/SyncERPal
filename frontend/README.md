# SyncERPal

SyncERPal is an ERP-lite inventory management app built with Spring Boot and React.

The project focuses on small-business inventory workflows such as item management, stock movements, stock transfers, per-location inventory balances, role-based permissions, audit logs, authentication, and CSV reporting.

## Tech Stack

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- H2 Database for local development
- Maven
- SLF4J logging
- Springdoc OpenAPI / Swagger UI

### Frontend

- React
- Vite
- JavaScript
- CSS

## Main Features

### Authentication and Security

- Login with username and password
- Passwords stored as BCrypt hashes
- Bearer token based authentication
- Session restore through saved frontend token
- Backend logout invalidates stored auth tokens
- First-user setup flow for creating the initial ADMIN user
- Spring Security route protection
- Role-based backend authorization
- Frontend handling for expired sessions and forbidden actions

### Item Management

- Create, edit, delete, and search items
- Low-stock thresholds
- Movement-controlled item quantities
- Item CSV export/import
- Low-stock CSV report
- Safe deletion rules for items with inventory history
- Backend pagination and sorting endpoint

### Location Management

- Create, edit, delete, and search inventory locations
- Safe deletion rules for locations with inventory history
- Backend pagination and sorting endpoint

### Stock Movements

- Record IN, OUT, and ADJUSTMENT movements
- Attach movements to items and locations
- Automatically update per-location inventory balances
- Automatically update total item quantity
- Filter stock movement history
- Export stock movement history as CSV
- Backend pagination, sorting, and optional item filtering endpoint

### Stock Transfers

- Transfer stock between locations
- Validate source stock availability
- Store transfer history
- Filter stock transfer history
- Export stock transfer history as CSV
- Backend pagination and sorting endpoint

### Inventory Balances

- Track item quantities per location
- Filter balances by item and location
- Export current inventory balances as CSV
- Backend pagination and sorting endpoint

### Users and Roles

- App users with ADMIN, MANAGER, and WORKER roles
- ADMIN can manage users and roles
- ADMIN and MANAGER can manage items and locations
- WORKER can create stock movements and transfers
- Last ADMIN protection
- Self-delete protection
- ADMIN-only user list
- Backend pagination and sorting endpoint

### Audit Logs

- Track important system actions
- Record who performed each action
- Filter audit logs by action, entity type, and actor
- Export audit logs as CSV
- Backend pagination and sorting endpoint

### Dashboard and Reports

- Dashboard summary cards
- Recent activity display
- Low-stock report
- CSV exports for reports and history tables

## Example Roles

ADMIN: Manage users, items, locations, stock movements, and transfers.
MANAGER: Manage items, locations, stock movements, and transfers.
WORKER: Create stock movements and transfers.

## Local Setup

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

By default, the backend runs with the `dev` profile.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## First User Setup

When the database is empty, the first user must be created as an `ADMIN`.

The frontend uses the setup flow automatically.

Relevant backend endpoints:

```text
GET /auth/setup-required
POST /users/setup
```

After setup is completed, normal user creation requires an authenticated ADMIN user.

## Authentication Flow

The app uses bearer token authentication.

Basic flow:

```text
POST /auth/login
→ returns token

Frontend stores token
→ sends Authorization: Bearer <token>

GET /auth/me
→ restores logged-in user on page refresh

POST /auth/logout
→ invalidates token on backend
```

Protected ERP data is hidden when logged out.

## Backend Configuration

The backend uses Spring profiles.

Default profile:

```properties
SPRING_PROFILES_ACTIVE=dev
```

### Dev Profile

The `dev` profile uses a local H2 file database:

```properties
spring.datasource.url=jdbc:h2:file:./data/syncerpal
```

The H2 console is available at:

```text
http://localhost:8080/h2-console
```

### Production Profile

The `prod` profile expects database settings from environment variables:

```properties
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
DATABASE_DRIVER
FRONTEND_URL
```

The frontend URL is used for CORS:

```properties
FRONTEND_URL=http://localhost:5173
```

Note: when using a production database other than H2, the matching JDBC driver dependency must be available in the backend project.

## Frontend Environment Variables

The frontend API base URL can be configured with:

```env
VITE_API_BASE_URL=http://localhost:8080
```

See `.env.example`.

## Database

The project uses H2 for local development.

Local database files are ignored by Git:

```text
syncerpal.mv.db
syncerpal.trace.db
```

Depending on where the H2 file is created, the local database may also appear under:

```text
data/
```

## Error Responses

The backend returns structured error responses:

```json
{
  "timestamp": "2026-10-04T19:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied.",
  "path": "/items"
}
```

Common statuses:

400: Validation error
401: Authentication required or invalid token
403: Logged in, but not enough permission
409: Business rule conflict
500: Unexpected server error

## Logging

The backend uses SLF4J logging for important backend events.

Examples:

- Login success/failure
- Logout
- Expired token usage
- Item create/update/delete
- Location create/update/delete
- Stock movement creation
- Stock transfer creation
- User creation, role update, and deletion
- Unexpected server errors

Sensitive data such as passwords, password hashes, and full tokens are not logged.

## API Documentation

Swagger UI is available at:

```text
http://localhost:8080/swagger-ui.html
```

OpenAPI JSON is available at:

```text
http://localhost:8080/v3/api-docs
```

Protected endpoints can be tested by clicking **Authorize** in Swagger UI and pasting a login token.

## Backend Pagination

Several endpoints support backend pagination and sorting:

```text
GET /items/paged
GET /locations/paged
GET /stock-movements/paged
GET /stock-transfers/paged
GET /inventory-balances/paged
GET /audit-logs/paged
GET /users/paged
```

Example:

```text
GET /items/paged?page=0&size=10&sortBy=name&direction=asc
```

Response shape:

```json
{
  "content": [],
  "page": 0,
  "size": 10,
  "totalElements": 25,
  "totalPages": 3,
  "last": false
}
```

## CSV Exports

The app supports CSV exports for:

- Items
- Low-stock report
- Stock movements
- Stock transfers
- Inventory balances
- Audit logs

Item CSV import is also supported.

## Future Improvements

- Deployment setup
- PostgreSQL migration
- React Router
- More advanced responsive UI
- More advanced reports
- Automated tests
- CI/CD pipeline
- Docker setup