import React, { useEffect, useState } from "react";
import {
  login,
  getDashboard,
  getStudents,
  getStaff,
  getPayments,
  getAttendance,
  getSchedule,
  addStudent,
  addStaff,
  addPayment,
  addAttendance,
  addSchedule,
  deleteStudent,
  deleteStaff,
  deletePayment,
  deleteAttendance,
  deleteSchedule
} from "./services/api";
import "./index.css";

export default function App(){

  const [user,setUser] = useState(null);
  const [page,setPage] = useState("dashboard");
  const [dashboard,setDashboard] = useState({});
  const [rows,setRows] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [form,setForm] = useState({});

  useEffect(()=>{
    if(user){
      loadDashboard();
      loadPage(page);
    }
  },[user,page]);

  async function handleLogin(){
    const res = await login(form.username,form.password);
    if(res.success){
      setUser(res.user);
      setForm({});
    }else{
      alert("Login gagal");
    }
  }

  async function loadDashboard(){
    const res = await getDashboard();
    if(res.success) setDashboard(res.data);
  }

  async function loadPage(target){
    let res;

    if(target==="students") res = await getStudents();
    if(target==="staff") res = await getStaff();
    if(target==="payments") res = await getPayments();
    if(target==="attendance") res = await getAttendance();
    if(target==="schedule") res = await getSchedule();

    if(target==="dashboard"){
      const s = await getStudents();
      if(s.success) setRows(s.data.slice(0,5));
      return;
    }

    if(res && res.success){
      setRows(res.data);
    }
  }

  async function submitAdd(){
    let res;

    if(page==="students") res = await addStudent(form);
    if(page==="staff") res = await addStaff(form);
    if(page==="payments") res = await addPayment(form);
    if(page==="attendance") res = await addAttendance(form);
    if(page==="schedule") res = await addSchedule(form);

    if(res.success){
      alert("Data berhasil ditambah");
      setShowModal(false);
      setForm({});
      loadDashboard();
      loadPage(page);
    }
  }

  async function submitDelete(id){
    if(!window.confirm("Hapus data ini?")) return;

    let res;

    if(page==="students") res = await deleteStudent(id);
    if(page==="staff") res = await deleteStaff(id);
    if(page==="payments") res = await deletePayment(id);
    if(page==="attendance") res = await deleteAttendance(id);
    if(page==="schedule") res = await deleteSchedule(id);

    if(res.success){
      loadDashboard();
      loadPage(page);
    }
  }

  if(!user){
    return (
      <div className="login-page">
        <div className="login-box">
          <img src="/logo.png" className="login-logo" />
          <h2>SSB SWADAYA FC LOGIN</h2>

          <input
            placeholder="Username"
            value={form.username || ""}
            onChange={(e)=>setForm({...form,username:e.target.value})}
          />

          <input
            placeholder="Password"
            type="password"
            value={form.password || ""}
            onChange={(e)=>setForm({...form,password:e.target.value})}
          />

          <button onClick={handleLogin}>LOGIN</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">

      <div className="sidebar">
        <img src="/logo.png" className="sidebar-logo"/>
        <h2>SWADAYA FC</h2>

        <button onClick={()=>setPage("dashboard")}>🏠 Dashboard</button>
        <button onClick={()=>setPage("students")}>🧒 Students</button>
        <button onClick={()=>setPage("staff")}>👔 Staff</button>
        <button onClick={()=>setPage("payments")}>💳 Payments</button>
        <button onClick={()=>setPage("attendance")}>📅 Attendance</button>
        <button onClick={()=>setPage("schedule")}>🗓 Schedule</button>
        <button onClick={()=>setUser(null)}>🚪 Logout</button>
      </div>

      <div className="content">
        <h1>SSB SWADAYA FC MANAGEMENT SYSTEM</h1>
        <p>Welcome back, {user.name}</p>

        <div className="cards">
          <div className="card blue">Students<br/>{dashboard.students || 0}</div>
          <div className="card green">Staff<br/>{dashboard.staff || 0}</div>
          <div className="card orange">Payments<br/>{dashboard.payments || 0}</div>
          <div className="card purple">Attendance<br/>{dashboard.attendance || 0}</div>
          <div className="card red">Schedule<br/>{dashboard.schedule || 0}</div>
        </div>

        <div className="table-box">
          <div className="table-head">
            <h2>{page.toUpperCase()} MANAGEMENT</h2>
            {page!=="dashboard" && (
              <button onClick={()=>setShowModal(true)}>+ Add Data</button>
            )}
          </div>

          <table>
            <thead>
              <tr>
                {rows.length > 0 &&
                  Object.keys(rows[0]).map((k,i)=><th key={i}>{k}</th>)
                }
                {page!=="dashboard" && rows.length>0 && <th>action</th>}
              </tr>
            </thead>

            <tbody>
              {rows.length===0 ? (
                <tr>
                  <td colSpan="20">No Data Available</td>
                </tr>
              ) : (
                rows.map((r,i)=>(
                  <tr key={i}>
                    {Object.values(r).map((v,j)=><td key={j}>{v}</td>)}
                    {page!=="dashboard" && (
                      <td>
                        <button
                          className="delete-btn"
                          onClick={()=>submitDelete(r.id)}
                        >
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

              {showModal && (
        <div className="modal-wrap">
          <div className="modal-box">
            <h3>Add {page}</h3>

            <textarea
              placeholder="Input JSON data sesuai header sheet.
Contoh:
{name:'Budi',group:'2016',parent:'Agus'}"
              rows="10"
              onChange={(e)=>{
                try{
                  const txt = e.target.value;
                  const json = eval("("+txt+")");
                  setForm(json);
                }catch(err){}
              }}
            />

            <div className="modal-actions">
              <button onClick={submitAdd}>Save</button>
              <button onClick={()=>setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
