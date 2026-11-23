import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./db.js";
import { allowRoles, requireAuth } from "./middleware/auth.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const roles = ["admin", "staff", "student"];

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Authentication is not configured" });
    }

    const [users] = await pool.execute(
      "SELECT id, full_name, email, password_hash, role, student_id FROM users WHERE email = :email AND is_active = 1 LIMIT 1",
      { email: email.trim().toLowerCase() },
    );
    const user = users[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (user.role === "student" && !user.student_id) {
      return res.status(403).json({ error: "Student account is not linked to a student record" });
    }

    const token = jwt.sign(
      { sub: String(user.id), role: user.role, studentId: user.student_id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );
    return res.json({
      token,
      user: { id: user.id, name: user.full_name, email: user.email, role: user.role },
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/users", requireAuth, allowRoles("admin"), async (_req, res, next) => {
  try {
    const [users] = await pool.execute(
      "SELECT id, student_id, full_name, email, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 200",
    );
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/users", requireAuth, allowRoles("admin"), async (req, res, next) => {
  const { fullName, email, password, role, studentId } = req.body ?? {};
  if (![fullName, email, password].every((value) => typeof value === "string" && value.trim()) ||
      !roles.includes(role) || password.length < 12 ||
      (role === "student" && !Number.isInteger(studentId)) ||
      (role !== "student" && studentId != null)) {
    return res.status(400).json({ error: "Provide a name, email, password (at least 12 characters), valid role, and student link for student accounts" });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      "INSERT INTO users (full_name, email, password_hash, role, student_id) VALUES (:fullName, :email, :passwordHash, :role, :studentId)",
      { fullName: fullName.trim(), email: email.trim().toLowerCase(), passwordHash, role, studentId: role === "student" ? studentId : null },
    );
    return res.status(201).json({ id: result.insertId, fullName: fullName.trim(), email: email.trim().toLowerCase(), role });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "An account with that email already exists" });
    if (error.code === "ER_NO_REFERENCED_ROW_2") return res.status(404).json({ error: "Student record not found" });
    return next(error);
  }
});

app.get("/api/dashboard", requireAuth, async (req, res, next) => {
  try {
    if (req.user.role === "student") {
      const [[summary]] = await pool.execute(
        `SELECT
          (SELECT COUNT(*) FROM registrations WHERE student_id = :studentId AND status = 'approved') AS activeCourses,
          (SELECT COUNT(*) FROM certificates WHERE student_id = :studentId) AS certificates,
          (SELECT COUNT(*) FROM registrations WHERE student_id = :studentId AND status = 'pending') AS pendingRegistrations`,
        { studentId: req.user.studentId },
      );
      return res.json({ role: "student", summary });
    }

    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Unsupported account role" });
    const [[summary]] = await pool.execute(
      `SELECT
        (SELECT COUNT(*) FROM students WHERE status = 'active') AS students,
        (SELECT COUNT(*) FROM users WHERE role = 'staff' AND is_active = 1) AS staff,
        (SELECT COUNT(*) FROM courses WHERE status = 'active') AS courses,
        (SELECT COUNT(*) FROM registrations WHERE status = 'pending') AS pendingRegistrations,
        (SELECT COUNT(*) FROM certificates) AS certificates`,
    );
    return res.json({ role: req.user.role, summary });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/students", requireAuth, allowRoles("admin", "staff"), async (req, res, next) => {
  try {
    const [students] = await pool.execute(
      "SELECT id, student_number, full_name, email, phone, status, created_at FROM students ORDER BY created_at DESC LIMIT 200",
    );
    return res.json({ students });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/students", requireAuth, allowRoles("admin", "staff"), async (req, res, next) => {
  const { studentNumber, fullName, email, phone } = req.body ?? {};
  if (![studentNumber, fullName, email].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ error: "Student number, full name, and email are required" });
  }
  try {
    const [result] = await pool.execute(
      "INSERT INTO students (student_number, full_name, email, phone) VALUES (:studentNumber, :fullName, :email, :phone)",
      { studentNumber: studentNumber.trim(), fullName: fullName.trim(), email: email.trim().toLowerCase(), phone: typeof phone === "string" ? phone.trim() : null },
    );
    return res.status(201).json({ id: result.insertId, studentNumber, fullName, email });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Student number or email already exists" });
    return next(error);
  }
});

