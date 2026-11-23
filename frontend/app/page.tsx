"use client";

import { FormEvent, MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Moon,
  Plus,
  Play,
  Printer,
  Search,
  Settings,
  Sun,
  UserRound,
  UserRoundPlus,
  UsersRound,
  X,
} from "lucide-react";

type Role = "Admin" | "Staff" | "Student";
type NavItem = { label: string; icon: typeof Home };
type WorkspaceRecord = {
  id: string;
  primary: string;
  secondary: string;
  course: string;
  status: string;
  date: string;
};
type ClickBubble = { id: number; left: number; top: number; size: number; delay: number };

const navigation: Record<Role, NavItem[]> = {
  Admin: [
    { label: "Dashboard", icon: Home },
    { label: "User Management", icon: UsersRound },
    { label: "Students", icon: GraduationCap },
    { label: "Staff", icon: UserRound },
    { label: "Courses", icon: BookOpen },
    { label: "Registrations", icon: ClipboardCheck },
    { label: "Attendance", icon: CalendarDays },
    { label: "Certificates", icon: Award },
    { label: "Reports & Analytics", icon: ChartNoAxesColumnIncreasing },
    { label: "Notifications", icon: Bell },
    { label: "Settings", icon: Settings },
  ],
  Staff: [
    { label: "Dashboard", icon: Home },
    { label: "Students", icon: GraduationCap },
    { label: "Courses", icon: BookOpen },
    { label: "Registrations", icon: ClipboardCheck },
    { label: "Attendance", icon: CalendarDays },
    { label: "Certificates", icon: Award },
    { label: "Notifications", icon: Bell },
  ],
  Student: [
    { label: "Dashboard", icon: Home },
    { label: "My Courses", icon: BookOpen },
    { label: "My Registrations", icon: ClipboardCheck },
    { label: "My Attendance", icon: CalendarDays },
    { label: "My Certificates", icon: Award },
    { label: "Notifications", icon: Bell },
    { label: "My Profile", icon: UserRound },
  ],
};

const names: Record<Role, string> = {
  Admin: "Abeer Ali",
  Staff: "Omar Khalid",
  Student: "Fatima Ahmed",
};

const activityItems = [
  { icon: UserRoundPlus, color: "violet", title: "New student registered", detail: "Fatima Ahmed · 2 min ago" },
  { icon: Check, color: "green", title: "Course registration approved", detail: "Ahmed Hassan · 5 min ago" },
  { icon: Award, color: "gold", title: "Certificate issued", detail: "Aisha Mohamed · 10 min ago" },
  { icon: BookOpen, color: "violet", title: "New course added", detail: "Data Science · 15 min ago" },
];

const courses = [
  { title: "Web Development", subtitle: "Complete Course", rating: "4.9", students: "1.2k students", image: "code" },
  { title: "Data Science", subtitle: "for Beginners", rating: "4.8", students: "980 students", image: "data" },
  { title: "UI/UX Design", subtitle: "Masterclass", rating: "4.9", students: "650 students", image: "design" },
];

const classes = [
  { day: "24", month: "Nov", title: "Web Development", time: "9:00 AM – 11:00 AM" },
  { day: "26", month: "Nov", title: "Data Science", time: "2:00 PM – 4:00 PM" },
  { day: "28", month: "Nov", title: "UI/UX Design", time: "10:00 AM – 12:00 PM" },
];

