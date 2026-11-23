# Agent Rules

- Preserve the Bakka Training Center roles: `admin`, `staff`, and `student`.
- Treat API authorization as the security boundary. Never rely on frontend visibility checks to protect data or actions.
- Scope student-facing queries and mutations to the authenticated student's own records.
- Keep frontend code in TypeScript and backend code in JavaScript (`.js`).
- Use parameterized SQL queries; do not concatenate untrusted input into SQL.
- Validate request bodies and query parameters, return clear HTTP errors, and avoid success-shaped fallbacks.
- Keep secrets in environment variables. Never add real credentials, tokens, or personal student data to source files.
- Follow the existing purple-and-gold reference design and maintain keyboard access, semantic controls, and responsive layouts.
- Prefer focused changes; do not introduce dependencies or alter unrelated files without need.
- Update `overview.md` or `tech_stach.md` when architecture or setup behavior changes.
- Add focused tests for new authorization or workflow behavior and run the narrowest applicable checks.
- Do not issue certificates until the server confirms the registration is completed under the center's completion policy.
