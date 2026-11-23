# Bakka Training Center Administration System

## Purpose

Bakka is a role-aware administration system for managing the training center's users, students, staff, courses, registrations, attendance, certificates, and reports. The dashboard visual direction follows the supplied reference: a polished dark-purple interface with gold accents and light analytic cards.

## Roles and access

- **Admin** — manage users and center-wide records, review reports, and configure the system.
- **Staff** — manage students, courses, attendance, and registration workflows assigned to them.
- **Student** — view their own profile, courses, registration status, attendance, and earned certificates.

Access is enforced by the API, not only by hiding navigation items in the frontend. Student endpoints must always scope records to the authenticated student's account.

## Main workflows

1. Admin or authorized staff registers a student.
2. Staff or admin creates and maintains courses.
3. Students request course registrations; authorized staff approve or reject them.
4. Staff or admin records attendance against a course registration and marks the registration completed when center policy is satisfied.
5. Authorized staff issue certificates only for completed registrations; students can view their own certificates.
6. Each role sees a dashboard and navigation appropriate to its permissions.

## Project layout

- `frontend/` — Next.js and TypeScript dashboard.
- `backend/` — Node.js and JavaScript REST API.
- `database/schema.sql` — MySQL schema.
- `tech_stach.md` — stack, setup, and architecture notes.
- `agent_rules.md` — implementation constraints for coding agents.
- `prompts.md` — starter prompts for extending the system.

## Current starter behavior

The frontend is a responsive dashboard prototype with role switching for previewing Admin, Staff, and Student workspaces. Lists, registration review, profile/settings forms, and certificate previews are interactive, but their sample data is local to the browser session. Dashboard analytics are illustrative. The backend provides a MySQL-backed API foundation with JWT authentication and role-guarded endpoints; connect the frontend to these APIs and configure a real secret/database before deployment.

## Production checklist

- Set `JWT_SECRET`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in a private environment file.
- Provision MySQL and apply `database/schema.sql`.
- Create the initial admin using a controlled provisioning process; do not ship default credentials.
- Connect the frontend login/session flow to the API and replace preview data with authenticated API data.
- Add validation, pagination, audit history, password reset, rate limits, HTTPS, and automated tests before production use.
