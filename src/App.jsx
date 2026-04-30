import React,{useState,useEffect} from 'react';
import './style.css';

const API_URL = 'https://script.google.com/macros/s/AKfycbx6L0TpLHPGgb433UbYKOIOCKzVvf1-Vq2UXgl45qKYHLU8DQU4SHGHEJXT45AUqdyZ/exec';

export default function App(){

  const [loggedIn,setLoggedIn] = useState(false);
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(false);
  const [menu,setMenu] = useState('dashboard');

  const [dashboard,setDashboard] = useState({});
  const [students,setStudents] = useState([]);
  const [staff,setStaff] = useState([]);
  const [payments,setPayments] = useState([]);
  const [attendance,setAttendance] = useState([]);
  const [schedule,setSchedule] = useState([]);

  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  /* =========================
     UNIVERSAL API FETCH HOTFIX
  ========================= */
  async function api(action,data={}){
    try{
      const res = await fetch(API_URL,{
        method:'POST',
        redirect:'follow',
        headers:{
          'Content-Type':'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action:action,
          data:data
        })
      });

      const txt = await res.text();
      const json = JSON.parse(txt);
      return json;

    }catch(err){
      return {
        success:false,
        message:'Frontend Fetch Error',
        error:String(err)
      };
    }
  }

  /* =========================
     LOGIN USER
  ========================= */
  async function handleLogin(){
    if(!username || !password){
      alert('Isi username dan password');
      return;
    }

    setLoading(true);

    const res = await api('login',{
      username:username,
      password:password
    });

    setLoading(false);

    if(res.success){
      setLoggedIn(true);
      setUser(res.user);
      loadDashboard();
    }else{
      alert(res.message || 'Login gagal');
    }
  }

  function logout(){
    setLoggedIn(false);
    setUser(null);
    setMenu('dashboard');
    setUsername('');
    setPassword('');
  }

  /* =========================
     LOAD DASHBOARD
  ========================= */
  async function loadDashboard(){
    setLoading(true);

    const db = await api('getDashboard');
    const st = await api('getStudents');
    const sf = await api('getStaff');
    const py = await api('getPayments');
    const at = await api('getAttendance');
    const sc = await api('getSchedule');

    setDashboard(db);
    setStudents(st.data || []);
    setStaff(sf.data || []);
    setPayments(py.data || []);
    setAttendance(at.data || []);
    setSchedule(sc.data || []);

    setLoading(false);
  }

  useEffect(()=>{
    if(loggedIn){
      loadDashboard();
    }
  },[loggedIn]);

  /* =========================
     LOGIN SCREEN
  ========================= */
  if(!loggedIn){
    return(
      <div className="login-page">
        <div className="login-box">
          <img
            src="https://drive.google.com/uc?export=view&id=1x2wcr8kQUTKY9oxABkOrKeW5ras0Xc8A"
            alt="logo"
            className="login-logo"
          />
          <h2>SSB SWADAYA FC LOGIN</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>
            {loading ? 'PROCESSING...' : 'LOGIN'}
          </button>
        </div>
      </div>
    );
  }

  function renderTable(title,data){
    return(
      <div className="module-box">
        <div className="module-head">
          <h3>{title}</h3>
          <button onClick={()=>alert('Form tambah data akan kita aktifkan di phase berikutnya')}>+ Add Data</button>
        </div>

        <table>
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((h,i)=>(
                  <th key={i}>{h}</th>
                ))
              }
              {data.length > 0 && <th>Aksi</th>}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="20">No Data</td></tr>
            ) : (
              data.map((row,i)=>(
                <tr key={i}>
                  {Object.values(row).map((v,j)=>(
                    <td key={j}>{v}</td>
                  ))}
                  <td>
                    <button
                      className="delete-btn"
                      onClick={()=>alert('Delete module akan kita aktifkan di phase berikutnya')}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )
  }

  function renderPage(){

    if(menu === 'dashboard'){
      return(
        <>
          <div className="cards">
            <div className="card blue">
              <span>{dashboard.students || 0}</span>
              <p>Total Students</p>
            </div>

            <div className="card green">
              <span>{dashboard.staff || 0}</span>
              <p>Total Staff</p>
            </div>

            <div className="card orange">
              <span>{dashboard.payments || 0}</span>
              <p>Total Payments</p>
            </div>

            <div className="card purple">
              <span>{dashboard.attendance || 0}</span>
              <p>Total Attendance</p>
            </div>

            <div className="card red">
              <span>{dashboard.schedule || 0}</span>
              <p>Total Schedule</p>
            </div>
          </div>

          {renderTable('Recent Students',students.slice(0,5))}
        </>
      )
    }

    if(menu === 'students') return renderTable('Students Management',students);
    if(menu === 'staff') return renderTable('Staff Management',staff);
    if(menu === 'payments') return renderTable('Payments Management',payments);
    if(menu === 'attendance') return renderTable('Attendance Management',attendance);
    if(menu === 'schedule') return renderTable('Schedule Management',schedule);
  }

  return(
    <div className="app-shell">

      <aside className="sidebar">
        <div className="brand-area">
          <img
            src="https://drive.google.com/uc?export=view&id=1x2wcr8kQUTKY9oxABkOrKeW5ras0Xc8A"
            className="side-logo"
          />
          <h2>SWADAYA FC</h2>
        </div>

        <button onClick={()=>setMenu('dashboard')}>Dashboard</button>
        <button onClick={()=>setMenu('students')}>Students</button>
        <button onClick={()=>setMenu('staff')}>Staff</button>
        <button onClick={()=>setMenu('payments')}>Payments</button>
        <button onClick={()=>setMenu('attendance')}>Attendance</button>
        <button onClick={()=>setMenu('schedule')}>Schedule</button>
        <button onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h1>SSB SWADAYA FC MANAGEMENT SYSTEM</h1>
          <span>Welcome, {user?.name}</span>
        </div>

        {loading ? <h3>Loading data...</h3> : renderPage()}
      </main>
    </div>
  )
}
