# Starter Prompts

Use these prompts when extending the Bakka Training Center system:

1. **Authentication**
   > Implement the login and logout flow for the Bakka dashboard. Connect Next.js to the Node API, store the session securely, and enforce admin, staff, and student permissions on both the server and UI. Do not add default credentials.

2. **Student registration**
   > Build the student registration workflow, including validated form fields, duplicate-email handling, API persistence, and an admin/staff-only review screen. Keep student records inaccessible to other students.

3. **Course registration**
   > Add the course enrollment workflow with available-seat checks, duplicate-enrollment prevention, pending/approved/rejected states, and role-guarded API routes. Add focused tests for authorization and edge cases.

4. **Certificates**
   > Implement certificate issuance for eligible course completions and a student certificate view. Ensure certificates cannot be issued or viewed for another student's account by changing client-supplied IDs.

5. **Attendance**
   > Add attendance recording for authorized staff, scoped to a course and its active registrations, plus a student-only view of the student's own attendance history.

6. **Dashboard integration**
   > Replace illustrative dashboard metrics with authenticated API data for the current role. Preserve the supplied visual direction, provide loading and error states, and avoid exposing data outside the user's permissions.

7. **Quality review**
   > Review the current changes for role-authorization gaps, cross-student data access, input validation, responsive behavior, and missing tests. Report only actionable findings with file and line references; do not modify files.
