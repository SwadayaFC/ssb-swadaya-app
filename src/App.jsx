import React, { useState } from "react";
import "./style.css";

const API_URL = "https://script.google.com/macros/s/AKfycbxtnSpB7YbVf4CDKj-ZNrz5MxL3pRVbTR8IczafoRrcAyg5RD5QBJoCh8x4rVAkEWJh/exec";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [dashboard, setDashboard] = useState({
    students: 0,
    staff: 0,
    payments: 0,
    attendance: 0,
    schedule: 0
  });

  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");

  const [studentForm, setStudentForm] = useState({
    id: "",
    photo: "",
    name: "",
    birth: "",
    position: "",
    parent: "",
    phone: "",
    address: ""
  });

  async function apiRequest(payload) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      const txt = await res.text();
      return JSON.parse(txt);
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "NETWORK ERROR",
        error: String(err)
      };
    }
  }

  async function handleLogin() {
    if (!username || !password) {
      alert("Isi username dan password");
      return;
    }

    setLoading(true);

    const res = await apiRequest({
      action: "login",
      username,
      password
    });

    setLoading(false);

    if (res.success) {
      setLoggedIn(true);
      setUser(res.user);
      await loadAllData();
    } else {
      alert(res.message || "Login gagal");
    }
  }

  async function loadAllData() {
    setLoading(true);

    const db = await apiRequest({ action: "getDashboard" });
    const st = await apiRequest({ action: "getStudents" });
    const sf = await apiRequest({ action: "getStaff" });
    const py = await apiRequest({ action: "getPayments" });
    const at = await apiRequest({ action: "getAttendance" });
    const sc = await apiRequest({ action: "getSchedule" });

    if (db.success) setDashboard(db.data);
    if (st.success) setStudents(st.data);
    if (sf.success) setStaff(sf.data);
    if (py.success) setPayments(py.data);
    if (at.success) setAttendance(at.data);
    if (sc.success) setSchedule(sc.data);

    setLoading(false);
  }

  function logout() {
    setLoggedIn(false);
    setUser(null);
    setUsername("");
    setPassword("");
  }

  async function deleteStudent(id) {
    const ok = window.confirm("Hapus data siswa?");
    if (!ok) return;

    const res = await apiRequest({
      action: "deleteStudent",
      id
    });

    if (res.success) {
      await loadAllData();
    } else {
      alert(res.message);
    }
  }

  function openStudentForm(data = null) {
    if (data) {
      setStudentForm(data);
    } else {
      setStudentForm({
        id: "STD" + Date.now(),
        photo: "",
        name: "",
        birth: "",
        position: "",
        parent: "",
        phone: "",
        address: ""
      });
    }
    setShowStudentForm(true);
  }

  function closeStudentForm() {
    setShowStudentForm(false);
  }

  function handleStudentChange(e) {
    setStudentForm({
      ...studentForm,
      [e.target.name]: e.target.value
    });
  }

  async function saveStudent() {
    let action = "addStudent";

    const exists = students.find((x) => x.id === studentForm.id);
    if (exists) action = "updateStudent";

    const res = await apiRequest({
      action,
      payload: studentForm
    });

    if (res.success) {
      setShowStudentForm(false);
      await loadAllData();
      alert("Data siswa tersimpan");
    } else {
      alert(res.message);
    }
  }

  const filteredStudents = students.filter((s) =>
    JSON.stringify(s).toLowerCase().includes(studentSearch.toLowerCase())
  );

  function renderTable(title, data, isStudent = false) {
    const useData = isStudent ? filteredStudents : data;

    return (
      <div className="module-box">
        <div className="module-head">
          <h2>{title}</h2>

          {isStudent && (
            <div className="student-tools">
              <input
                className="search-input"
                placeholder="Search student..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
              <button className="add-btn" onClick={() => openStudentForm()}>
                + Add Student
              </button>
            </div>
          )}
        </div>

        <table>
          <thead>
            <tr>
              {useData.length > 0 &&
                Object.keys(useData[0]).map((h, i) => <th key={i}>{h}</th>)}
              {isStudent && <th>action</th>}
            </tr>
          </thead>

          <tbody>
            {useData.length === 0 ? (
              <tr>
                <td colSpan="20">No Data</td>
              </tr>
            ) : (
              useData.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}

                  {isStudent && (
                    <td>
                      <button className="edit-btn" onClick={() => openStudentForm(row)}>
                        Edit
                      </button>
                      <button className="del-btn" onClick={() => deleteStudent(row.id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>SSB SWADAYA FC V21</h1>
          <p>Enterprise Football School Management</p>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>
            {loading ? "PROCESSING..." : "LOGIN SYSTEM"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>SWADAYA FC</h2>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("students")}>Students</button>
        <button onClick={() => setPage("staff")}>Staff</button>
        <button onClick={() => setPage("payments")}>Payments</button>
        <button onClick={() => setPage("attendance")}>Attendance</button>
        <button onClick={() => setPage("schedule")}>Schedule</button>
        <button onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h1>SSB SWADAYA FC MANAGEMENT SYSTEM</h1>
          <span>{user?.name} ({user?.role})</span>
        </div>

        <div className="cards">
          <div className="card">Students<br />{dashboard.students}</div>
          <div className="card">Staff<br />{dashboard.staff}</div>
          <div className="card">Payments<br />{dashboard.payments}</div>
          <div className="card">Attendance<br />{dashboard.attendance}</div>
          <div className="card">Schedule<br />{dashboard.schedule}</div>
        </div>

        {page === "dashboard" && renderTable("Recent Students", students, true)}
        {page === "students" && renderTable("Students Management", students, true)}
        {page === "staff" && renderTable("Staff Management", staff)}
        {page === "payments" && renderTable("Payments Management", payments)}
        {page === "attendance" && renderTable("Attendance Management", attendance)}
        {page === "schedule" && renderTable("Schedule Management", schedule)}
      </main>

      {showStudentForm && (
        <div className="modal-overlay">
          <div className="student-modal">
            <h2>Student Form</h2>

            <input name="id" value={studentForm.id} onChange={handleStudentChange} placeholder="Student ID" />
            <input name="name" value={studentForm.name} onChange={handleStudentChange} placeholder="Student Name" />
            <input name="birth" value={studentForm.birth} onChange={handleStudentChange} placeholder="Birth YYYY-MM-DD" />
            <input name="position" value={studentForm.position} onChange={handleStudentChange} placeholder="Position" />
            <input name="parent" value={studentForm.parent} onChange={handleStudentChange} placeholder="Parent Name" />
            <input name="phone" value={studentForm.phone} onChange={handleStudentChange} placeholder="WhatsApp Number" />
            <input name="address" value={studentForm.address} onChange={handleStudentChange} placeholder="Address" />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveStudent}>Save</button>
              <button className="cancel-btn" onClick={closeStudentForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
