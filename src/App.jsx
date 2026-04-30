import React, { useEffect, useState } from "react";
import "./style.css";

const API_URL = "https://script.google.com/macros/s/AKfycbzxb1MhJif6L9z1puDshlySKLk_Bu_0kbHZajNCNInme0OXPXL38ckDJsVDEQuxmtdz/exec";

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const sess = localStorage.getItem("ssb_user");
    if (sess) {
      setUser(JSON.parse(sess));
      setPage("dashboard");
      loadAllData();
    }
  }, []);

  async function apiCall(payload) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const txt = await res.text();
      return JSON.parse(txt);
    } catch (err) {
      console.log(err);
      alert("SERVER ERROR");
      return null;
    }
  }

  async function handleLogin() {
    if (!loginData.username || !loginData.password) {
      alert("Lengkapi login");
      return;
    }

    const result = await apiCall({
      action: "login",
      username: loginData.username,
      password: loginData.password
    });

    if (result && result.success) {
      localStorage.setItem("ssb_user", JSON.stringify(result.user));
      setUser(result.user);
      setPage("dashboard");
      loadAllData();
    } else {
      alert(result ? result.message : "Login gagal");
    }
  }

  async function loadAllData() {
    const s1 = await apiCall({ action: "getStudents" });
    const s2 = await apiCall({ action: "getStaff" });
    const s3 = await apiCall({ action: "getPayments" });
    const s4 = await apiCall({ action: "getAttendance" });
    const s5 = await apiCall({ action: "getSchedule" });

    setStudents(s1?.data || []);
    setStaff(s2?.data || []);
    setPayments(s3?.data || []);
    setAttendance(s4?.data || []);
    setSchedule(s5?.data || []);
  }

  function logout() {
    localStorage.removeItem("ssb_user");
    location.reload();
  }

  function addStudent() {
    const id = prompt("ID Student");
    const name = prompt("Nama");
    const group = prompt("Kelompok Tahun");
    const parent = prompt("Nama Orang Tua");
    const phone = prompt("No HP");

    if (!id) return;

    apiCall({
      action: "addStudent",
      payload: { id, name, group, parent, phone }
    }).then(loadAllData);
  }

  function addStaff() {
    const id = prompt("ID Staff");
    const name = prompt("Nama Staff");
    const position = prompt("Posisi");
    const phone = prompt("No HP");

    if (!id) return;

    apiCall({
      action: "addStaff",
      payload: { id, name, position, phone }
    }).then(loadAllData);
  }

  function addPayment() {
    const id = prompt("ID Payment");
    const student = prompt("Nama Student");
    const month = prompt("Bulan");
    const amount = prompt("Jumlah");
    const status = prompt("Status");

    if (!id) return;

    apiCall({
      action: "addPayment",
      payload: { id, student, month, amount, status }
    }).then(loadAllData);
  }

  function addAttendance() {
    const id = prompt("ID Attendance");
    const student = prompt("Nama Student");
    const date = prompt("Tanggal");
    const status = prompt("Status Hadir/Izin/Alfa");

    if (!id) return;

    apiCall({
      action: "addAttendance",
      payload: { id, student, date, status }
    }).then(loadAllData);
  }

  function addSchedule() {
    const id = prompt("ID Schedule");
    const title = prompt("Judul Jadwal");
    const date = prompt("Tanggal");
    const time = prompt("Jam");
    const location = prompt("Lokasi");

    if (!id) return;

    apiCall({
      action: "addSchedule",
      payload: { id, title, date, time, location }
    }).then(loadAllData);
  }

  function renderTable(title, data, addFunc) {
    return (
      <div className="module-box">
        <div className="module-head">
          <h2>{title}</h2>
          <button onClick={addFunc}>+ Add Data</button>
        </div>

        <table>
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="10">No Data</td></tr>
            ) : (
              data.map((r, i) => (
                <tr key={i}>
                  {Object.values(r).map((v, j) => <td key={j}>{v}</td>)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (page === "login") {
    return (
      <div className="login-page">
        <div className="login-box">
          <img
            src="https://drive.google.com/uc?export=view&id=1x2wcr8kQUTKY9oxABkOrKeW5ras0Xc8A"
            className="login-logo"
          />
          <h2>SSB SWADAYA FC LOGIN</h2>

          <input
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />

          <button onClick={handleLogin}>LOGIN</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-area">
          <img
            src="https://drive.google.com/uc?export=view&id=1x2wcr8kQUTKY9oxABkOrKeW5ras0Xc8A"
            className="side-logo"
          />
          <h2>SWADAYA FC</h2>
        </div>

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
          <span>Welcome, {user?.name}</span>
        </div>

                <div className="cards">
          <div className="card blue">
            <span>{students.length}</span>
            <p>Students</p>
          </div>
          <div className="card green">
            <span>{staff.length}</span>
            <p>Staff</p>
          </div>
          <div className="card orange">
            <span>{payments.length}</span>
            <p>Payments</p>
          </div>
          <div className="card purple">
            <span>{attendance.length}</span>
            <p>Attendance</p>
          </div>
          <div className="card red">
            <span>{schedule.length}</span>
            <p>Schedule</p>
          </div>
        </div>

        {page === "dashboard" && renderTable("Recent Students", students, addStudent)}
        {page === "students" && renderTable("Students Management", students, addStudent)}
        {page === "staff" && renderTable("Staff Management", staff, addStaff)}
        {page === "payments" && renderTable("Payments Management", payments, addPayment)}
        {page === "attendance" && renderTable("Attendance Management", attendance, addAttendance)}
        {page === "schedule" && renderTable("Schedule Management", schedule, addSchedule)}
      </main>
    </div>
  );
}
