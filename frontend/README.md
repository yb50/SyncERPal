# SyncERPal

SyncERPal is an ERP-lite inventory management app built with Spring Boot and React.

The project focuses on small-business inventory workflows such as item management, stock movements, stock transfers, per-location inventory balances, role-based permissions, audit logs, and CSV reporting.

## Tech Stack

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- H2 Database
- Maven

### Frontend

- React
- Vite
- JavaScript
- CSS

## Main Features

### Item Management

- Create, edit, delete, and search items
- Low-stock thresholds
- Movement-controlled item quantities
- Item CSV export/import
- Low-stock CSV report
- Safe deletion rules for items with inventory history

### Location Management

- Create, edit, delete, and search inventory locations
- Safe deletion rules for locations with inventory history

### Stock Movements

- Record IN, OUT, and ADJUSTMENT movements
- Attach movements to items and locations
- Automatically update per-location inventory balances
- Automatically update total item quantity
- Filter stock movement history
- Export stock movement history as CSV

### Stock Transfers

- Transfer stock between locations
- Validate source stock availability
- Store transfer history
- Filter stock transfer history
- Export stock transfer history as CSV

### Inventory Balances

- Track item quantities per location
- Filter balances by item and location
- Export current inventory balances as CSV

### Users and Roles

- Basic app users with ADMIN, MANAGER, and WORKER roles
- ADMIN can manage users and roles
- ADMIN and MANAGER can manage items and locations
- WORKER can create stock movements and transfers
- Last ADMIN protection
- Self-delete protection

### Audit Logs

- Track important system actions
- Record who performed each action
- Filter audit logs by action, entity type, and actor
- Export audit logs as CSV

### Dashboard and Reports

- Dashboard summary cards
- Latest activity display
- Low-stock report
- CSV exports for reports and history tables

## Example Roles

| Role | Permissions |
|---|---|
| ADMIN | Manage users, items, locations, stock movements, and transfers |
| MANAGER | Manage items, locations, stock movements, and transfers |
| WORKER | Create stock movements and transfers |

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

## Environment Variables

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

## Notes

This project uses a simplified header-based user system with `X-User` for portfolio/demo purposes.

Example:

```text
X-User: admin
```

Real authentication with Spring Security is planned as a possible future improvement.

## Future Improvements

- Real login and authentication with Spring Security
- Better UI styling and layout
- Pagination for large tables
- More advanced reports
- Deployment setup
- Database migration with PostgreSQL