app.get("/api/courses", requireAuth, async (_req, res, next) => {
  try {
    const [courses] = await pool.execute(
      "SELECT id, course_code, title, description, capacity, status FROM courses WHERE status = 'active' ORDER BY title",
    );
    return res.json({ courses });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/courses", requireAuth, allowRoles("admin", "staff"), async (req, res, next) => {
  const { courseCode, title, description, capacity } = req.body ?? {};
  if (![courseCode, title].every((value) => typeof value === "string" && value.trim()) ||
      !Number.isInteger(capacity) || capacity < 1) {
    return res.status(400).json({ error: "Course code, title, and a positive capacity are required" });
  }
  try {
    const [result] = await pool.execute(
      "INSERT INTO courses (course_code, title, description, capacity, created_by) VALUES (:courseCode, :title, :description, :capacity, :createdBy)",
      { courseCode: courseCode.trim(), title: title.trim(), description: typeof description === "string" ? description.trim() : null, capacity, createdBy: req.user.sub },
    );
    return res.status(201).json({ id: result.insertId, courseCode, title, capacity });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Course code already exists" });
    return next(error);
  }
});

app.get("/api/registrations", requireAuth, async (req, res, next) => {
  try {
    const sql = req.user.role === "student"
      ? `SELECT r.id, r.course_id, c.title AS course_title, r.status, r.registered_at
         FROM registrations r JOIN courses c ON c.id = r.course_id
         WHERE r.student_id = :studentId ORDER BY r.registered_at DESC`
      : `SELECT r.id, r.student_id, s.full_name AS student_name, r.course_id, c.title AS course_title, r.status, r.registered_at
         FROM registrations r JOIN students s ON s.id = r.student_id JOIN courses c ON c.id = r.course_id
         ORDER BY r.registered_at DESC LIMIT 300`;
    const [registrations] = await pool.execute(sql, req.user.role === "student" ? { studentId: req.user.studentId } : {});
    return res.json({ registrations });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/registrations", requireAuth, async (req, res, next) => {
  const { courseId } = req.body ?? {};
  if (!Number.isInteger(courseId) || courseId < 1) return res.status(400).json({ error: "A valid course ID is required" });
  const studentId = req.user.role === "student" ? req.user.studentId : req.body.studentId;
  if (!Number.isInteger(studentId) || studentId < 1 ||
      (req.user.role !== "student" && !["admin", "staff"].includes(req.user.role))) {
    return res.status(403).json({ error: "You cannot register this student" });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const [courses] = await connection.execute(
      "SELECT capacity, status FROM courses WHERE id = :courseId FOR UPDATE",
      { courseId },
    );
    if (!courses.length || courses[0].status !== "active") {
      await connection.rollback();
      return res.status(404).json({ error: "Active course not found" });
    }
    const [counts] = await connection.execute(
      "SELECT COUNT(*) AS enrolled FROM registrations WHERE course_id = :courseId AND status IN ('pending', 'approved', 'completed')",
      { courseId },
    );
    if (counts[0].enrolled >= courses[0].capacity) {
      await connection.rollback();
      return res.status(409).json({ error: "Course has reached its registration capacity" });
    }
    const [result] = await connection.execute(
      "INSERT INTO registrations (student_id, course_id, status) VALUES (:studentId, :courseId, 'pending')",
      { studentId, courseId },
    );
    await connection.commit();
    return res.status(201).json({ id: result.insertId, studentId, courseId, status: "pending" });
  } catch (error) {
    if (connection) await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Student is already registered for this course" });
    if (error.code === "ER_NO_REFERENCED_ROW_2") return res.status(404).json({ error: "Student or course not found" });
    return next(error);
  } finally {
    if (connection) connection.release();
  }
});

app.patch("/api/registrations/:id", requireAuth, allowRoles("admin", "staff"), async (req, res, next) => {
  const registrationId = Number(req.params.id);
  const { status } = req.body ?? {};
  if (!Number.isInteger(registrationId) || registrationId < 1 ||
      !["approved", "rejected", "completed"].includes(status)) {
    return res.status(400).json({ error: "A valid registration ID and status are required" });
  }
  try {
    const [result] = await pool.execute(
      "UPDATE registrations SET status = :status, reviewed_by = :reviewedBy, reviewed_at = CURRENT_TIMESTAMP WHERE id = :registrationId",
      { status, reviewedBy: req.user.sub, registrationId },
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Registration not found" });
    return res.json({ id: registrationId, status });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/attendance", requireAuth, async (req, res, next) => {
  try {
    const sql = req.user.role === "student"
      ? `SELECT a.id, a.class_date, a.status, c.title AS course_title
         FROM attendance a JOIN registrations r ON r.id = a.registration_id
         JOIN courses c ON c.id = r.course_id
         WHERE r.student_id = :studentId ORDER BY a.class_date DESC`
      : `SELECT a.id, a.class_date, a.status, r.student_id, s.full_name AS student_name, c.title AS course_title
         FROM attendance a JOIN registrations r ON r.id = a.registration_id
         JOIN students s ON s.id = r.student_id JOIN courses c ON c.id = r.course_id
         ORDER BY a.class_date DESC LIMIT 500`;
    const [records] = await pool.execute(sql, req.user.role === "student" ? { studentId: req.user.studentId } : {});
    return res.json({ attendance: records });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/attendance", requireAuth, allowRoles("admin", "staff"), async (req, res, next) => {
  const { registrationId, classDate, status } = req.body ?? {};
  const dateIsValid = typeof classDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(classDate) &&
    !Number.isNaN(Date.parse(`${classDate}T00:00:00Z`)) &&
    new Date(`${classDate}T00:00:00Z`).toISOString().slice(0, 10) === classDate;
  if (!Number.isInteger(registrationId) || registrationId < 1 || !dateIsValid ||
      !["present", "absent", "late", "excused"].includes(status)) {
    return res.status(400).json({ error: "Registration ID, valid class date, and attendance status are required" });
  }
  try {
    const [registrations] = await pool.execute(
      "SELECT id FROM registrations WHERE id = :registrationId AND status IN ('approved', 'completed') LIMIT 1",
      { registrationId },
    );
    if (!registrations.length) return res.status(409).json({ error: "Attendance requires an approved course registration" });
    const [result] = await pool.execute(
      "INSERT INTO attendance (registration_id, class_date, status, recorded_by) VALUES (:registrationId, :classDate, :status, :recordedBy)",
      { registrationId, classDate, status, recordedBy: req.user.sub },
    );
    return res.status(201).json({ id: result.insertId, registrationId, classDate, status });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Attendance is already recorded for this registration and date" });
    if (error.code === "ER_NO_REFERENCED_ROW_2") return res.status(404).json({ error: "Registration not found" });
    return next(error);
  }
});

app.get("/api/certificates", requireAuth, async (req, res, next) => {
  try {
    const sql = req.user.role === "student"
      ? "SELECT id, certificate_number, course_id, title, issued_at FROM certificates WHERE student_id = :studentId ORDER BY issued_at DESC"
      : `SELECT c.id, c.certificate_number, c.student_id, s.full_name AS student_name, c.course_id, c.title, c.issued_at
         FROM certificates c JOIN students s ON s.id = c.student_id ORDER BY c.issued_at DESC LIMIT 300`;
    const [certificates] = await pool.execute(sql, req.user.role === "student" ? { studentId: req.user.studentId } : {});
    return res.json({ certificates });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/certificates", requireAuth, allowRoles("admin", "staff"), async (req, res, next) => {
  const { studentId, courseId, certificateNumber, title } = req.body ?? {};
  if (!Number.isInteger(studentId) || !Number.isInteger(courseId) ||
      ![certificateNumber, title].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ error: "Student, course, certificate number, and title are required" });
  }
  try {
    const [eligible] = await pool.execute(
      "SELECT id FROM registrations WHERE student_id = :studentId AND course_id = :courseId AND status = 'completed' LIMIT 1",
      { studentId, courseId },
    );
    if (!eligible.length) return res.status(409).json({ error: "A completed registration is required before issuing a certificate" });
    const [result] = await pool.execute(
      "INSERT INTO certificates (student_id, course_id, certificate_number, title, issued_by) VALUES (:studentId, :courseId, :certificateNumber, :title, :issuedBy)",
      { studentId, courseId, certificateNumber: certificateNumber.trim(), title: title.trim(), issuedBy: req.user.sub },
    );
    return res.status(201).json({ id: result.insertId, studentId, courseId, certificateNumber, title });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Certificate number already exists" });
    if (error.code === "ER_NO_REFERENCED_ROW_2") return res.status(404).json({ error: "Student or course not found" });
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ error: "An unexpected server error occurred" });
});

app.listen(port, () => console.log(`Bakka API listening on port ${port}`));
