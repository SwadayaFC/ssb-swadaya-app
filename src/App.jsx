import React,{useEffect,useState} from 'react';
import {apiGet,apiPost} from './api';
import logo from '/logo.png';
export default function App(){
const [user,setUser]=useState(null),[menu,setMenu]=useState('dashboard'),[username,setUsername]=useState(''),[password,setPassword]=useState(''),[loading,setLoading]=useState(false);
const [students,setStudents]=useState([]),[staff,setStaff]=useState([]),[payments,setPayments]=useState([]),[attendance,setAttendance]=useState([]),[schedule,setSchedule]=useState([]);
useEffect(()=>{const s=localStorage.getItem('ssbUser');if(s){setUser(JSON.parse(s));loadAll();}},[]);
async function loadAll(){try{setStudents((await apiGet('getStudents'))||[]);setStaff((await apiGet('getStaff'))||[]);setPayments((await apiGet('getPayments'))||[]);setAttendance((await apiGet('getAttendance'))||[]);setSchedule((await apiGet('getSchedule'))||[]);}catch(e){console.log(e)}}
async function handleLogin(){setLoading(true);try{const r=await apiPost({action:'login',username,password});if(r.status){setUser(r.user);localStorage.setItem('ssbUser',JSON.stringify(r.user));await loadAll();}else{alert(r.message||'Login gagal');}}catch(e){alert('Backend error')}setLoading(false);}
function logout(){localStorage.removeItem('ssbUser');location.reload();}
function renderTable(title,rows,cols){return <div className='table-box'><div className='table-head'><h2>{title}</h2><button>+ Add Data</button></div><table><thead><tr>{cols.map((c,i)=><th key={i}>{c}</th>)}</tr></thead><tbody>{rows.length?rows.map((r,i)=><tr key={i}>{cols.map((c,j)=><td key={j}>{r[c]??'-'}</td>)}</tr>):<tr><td colSpan={cols.length}>No Data Available</td></tr>}</tbody></table></div>}
function renderContent(){
if(menu==='dashboard') return <><div className='cards'><div className='card blue'><h3>Students</h3><p>{students.length}</p></div><div className='card green'><h3>Staff</h3><p>{staff.length}</p></div><div className='card orange'><h3>Payments</h3><p>{payments.length}</p></div><div className='card purple'><h3>Schedule</h3><p>{schedule.length}</p></div></div><div className='grid2'>{renderTable('Recent Students',students.slice(0,5),['id','name','group','parent'])}{renderTable('Recent Payments',payments.slice(0,5),['studentId','name','month','status'])}</div></>;
if(menu==='students') return renderTable('Students Management',students,['id','name','group','parent','phone']);
if(menu==='staff') return renderTable('Staff Management',staff,['id','name','position','phone']);
if(menu==='payments') return renderTable('Payments Management',payments,['studentId','name','month','amount','status']);
if(menu==='attendance') return renderTable('Attendance Management',attendance,['date','studentId','name','status']);
if(menu==='schedule') return renderTable('Schedule Management',schedule,['day','time','group','field']);
return null;}
if(!user){return <div className='login-page'><div className='login-box'><img src={logo} className='logo'/><h2>SSB SWADAYA FC LOGIN</h2><input placeholder='Username' value={username} onChange={e=>setUsername(e.target.value)}/><input type='password' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)}/><button onClick={handleLogin}>{loading?'LOADING...':'LOGIN'}</button></div></div>}
return <div className='app-shell'><aside className='sidebar'><div className='brand'><img src={logo} className='side-logo'/><h2>SWADAYA FC</h2></div><ul className='menu'><li onClick={()=>setMenu('dashboard')}>🏠 Dashboard</li><li onClick={()=>setMenu('students')}>👦 Students</li><li onClick={()=>setMenu('staff')}>👔 Staff</li><li onClick={()=>setMenu('payments')}>💳 Payments</li><li onClick={()=>setMenu('attendance')}>📅 Attendance</li><li onClick={()=>setMenu('schedule')}>🗓 Schedule</li><li onClick={logout}>🚪 Logout</li></ul></aside><main className='main-content'><h1>SSB SWADAYA FC MANAGEMENT SYSTEM</h1><p>Welcome back, {user.name||'Admin'}</p>{renderContent()}</main></div>
}