const workspaceRecords: Record<string, WorkspaceRecord[]> = {
  "User Management": [
    { id: "USR-1001", primary: "Abeer Ali", secondary: "abeer@bakka.edu", course: "Administrator", status: "Active", date: "Nov 22, 2025" },
    { id: "USR-1002", primary: "Omar Khalid", secondary: "omar@bakka.edu", course: "Staff", status: "Active", date: "Nov 19, 2025" },
    { id: "USR-1003", primary: "Fatima Ahmed", secondary: "fatima@example.com", course: "Student", status: "Active", date: "Nov 17, 2025" },
    { id: "USR-1004", primary: "Ahmed Hassan", secondary: "ahmed@example.com", course: "Student", status: "Pending", date: "Nov 16, 2025" },
  ],
  Students: [
    { id: "STU-1024", primary: "Fatima Ahmed", secondary: "fatima@example.com", course: "Web Development", status: "Active", date: "Nov 22, 2025" },
    { id: "STU-1023", primary: "Ahmed Hassan", secondary: "ahmed@example.com", course: "Data Science", status: "Active", date: "Nov 21, 2025" },
    { id: "STU-1022", primary: "Aisha Mohamed", secondary: "aisha@example.com", course: "UI/UX Design", status: "Active", date: "Nov 20, 2025" },
    { id: "STU-1021", primary: "Khalid Saleh", secondary: "khalid@example.com", course: "Web Development", status: "Pending", date: "Nov 18, 2025" },
  ],
  Staff: [
    { id: "STF-0048", primary: "Omar Khalid", secondary: "omar@bakka.edu", course: "Web Development", status: "Active", date: "Nov 19, 2025" },
    { id: "STF-0047", primary: "Sara Ibrahim", secondary: "sara@bakka.edu", course: "Data Science", status: "Active", date: "Nov 15, 2025" },
    { id: "STF-0046", primary: "Yousef Ali", secondary: "yousef@bakka.edu", course: "UI/UX Design", status: "On Leave", date: "Nov 11, 2025" },
  ],
  Courses: [
    { id: "CRS-0012", primary: "Web Development", secondary: "WEB-101 · 12 weeks", course: "Omar Khalid", status: "Active", date: "Nov 24, 2025" },
    { id: "CRS-0011", primary: "Data Science", secondary: "DS-204 · 10 weeks", course: "Sara Ibrahim", status: "Active", date: "Nov 26, 2025" },
    { id: "CRS-0010", primary: "UI/UX Design", secondary: "UX-110 · 8 weeks", course: "Yousef Ali", status: "Active", date: "Nov 28, 2025" },
    { id: "CRS-0009", primary: "Digital Marketing", secondary: "DM-120 · 6 weeks", course: "Sara Ibrahim", status: "Full", date: "Dec 02, 2025" },
  ],
  Registrations: [
    { id: "REG-0620", primary: "Fatima Ahmed", secondary: "STU-1024", course: "Web Development", status: "Pending", date: "Nov 22, 2025" },
    { id: "REG-0619", primary: "Ahmed Hassan", secondary: "STU-1023", course: "Data Science", status: "Approved", date: "Nov 21, 2025" },
    { id: "REG-0618", primary: "Aisha Mohamed", secondary: "STU-1022", course: "UI/UX Design", status: "Approved", date: "Nov 20, 2025" },
    { id: "REG-0617", primary: "Khalid Saleh", secondary: "STU-1021", course: "Web Development", status: "Rejected", date: "Nov 18, 2025" },
  ],
  Attendance: [
    { id: "ATT-0892", primary: "Fatima Ahmed", secondary: "Nov 22 · 9:00 AM", course: "Web Development", status: "Present", date: "Nov 22, 2025" },
    { id: "ATT-0891", primary: "Ahmed Hassan", secondary: "Nov 22 · 9:00 AM", course: "Web Development", status: "Late", date: "Nov 22, 2025" },
    { id: "ATT-0890", primary: "Aisha Mohamed", secondary: "Nov 21 · 2:00 PM", course: "Data Science", status: "Present", date: "Nov 21, 2025" },
    { id: "ATT-0889", primary: "Khalid Saleh", secondary: "Nov 21 · 2:00 PM", course: "Data Science", status: "Absent", date: "Nov 21, 2025" },
  ],
  Certificates: [
    { id: "BAK-2025-0580", primary: "Aisha Mohamed", secondary: "BAK-2025-0580", course: "UI/UX Design Masterclass", status: "Issued", date: "Nov 22, 2025" },
    { id: "BAK-2025-0579", primary: "Ahmed Hassan", secondary: "BAK-2025-0579", course: "Data Science for Beginners", status: "Issued", date: "Nov 20, 2025" },
    { id: "BAK-2025-0578", primary: "Fatima Ahmed", secondary: "BAK-2025-0578", course: "Web Development", status: "Issued", date: "Nov 18, 2025" },
  ],
  "Reports & Analytics": [
    { id: "RPT-1122", primary: "Monthly registrations", secondary: "November 2025", course: "620 registrations", status: "Ready", date: "Nov 22, 2025" },
    { id: "RPT-1121", primary: "Course completion", secondary: "Q4 2025", course: "84% completion", status: "Ready", date: "Nov 20, 2025" },
    { id: "RPT-1120", primary: "Attendance summary", secondary: "November 2025", course: "92% attendance", status: "Ready", date: "Nov 18, 2025" },
  ],
  Notifications: [
    { id: "NTF-001", primary: "New student registered", secondary: "Fatima Ahmed joined Web Development", course: "Students", status: "New", date: "2 min ago" },
    { id: "NTF-002", primary: "Registration needs review", secondary: "A new course request is waiting", course: "Registrations", status: "New", date: "5 min ago" },
    { id: "NTF-003", primary: "Certificate issued", secondary: "Aisha Mohamed · UI/UX Design", course: "Certificates", status: "Read", date: "10 min ago" },
  ],
  "My Courses": [
    { id: "CRS-0012", primary: "Web Development", secondary: "Omar Khalid · 12 weeks", course: "Progress 72%", status: "In Progress", date: "Next class Nov 24" },
    { id: "CRS-0011", primary: "Data Science", secondary: "Sara Ibrahim · 10 weeks", course: "Progress 38%", status: "In Progress", date: "Next class Nov 26" },
    { id: "CRS-0008", primary: "Digital Literacy", secondary: "Maha Noor · 4 weeks", course: "Completed", status: "Completed", date: "Oct 28, 2025" },
  ],
  "My Registrations": [
    { id: "REG-0620", primary: "Web Development", secondary: "WEB-101", course: "Omar Khalid", status: "Pending", date: "Nov 22, 2025" },
    { id: "REG-0613", primary: "Data Science", secondary: "DS-204", course: "Sara Ibrahim", status: "Approved", date: "Nov 10, 2025" },
  ],
  "My Attendance": [
    { id: "ATT-0892", primary: "Web Development", secondary: "Nov 22 · 9:00 AM", course: "Present", status: "Present", date: "Nov 22, 2025" },
    { id: "ATT-0871", primary: "Data Science", secondary: "Nov 19 · 2:00 PM", course: "Present", status: "Present", date: "Nov 19, 2025" },
    { id: "ATT-0864", primary: "Web Development", secondary: "Nov 17 · 9:00 AM", course: "Late", status: "Late", date: "Nov 17, 2025" },
  ],
  "My Certificates": [
    { id: "BAK-2025-0578", primary: "Fatima Ahmed", secondary: "BAK-2025-0578", course: "Web Development", status: "Issued", date: "Nov 18, 2025" },
    { id: "BAK-2025-0510", primary: "Fatima Ahmed", secondary: "BAK-2025-0510", course: "Digital Literacy", status: "Issued", date: "Oct 28, 2025" },
  ],
};

