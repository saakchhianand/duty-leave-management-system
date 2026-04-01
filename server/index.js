require('dotenv').config({ path: '../.env' }); 
const express = require('express');
const cors = require('cors');
const db = require('./db'); 

const app = express();

app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true }));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => res.send("🚀 Server is Running!"));

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
  const { uid, password } = req.body;
  try {
    const [rows] = await db.query('SELECT uid, role, full_name, managed_section FROM users WHERE uid = ? AND password = ?', [uid, password]);
    if (rows.length > 0) res.json({ success: true, user: rows[0] });
    else res.status(401).json({ success: false, message: "Invalid Credentials" });
  } catch (err) { res.status(500).json({ success: false, message: "DB Error" }); }
});

// --- NEW: ORGANISER DASHBOARD STATS ---
app.get('/api/organiser/stats', async (req, res) => {
    try {
        const [eventCount] = await db.query('SELECT COUNT(*) as total FROM events');
        const [studentCount] = await db.query('SELECT COUNT(DISTINCT student_uid) as total FROM attendance WHERE attendance_type = "EVENT"');
        const [attendanceMap] = await db.query('SELECT event_id, COUNT(*) as count FROM attendance WHERE attendance_type = "EVENT" GROUP BY event_id');
        res.json({ 
            totalEvents: eventCount[0].total, 
            totalStudents: studentCount[0].total, 
            attendanceMap 
        });
    } catch (err) { res.status(500).json({ totalEvents: 0, totalStudents: 0, attendanceMap: [] }); }
});

// --- COORDINATOR DASHBOARD STATS ---
app.get('/api/coordinator/stats', async (req, res) => {
    try {
        const [total] = await db.query('SELECT COUNT(*) as count FROM leave_requests');
        const [pending] = await db.query('SELECT COUNT(*) as count FROM leave_requests WHERE status = "Pending"');
        const [approved] = await db.query('SELECT COUNT(*) as count FROM leave_requests WHERE status = "Final Approved"');
        const [rejected] = await db.query('SELECT COUNT(*) as count FROM leave_requests WHERE status = "Rejected"');
        
        res.json({
            total: total[0].count,
            pending: pending[0].count,
            approved: approved[0].count,
            rejected: rejected[0].count
        });
    } catch (err) { res.status(500).json({ total: 0, pending: 0, approved: 0, rejected: 0 }); }
});

// --- COORDINATOR: MASTER VERIFICATION ROUTE ---
app.get('/api/leave/coordinator/all', async (req, res) => {
    try {
        const sql = `
            SELECT 
                r.*, 
                e.event_date,
                m.full_name as mentor_name,
                (SELECT COUNT(*) FROM attendance a WHERE a.student_uid = r.student_uid AND a.event_id = r.event_id AND a.attendance_type = 'EVENT') as event_p,
                (SELECT COUNT(*) FROM attendance a WHERE a.student_uid = r.student_uid AND a.section = r.section AND a.attendance_type = 'CLASS' AND DATE(a.created_at) = DATE(r.applied_at)) as class_p
            FROM leave_requests r
            LEFT JOIN events e ON r.event_id = e.id
            LEFT JOIN users m ON r.section = m.managed_section AND m.role = 'mentor'
            WHERE r.status = 'Pending' OR r.status = 'Mentor Approved'
            ORDER BY r.applied_at DESC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// --- UPDATE STATUS ---
app.post('/api/leave/update-status', async (req, res) => {
    const { requestId, status } = req.body;
    try {
        await db.query('UPDATE leave_requests SET status = ? WHERE id = ?', [status, requestId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// --- EVENTS ---
app.get('/api/events', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM events ORDER BY event_date DESC');
        res.json(rows);
    } catch (err) { res.status(500).json([]); }
});

app.post('/api/events/create', async (req, res) => {
    const { title, category, date, time, venue, eligibility, description, poster } = req.body;
    try {
        const eventId = Date.now();
        const sql = `INSERT INTO events (id, title, category, event_date, event_time, venue, eligibility, description, poster) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [eventId, title, category, date, time, venue, eligibility, description, poster]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// --- ATTENDANCE ---
app.post('/api/attendance/upload', async (req, res) => {
    const { eventId, students, type, section } = req.body; 
    try {
        if(type === 'CLASS') {
            await db.query('DELETE FROM attendance WHERE section = ? AND attendance_type = "CLASS" AND DATE(created_at) = CURDATE()', [section]);
        } else {
            await db.query('DELETE FROM attendance WHERE event_id = ? AND attendance_type = "EVENT"', [eventId]);
        }
        const values = students.map(uid => [type === 'CLASS' ? null : eventId, uid, type, section || null]);
        if (values.length > 0) await db.query('INSERT INTO attendance (event_id, student_uid, attendance_type, section) VALUES ?', [values]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// --- MENTOR ---
app.get('/api/mentor/check-today/:section', async (req, res) => {
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM attendance WHERE section = ? AND attendance_type = 'CLASS' AND DATE(created_at) = CURDATE()`, [req.params.section]);
    res.json({ uploadedToday: rows[0].count > 0 });
});

// --- LEAVE APPLICATIONS ---
app.post('/api/leave/apply', async (req, res) => {
    const { studentId, studentName, eventId, eventName, department, section, leaveType, reason, imageProof } = req.body;
    try {
        const sql = `INSERT INTO leave_requests (student_uid, student_name, event_id, event_name, department, section, leave_type, reason, image_proof, status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;
        await db.query(sql, [studentId, studentName, eventId, eventName, department, section, leaveType, reason, imageProof]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/leave/student/:uid', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM leave_requests WHERE student_uid = ? OR section = ? ORDER BY applied_at DESC', [req.params.uid, req.params.uid]);
    res.json(rows);
});

app.listen(5000, () => console.log(`🚀 Server on http://localhost:5000`));