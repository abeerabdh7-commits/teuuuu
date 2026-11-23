# Technology Stack

> The filename `tech_stach.md` is retained as requested.

## Frontend

- **Next.js** with the App Router.
- **TypeScript** (`.ts` / `.tsx`) for pages, components, and browser-side code.
- **Lucide React** for consistent interface icons.
- Responsive CSS in `frontend/app/globals.css`; the visual language follows the provided purple-and-gold dashboard reference.

## Backend

- **Node.js** with **JavaScript** (`.js`) files and Express.
- REST API under `/api`.
- JWT bearer tokens for API authentication; password hashes use bcrypt.
- Role authorization is applied in API middleware and route handlers.

## Database

- **MySQL** accessed through `mysql2` using parameterized queries.
- Schema and foreign-key relationships are defined in `database/schema.sql`.
- Credentials and token secrets must come from environment variables, never source control.

## Local setup

1. Install Node.js 20.9 or newer and MySQL 8 or newer.
2. Create a database and apply `database/schema.sql`.
3. Copy `backend/.env.example` to `backend/.env`, then set the MySQL connection values and a long random `JWT_SECRET`.
4. Run `npm install` in `frontend/` and `backend/`.
5. Start the API with `npm run dev` in `backend/` (default port `4000`).
6. Start the dashboard with `npm run dev` in `frontend/` (default port `3000`).

## API outline

- `POST /api/auth/login` — authenticate with email and password.
- `GET /api/dashboard` — role-specific summary.
- `GET, POST /api/students` — admin/staff student management.
- `GET, POST /api/courses` — course browsing and admin/staff course creation.
- `GET, POST /api/registrations` — student request and staff/admin registration management.
- `PATCH /api/registrations/:id` — staff/admin approval, rejection, or completion.
- `GET, POST /api/attendance` — role-scoped attendance history and staff/admin recording.
- `GET, POST /api/certificates` — authorized issuance and owner-scoped student listing.
- `GET, POST /api/users` — admin-only account management.

For browser integration, use the backend origin configured in `NEXT_PUBLIC_API_URL`. Keep authorization checks on the server even when the frontend restricts navigation.