const workspaceDescriptions: Record<string, string> = {
  "User Management": "Manage account access and assign the correct role to every user.",
  Students: "Student profiles, enrollment details, and registration history.",
  Staff: "Training team members, assigned courses, and account status.",
  Courses: "Course catalog, instructors, capacity, and upcoming sessions.",
  Registrations: "Review and manage course enrollment requests.",
  Attendance: "Track attendance for students in every active course.",
  Certificates: "Issue, review, and print certificates for completed courses.",
  "Reports & Analytics": "Center-wide enrollment, attendance, and completion reports.",
  Notifications: "Recent updates and actions that need your attention.",
  "My Courses": "Your current learning plan and course progress.",
  "My Registrations": "Track the status of your course enrollment requests.",
  "My Attendance": "Your attendance history across enrolled courses.",
  "My Certificates": "Your verified course achievements and certificates.",
};

function WorkspaceContent({ role, label, query }: { role: Role; label: string; query: string }) {
  const [records, setRecords] = useState<WorkspaceRecord[]>(workspaceRecords[label] ?? []);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<WorkspaceRecord | null>(null);
  const [form, setForm] = useState({ primary: "", secondary: "", course: "" });

  const isCertificatePage = label === "Certificates" || label === "My Certificates";
  const isSettingsPage = label === "Settings" || label === "My Profile";
  const canCreate = (role !== "Student" && !["Reports & Analytics", "Notifications"].includes(label)) ||
    (role === "Student" && label === "My Registrations");
  const createLabel = label === "Certificates" ? "Issue Certificate" : label === "Registrations" ? "New Registration" : label === "My Registrations" ? "Request Course" : label === "Attendance" ? "Record Attendance" : label === "Courses" ? "Add Course" : label === "Staff" ? "Add Staff" : label === "User Management" ? "Add User" : "Register Student";
  const filteredRecords = useMemo(() => records.filter((record) => {
    const matchesSearch = `${record.id} ${record.primary} ${record.secondary} ${record.course} ${record.status}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || record.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }), [records, query, statusFilter]);
  const statuses = useMemo(() => ["All statuses", ...new Set(records.map((record) => record.status))], [records]);
  const selectedCertificate = selectedRecord ?? records[0] ?? null;

  function addRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextRecord: WorkspaceRecord = {
      id: `${label === "Certificates" ? "BAK-2025" : "BAK"}-${String(Date.now()).slice(-4)}`,
      primary: form.primary.trim(),
      secondary: form.secondary.trim() || "—",
      course: form.course.trim() || "—",
      status: label === "Certificates" ? "Issued" : label === "Registrations" ? "Pending" : "Active",
      date: new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date()),
    };
    setRecords((current) => [nextRecord, ...current]);
    setForm({ primary: "", secondary: "", course: "" });
    setModalOpen(false);
  }

  function updateRecordStatus(id: string, status: string) {
    setRecords((current) => current.map((record) => record.id === id ? { ...record, status } : record));
    setSelectedRecord((current) => current?.id === id ? { ...current, status } : current);
  }

  if (isSettingsPage) {
    return (
      <section className="workspace">
        <div className="workspace-heading"><div><span className="eyebrow">{role.toUpperCase()} WORKSPACE</span><h1>{label}</h1><p>Manage your Bakka Training Center preferences and account details.</p></div></div>
        <div className="settings-grid">
          <section className="panel settings-card"><div className="settings-title"><span className="heading-icon"><UserRound size={20} /></span><div><h2>Personal information</h2><p>Update your account profile.</p></div></div><label>Full name<input defaultValue={names[role]} /></label><label>Email address<input defaultValue={`${names[role].toLowerCase().replace(" ", ".")}@bakka.edu`} type="email" /></label><label>Account role<input value={role} readOnly /></label><button className="primary-button" type="button">Save changes</button></section>
          <section className="panel settings-card"><div className="settings-title"><span className="heading-icon amber"><Bell size={20} /></span><div><h2>Notifications</h2><p>Choose the updates you receive.</p></div></div>{["Course and registration updates", "Attendance reminders", "Certificate announcements"].map((item) => <label className="setting-toggle" key={item}><span>{item}</span><input type="checkbox" defaultChecked /></label>)}<button className="primary-button" type="button">Save preferences</button></section>
        </div>
      </section>
    );
  }

  return (
    <section className="workspace">
      <div className="workspace-heading">
        <div><span className="eyebrow">{role.toUpperCase()} WORKSPACE</span><h1>{label}</h1><p>{workspaceDescriptions[label] ?? "Browse and manage your Bakka Training Center records."}</p></div>
        <div className="workspace-actions"><span className="workspace-date"><CalendarDays size={15} /> Nov 2025</span>{canCreate && <button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={16} />{createLabel}</button>}</div>
      </div>
      <div className="workspace-stats">
        <article className="panel workspace-stat"><span className="heading-icon"><FileCheck2 size={19} /></span><div><small>Total records</small><strong>{records.length.toLocaleString()}</strong></div></article>
        <article className="panel workspace-stat"><span className="heading-icon cap"><Clock3 size={19} /></span><div><small>Needs attention</small><strong>{records.filter((record) => ["pending", "late", "new"].includes(record.status.toLowerCase())).length}</strong></div></article>
        <article className="panel workspace-stat"><span className="heading-icon amber"><Check size={19} /></span><div><small>Active / completed</small><strong>{records.filter((record) => ["active", "approved", "present", "issued", "completed", "ready"].includes(record.status.toLowerCase())).length}</strong></div></article>
      </div>
      {isCertificatePage && selectedCertificate && (
        <section className="certificate-panel panel">
          <div className="certificate-tools"><div><span className="eyebrow">BAKKA TRAINING CENTER</span><h2>Certificate preview</h2></div><button className="secondary-button print-button" onClick={() => window.print()}><Printer size={16} />Print certificate</button></div>
          <article className="certificate-sheet">
            <div className="certificate-inner">
              <span className="certificate-brand"><GraduationCap size={25} /> BAKKA TRAINING CENTER</span>
              <span className="certificate-kicker">CERTIFICATE OF ACHIEVEMENT</span>
              <h2>This certificate is proudly presented to</h2>
              <strong className="certificate-recipient">{selectedCertificate.primary}</strong>
              <p>For successfully completing the course</p>
              <strong className="certificate-course">{selectedCertificate.course}</strong>
              <div className="certificate-footer"><span><small>DATE ISSUED</small><strong>{selectedCertificate.date}</strong></span><span className="certificate-seal"><Award size={28} /></span><span><small>CERTIFICATE ID</small><strong>{selectedCertificate.id}</strong></span></div>
              <span className="certificate-motto">LEARN · TRAIN · GROW</span>
            </div>
          </article>
        </section>
      )}
      <section className="panel records-panel">
        <div className="records-heading"><div><h2>{isCertificatePage ? "Issued certificates" : `${label} list`}</h2><p>{filteredRecords.length} records shown</p></div><div className="records-filters"><label className="table-search"><Search size={15} /><input value={query} readOnly placeholder="Search records" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></div>
        <div className="table-scroll"><table className="records-table"><thead><tr><th>{isCertificatePage ? "Certificate" : "Name / record"}</th><th>{isCertificatePage ? "Recipient" : "Contact / details"}</th><th>{isCertificatePage ? "Course" : "Course / role"}</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>
          {filteredRecords.map((record) => <tr key={record.id}><td><strong>{record.primary}</strong><small>{record.id}</small></td><td>{record.secondary}</td><td>{record.course}</td><td><span className={`record-status ${record.status.toLowerCase().replace(/ /g, "-")}`}>{record.status}</span></td><td>{record.date}</td><td><div className="row-actions"><button title={isCertificatePage ? "Preview certificate" : "View record"} aria-label={isCertificatePage ? `Preview ${record.id}` : `View ${record.primary}`} onClick={() => setSelectedRecord(record)}><Eye size={16} /></button>{isCertificatePage && <button title="Print certificate" aria-label={`Print ${record.id}`} onClick={() => { setSelectedRecord(record); window.setTimeout(() => window.print(), 50); }}><Download size={16} /></button>}{label === "Registrations" && role !== "Student" && record.status === "Pending" && <button title="Approve registration" aria-label={`Approve ${record.id}`} onClick={() => updateRecordStatus(record.id, "Approved")}><Check size={16} /></button>}</div></td></tr>)}
          {!filteredRecords.length && <tr><td className="empty-row" colSpan={6}>No records match this search or status.</td></tr>}
        </tbody></table></div>
        <div className="records-foot"><span>Showing {filteredRecords.length} of {records.length} records</span><span>Demo data · changes stay in this browser session</span></div>
      </section>
      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close"><X size={19} /></button><span className="heading-icon"><Plus size={19} /></span><h2 id="modal-title">{createLabel}</h2><p>Add a record to the current demo list.</p><form onSubmit={addRecord}><label>{label === "Certificates" ? "Student name" : label === "Courses" ? "Course title" : "Name"}<input required autoFocus value={form.primary} onChange={(event) => setForm({ ...form, primary: event.target.value })} /></label><label>{label === "Certificates" ? "Certificate number" : "Email / reference"}<input value={form.secondary} onChange={(event) => setForm({ ...form, secondary: event.target.value })} /></label><label>Course / details<input value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })} /></label><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setModalOpen(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={15} />Save record</button></div></form></section></div>}
      {selectedRecord && !isCertificatePage && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedRecord(null); }}><section className="form-modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="modal-close" onClick={() => setSelectedRecord(null)} aria-label="Close"><X size={19} /></button><span className="heading-icon"><Eye size={19} /></span><h2 id="detail-title">{selectedRecord.primary}</h2><p>Record details · {selectedRecord.id}</p><dl className="record-details"><div><dt>Contact / reference</dt><dd>{selectedRecord.secondary}</dd></div><div><dt>Course / role</dt><dd>{selectedRecord.course}</dd></div><div><dt>Status</dt><dd><span className={`record-status ${selectedRecord.status.toLowerCase().replace(/ /g, "-")}`}>{selectedRecord.status}</span></dd></div><div><dt>Date</dt><dd>{selectedRecord.date}</dd></div></dl>{label === "Registrations" && selectedRecord.status === "Pending" && role !== "Student" && <div className="modal-actions"><button className="secondary-button" onClick={() => updateRecordStatus(selectedRecord.id, "Rejected")}>Reject</button><button className="primary-button" onClick={() => updateRecordStatus(selectedRecord.id, "Approved")}><Check size={15} />Approve registration</button></div>}</section></div>}
    </section>
  );
}

function Logo({ onOpenImage }: { onOpenImage: (src: string, title: string) => void }) {
  return (
    <div className="brand">
      <button className="brand-mark" type="button" aria-label="Open Bakka logo" onClick={() => onOpenImage("/images/bakka-logo-premium.svg", "Bakka Training Center")} />
      <div className="brand-name">Bakka</div>
      <div className="brand-subtitle">Training Center</div>
      <div className="brand-motto">Learn · Train · Grow</div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  title,
  change,
  tone,
  dark = false,
  onNavigate,
}: {
  icon: typeof Home;
  value: string;
  title: string;
  change: string;
  tone: string;
  dark?: boolean;
  onNavigate: () => void;
}) {
  return (
    <article className={`stat-card ${dark ? "stat-dark" : ""}`}>
      <div className={`stat-icon ${tone}`}><Icon size={22} /></div>
      <button type="button" className="stat-arrow" aria-label={`Open ${title}`} onClick={onNavigate}><ArrowRight size={16} /></button>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-change"><ArrowUpRight size={15} /> {change}</div>
      <svg className="sparkline" viewBox="0 0 110 42" aria-hidden="true">
        <path d="M2 36 C16 34 15 23 28 27 S44 15 57 22 S75 8 86 13 S99 4 108 2" />
      </svg>
    </article>
  );
}

function RegistrationChart() {
  const points = [42, 63, 55, 80, 68, 87];
  const coordinates = points.map((point, index) => ({ x: index * 20, y: 100 - point }));
  const line = coordinates.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = coordinates[index - 1];
    const midpoint = (previous.x + point.x) / 2;
    return `${path} C ${midpoint} ${previous.y} ${midpoint} ${point.y} ${point.x} ${point.y}`;
  }, "");
  const area = `${line} L 100 100 L 0 100 Z`;
  return (
    <section className="panel analytics">
      <div className="panel-heading">
        <div className="heading-label"><span className="heading-icon"><ChartNoAxesColumnIncreasing size={20} /></span><h2>Registration Analytics</h2></div>
        <div className="periods">{["1M", "3M", "6M", "1Y"].map((item) => <button className={item === "6M" ? "selected" : ""} key={item}>{item}</button>)}<ChevronDown size={14} /></div>
      </div>
      <div className="chart-wrap">
        <div className="chart-y">{["1,000", "750", "500", "250", "0"].map((label) => <span key={label}>{label}</span>)}</div>
        <div className="chart-area">
          <div className="grid-lines"><i /><i /><i /><i /><i /></div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart-svg" aria-label="Registration trend rising from January to June">
            <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8038ed" stopOpacity=".52" /><stop offset="100%" stopColor="#b788f6" stopOpacity=".12" /></linearGradient></defs>
            <path d={area} fill="url(#chartFill)" />
            <path d={line} fill="none" stroke="#6322c8" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            {points.map((point, index) => <circle key={index} cx={index * 20} cy={100 - point} r="1.6" fill="#6426ca" stroke="#fff" strokeWidth=".7" vectorEffect="non-scaling-stroke" />)}
          </svg>
          <div className="chart-x">{["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => <span key={month}>{month}</span>)}</div>
          <div className="chart-tooltip"><strong>980 Registrations</strong><span>↗ 20.1%</span></div>
        </div>
      </div>
    </section>
  );
}

function DashboardContent({ role, onOpenImage, onNavigate }: { role: Role; onOpenImage: (src: string, title: string) => void; onNavigate: (label: string) => void }) {
  const isStudent = role === "Student";
  const stats = isStudent
    ? [
        { icon: BookOpen, value: "3", title: "My Courses", change: "2 in progress", tone: "green" },
        { icon: ClipboardCheck, value: "2", title: "Registrations", change: "1 awaiting review", tone: "violet", dark: true },
        { icon: CalendarDays, value: "92%", title: "Attendance", change: "On track", tone: "green" },
        { icon: Award, value: "2", title: "Certificates", change: "View achievements", tone: "gold", dark: true },
      ]
    : role === "Staff"
      ? [
          { icon: GraduationCap, value: "186", title: "My Students", change: "12.5%", tone: "violet" },
          { icon: UsersRound, value: "8", title: "My Classes", change: "3.2%", tone: "violet", dark: true },
          { icon: ClipboardCheck, value: "42", title: "Pending Reviews", change: "Needs attention", tone: "green" },
          { icon: Award, value: "28", title: "Certificates Issued", change: "18.7%", tone: "gold", dark: true },
        ]
      : [
          { icon: UsersRound, value: "1,250", title: "Total Students", change: "12.5%", tone: "violet" },
          { icon: UserRound, value: "48", title: "Staff Members", change: "8.3%", tone: "violet", dark: true },
          { icon: BookOpen, value: "980", title: "Total Courses", change: "15.2%", tone: "green" },
          { icon: ClipboardCheck, value: "620", title: "Registrations", change: "20.1%", tone: "violet", dark: true },
          { icon: Award, value: "580", title: "Certificates Issued", change: "18.7%", tone: "gold" },
          { icon: Play, value: "12", title: "Active Courses", change: "5.6%", tone: "violet", dark: true },
        ];

  const statDestinations: Record<string, string> = {
    "Total Students": "Students",
    "Staff Members": "Staff",
    "Total Courses": "Courses",
    Registrations: "Registrations",
    "Certificates Issued": "Certificates",
    "Active Courses": "Courses",
    "My Courses": "My Courses",
    "My Students": "Students",
    "My Classes": "Attendance",
    "Pending Reviews": "Registrations",
    Attendance: "My Attendance",
    Certificates: "My Certificates",
  };

  return (
    <>
      <div className={`stats-grid ${isStudent ? "student-stats" : ""}`}>
        {stats.map((stat) => <StatCard key={stat.title} {...stat} onNavigate={() => onNavigate(role === "Student" && stat.title === "Registrations" ? "My Registrations" : statDestinations[stat.title] ?? "Dashboard")} />)}
      </div>
      <div className="middle-grid">
        <RegistrationChart />
        <section className="panel enrollment">
          <div className="panel-heading"><div className="heading-label"><span className="heading-icon cap"><GraduationCap size={21} /></span><h2>Enrollment Rate</h2></div><button type="button" className="muted-arrow arrow-action" aria-label="Open reports and analytics" onClick={() => onNavigate(role === "Admin" ? "Reports & Analytics" : role === "Staff" ? "Registrations" : "My Registrations")}><ArrowRight size={16} /></button></div>
          <div className="donut"><div><strong>78%</strong><span><ArrowUpRight size={14} /> 12%</span></div></div>
          <div className="enrollment-foot"><span>+12% from last period</span><div className="mini-bars">{[12, 19, 16, 25, 30, 37, 45].map((height, i) => <i key={i} style={{ height }} />)}</div></div>
        </section>
        <section className="panel activity">
          <div className="panel-heading"><div className="heading-label"><span className="heading-icon amber"><Activity size={19} /></span><h2>Recent Activities</h2></div><button type="button" className="text-button" onClick={() => onNavigate("Notifications")}>View All <ArrowRight size={14} /></button></div>
          <button className="activity-illustration" type="button" aria-label="Open diploma image" onClick={() => onOpenImage("/images/cap-diploma.png", "Diploma")} />
          <div className="activity-list">{activityItems.map(({ icon: Icon, color, title, detail }) => <div className="activity-item" key={title}><span className="timeline-dot" /><span className={`activity-icon ${color}`}><Icon size={18} /></span><div><strong>{title}</strong><small>{detail}</small></div></div>)}</div>
        </section>
      </div>
      <div className="bottom-grid">
        <section className="panel popular">
          <div className="panel-heading"><div className="heading-label"><span className="heading-icon amber"><ChartNoAxesColumnIncreasing size={19} /></span><h2>Popular Courses</h2></div><button type="button" className="text-button" onClick={() => onNavigate(role === "Student" ? "My Courses" : "Courses")}>View All <ArrowRight size={14} /></button></div>
          <div className="course-list">{courses.map((course) => {
            const courseImages: Record<string, string> = { code: "/images/course-web.png", data: "/images/course-data.png", design: "/images/course-design.png" };
            return <article className="course-card" key={course.title}><button className={`course-art image-button ${course.image}`} type="button" aria-label={`Open ${course.title} course image`} onClick={() => onOpenImage(courseImages[course.image], `${course.title} - ${course.subtitle}`)} /><div className="course-copy"><strong>{course.title}</strong><strong>{course.subtitle}</strong><small>{course.rating} <span>★</span> ({course.students})</small></div><button className="round-arrow" aria-label={`Open ${course.title}`} onClick={() => onOpenImage(courseImages[course.image], `${course.title} - ${course.subtitle}`)}><ArrowRight size={15} /></button></article>;
          })}</div>
        </section>
        <section className="panel upcoming">
          <div className="panel-heading"><div className="heading-label"><span className="heading-icon amber"><CalendarDays size={19} /></span><h2>Upcoming Classes</h2></div><button type="button" className="text-button" onClick={() => onNavigate(role === "Student" ? "My Attendance" : "Attendance")}>View Calendar <ArrowRight size={14} /></button></div>
          <div className="class-list">{classes.map((item) => <article className="class-item" key={item.day}><div className="class-date"><strong>{item.day}</strong><span>{item.month}</span></div><div className="class-info"><strong>{item.title}</strong><small>{item.time}</small></div><span className="status-pill">On Time</span><div className="avatars"><span>A</span><span>M</span></div></article>)}</div>
        </section>
        <section className="promo">
          <button className="trophy image-button" type="button" aria-label="Open Bakka excellence trophy" onClick={() => onOpenImage("/images/promo-trophy.png", "Excellence in Education")} /><div><h2>Excellence<br />in Education</h2><p>Together, we build a brighter future<br />at Bakka Training Center.</p><button type="button" onClick={() => onNavigate(role === "Student" ? "My Courses" : "Courses")}>Explore More <ArrowRight size={14} /></button></div>
        </section>
      </div>
    </>
  );
}

export default function HomePage() {
  const [role, setRole] = useState<Role>("Admin");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loginRole, setLoginRole] = useState<Role>("Admin");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [query, setQuery] = useState("");
  const [clickBubbles, setClickBubbles] = useState<ClickBubble[]>([]);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const nextBubbleId = useRef(0);
  const sideNavRef = useRef<HTMLElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const welcomeSpokenRef = useRef(false);
  const userName = names[role];
  const greetingName = useMemo(() => userName.split(" ")[0], [userName]);
  const navigateTo = (label: string) => {
    if (!navigation[role].some((item) => item.label === label)) return;
    setActive(label);
    setSidebarOpen(false);
    sideNavRef.current?.scrollTo({ top: 0 });
  };
  useEffect(() => {
    if (!isAuthenticated || active !== "Dashboard" || welcomeSpokenRef.current || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const welcome = () => {
      if (welcomeSpokenRef.current) return;
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance("Welcome back");
      speech.lang = "en-US";
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((voice) => !/male|david|mark|daniel|george|alex|ryan/i.test(`${voice.name} ${voice.voiceURI}`) && /female|samantha|zira|jenny|aria|emma|karen|victoria|google uk english female|google us english/i.test(`${voice.name} ${voice.voiceURI}`))
        ?? voices.find((voice) => voice.lang === "en-US" && !/male|david|mark|daniel|george|alex|ryan/i.test(`${voice.name} ${voice.voiceURI}`));
      if (!preferredVoice) return;
      speech.voice = preferredVoice;
      speech.rate = 0.82;
      speech.pitch = 1.24;
      speech.volume = 0.72;
      welcomeSpokenRef.current = true;
      window.speechSynthesis.speak(speech);
    };

    window.speechSynthesis.getVoices();
    const timer = window.setTimeout(welcome, 700);
    window.speechSynthesis.addEventListener("voiceschanged", welcome);
    return () => {
      window.clearTimeout(timer);
      window.speechSynthesis.removeEventListener("voiceschanged", welcome);
    };
  }, [active, greetingName, isAuthenticated]);
  const handleDashboardClick = (event: ReactMouseEvent<HTMLElement>) => {
    try {
      const AudioContextClass = window.AudioContext;
      const context = audioContextRef.current ?? new AudioContextClass();
      audioContextRef.current = context;
      if (context.state === "suspended") void context.resume();

      const masterGain = context.createGain();
      masterGain.gain.setValueAtTime(0.0001, context.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.018);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.52);
      masterGain.connect(context.destination);

      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const voiceGain = context.createGain();
        const start = context.currentTime + index * 0.09;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, start);
        voiceGain.gain.setValueAtTime(0.0001, start);
        voiceGain.gain.exponentialRampToValueAtTime(0.18, start + 0.025);
        voiceGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.38);
        oscillator.connect(voiceGain);
        voiceGain.connect(masterGain);
        oscillator.start(start);
        oscillator.stop(start + 0.42);
      });
    } catch {
      // Browsers that block Web Audio should still allow the interface to work normally.
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bubbles = Array.from({ length: 6 }, (_, index) => {
      const angle = (index / 6) * Math.PI * 2;
      const distance = 10 + Math.random() * 18;
      const size = 7 + Math.round(Math.random() * 8);
      return {
        id: nextBubbleId.current++,
        left: event.clientX + Math.cos(angle) * distance - size / 2,
        top: event.clientY + Math.sin(angle) * distance - size / 2,
        size,
        delay: Math.round(Math.random() * 90),
      };
    });
    setClickBubbles((current) => [...current, ...bubbles].slice(-36));
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Please enter your email and password.");
      return;
    }
    setLoginError("");
    setRole(loginRole);
    setActive("Dashboard");
    setIsTransitioning(true);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <main className="login-page">
        <div className="login-decoration" aria-hidden="true">
          <span className="login-celestial-moon" />
          <span className="login-planet login-planet-large" />
          <span className="login-planet login-planet-small" />
          <span className="login-planet login-planet-distant" />
          <span className="walking-bird login-bird login-bird-one" />
          <span className="walking-bird login-bird login-bird-two" />
          <span className="walking-bird login-bird login-bird-three" />
          <span className="login-orbit login-orbit-one" />
          <span className="login-orbit login-orbit-two" />
          <span className="login-star login-star-one" />
          <span className="login-star login-star-two" />
          <span className="login-star login-star-three" />
          <span className="login-star login-star-four" />
          <span className="login-star login-star-five" />
          <span className="login-star login-star-six" />
        </div>
        <section className="login-card" aria-label="Account login">
          <div className="login-brand">
            <span className="login-logo" aria-hidden="true" />
            <strong>Bakka</strong>
            <small>Training Center</small>
          </div>
          <div className="login-content">
            <span className="login-eyebrow">BAKKA TRAINING CENTER</span>
            <h1>Sign in to your account</h1>
            <p>Choose your account role and continue to the dashboard.</p>
            <form onSubmit={handleLogin}>
              <fieldset className="login-roles">
                <legend>Account type</legend>
                {(["Admin", "Staff", "Student"] as Role[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={loginRole === option ? "selected" : ""}
                    aria-pressed={loginRole === option}
                    onClick={() => setLoginRole(option)}
                  >
                    {option}
                  </button>
                ))}
              </fieldset>
              <label>
                Email address
                <span className="login-input"><UserRound size={17} /><input type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} placeholder="name@bakka.edu" autoComplete="email" /></span>
              </label>
              <label>
                Password
                <span className="login-input"><Settings size={17} /><input type={showPassword ? "text" : "password"} value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></span>
              </label>
              {loginError && <div className="login-error" role="alert">{loginError}</div>}
              <button className="login-submit" type="submit">Sign in <ArrowRight size={18} /></button>
            </form>
            <div className="login-footer"><span>Secure account access</span><span>BAKKA TRAINING CENTER</span></div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main onClick={handleDashboardClick} className={`app-shell ${darkMode ? "dark-mode" : "light-mode"} ${active === "Dashboard" ? "dashboard-mode" : ""}`}>
      <div className="celestial-sky" aria-hidden="true">
        <span className="celestial-sun" />
        <span className="celestial-moon" />
        <span className="planet planet-one" />
        <span className="planet planet-two" />
        <span className="planet planet-three" />
        <span className="walking-bird bird-one" />
        <span className="walking-bird bird-two" />
        <span className="walking-bird bird-three" />
        <span className="luxury-sparkle sparkle-one" />
        <span className="luxury-sparkle sparkle-two" />
        <span className="luxury-sparkle sparkle-three" />
        <span className="luxury-sparkle sparkle-four" />
        <span className="luxury-sparkle sparkle-five" />
        <span className="luxury-sparkle sparkle-six" />
      </div>
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Logo onOpenImage={(src, title) => setPreviewImage({ src, title })} />
        <nav ref={sideNavRef} className="side-nav" aria-label="Main navigation">
          {navigation[role].map(({ label, icon: Icon }) => (
            <button key={label} onClick={() => { setActive(label); setSidebarOpen(false); if (label === "Dashboard") sideNavRef.current?.scrollTo({ top: 0 }); }} className={`nav-item ${active === label ? "active" : ""}`}>
              <Icon size={19} /><span>{label}</span>
              {label === "Notifications" && <b className="notification-count">3</b>}
              {label === "User Management" && <ChevronDown size={14} className="nav-chevron" />}
            </button>
          ))}
        </nav>
        <div className="premium-card"><span>♛</span><strong>Premium System</strong><small>Empowering Education</small></div>
        <div className="sidebar-user"><div className={`avatar ${role === "Admin" ? "avatar-amina" : ""}`}>{greetingName[0]}</div><div><strong>{userName}</strong><small>{role}</small></div><ChevronDown size={15} /></div>
        <button className="logout" type="button" onClick={() => { setIsAuthenticated(false); setLoginPassword(""); setLoginError(""); setSidebarOpen(false); }}><LogOut size={17} />Logout</button>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle navigation">{sidebarOpen ? <X size={21} /> : <Menu size={21} />}</button>
          <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anything...  (Ctrl + K)" /><kbd>⌘ K</kbd></label>
          <div className="top-actions">
            <button className={`theme-toggle ${darkMode ? "theme-dark" : "theme-light"}`} onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={darkMode} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}><Sun className="theme-sun" size={16} /><Moon className="theme-moon" size={14} /><span className="toggle-knob" /></button>
            <button className="bell-button" aria-label="Notifications"><Bell size={20} /><b>3</b></button>
            <label className="role-picker"><span className={`avatar small ${role === "Admin" ? "avatar-amina" : ""}`}>{greetingName[0]}</span><span><strong>{userName}</strong><small>{role}</small></span><ChevronDown size={16} /><select aria-label="Preview dashboard role" value={role} onChange={(event) => { setRole(event.target.value as Role); setActive("Dashboard"); sideNavRef.current?.scrollTo({ top: 0 }); }}><option>Admin</option><option>Staff</option><option>Student</option></select></label>
          </div>
        </header>

        <div className="page-content">
          {active === "Dashboard" ? (
            <>
              <section className="welcome">
                <div className="welcome-copy"><span className="eyebrow">BAKKA TRAINING CENTER</span><h1>Welcome back,<br /><em>{greetingName}!</em> <span>👋</span></h1><p>Here&apos;s what&apos;s happening at Bakka Training Center today.</p><button type="button" className="report-button" onClick={() => navigateTo(role === "Admin" ? "Reports & Analytics" : role === "Staff" ? "Registrations" : "My Registrations")}>View Detailed Report <ArrowRight size={16} /></button></div>
                <button className="welcome-art image-button" type="button" aria-label="Open Bakka campus image" onClick={() => setPreviewImage({ src: "/images/bakka-campus.png", title: "Bakka Training Center" })}><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><span className="welcome-bakka-ornament" aria-hidden="true"><i />BAKKA<i /></span><div className="art-slogan">Building Skills...<br />Shaping Futures...</div></button>
              </section>
              <DashboardContent role={role} onOpenImage={(src, title) => setPreviewImage({ src, title })} onNavigate={navigateTo} />
            </>
          ) : <WorkspaceContent key={active} role={role} label={active} query={query} />}
          <footer className="footer-note"><span>© 2025 Bakka Training Center</span><span><Clock3 size={13} /> All systems operational</span></footer>
        </div>
      </section>
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      {previewImage && (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={previewImage.title} onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewImage(null); }}>
          <button className="lightbox-close" type="button" aria-label="Close image" onClick={() => setPreviewImage(null)}><X size={22} /></button>
          <figure><img src={previewImage.src} alt={previewImage.title} /><figcaption>{previewImage.title}</figcaption></figure>
        </div>
      )}
      {clickBubbles.length > 0 && <div className="click-bubbles" aria-hidden="true">{clickBubbles.map((bubble) => <span key={bubble.id} className="click-bubble" style={{ left: bubble.left, top: bubble.top, width: bubble.size, height: bubble.size, animationDelay: `${bubble.delay}ms` }} onAnimationEnd={() => setClickBubbles((current) => current.filter(({ id }) => id !== bubble.id))} />)}</div>}
      {isTransitioning && <div className="login-screen-transition" aria-hidden="true" onAnimationEnd={() => setIsTransitioning(false)} />}
    </main>
  );
}
