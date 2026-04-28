import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/logo.png';
const API_URL = 'https://script.google.com/macros/s/AKfycbyhN_rgd66NZZ07gXxVHHGfmECQctOrYczJoJEtQWFFTayqLpl2r_v_AtQet_oYMMnZ/exec';

export default function App(){
 const [session,setSession]=useState(JSON.parse(localStorage.getItem('session'))||null);
 const [loginForm,setLoginForm]=useState({username:'',password:''});
 const [error,setError]=useState('');
 const [students,setStudents]=useState([]);
 const [payments,setPayments]=useState([]);
 const [attendance,setAttendance]=useState([]);

 useEffect(()=>{ fetchData(); },[]);
 const fetchData = async()=>{
   const s = await fetch(API_URL+'?action=students').then(r=>r.json());
   const p = await fetch(API_URL+'?action=payments').then(r=>r.json());
   const a = await fetch(API_URL+'?action=attendance').then(r=>r.json());
   setStudents(s); setPayments(p); setAttendance(a);
 };

 const doLogin = async()=>{
   const res = await fetch(API_URL+`?action=login&username=${loginForm.username}&password=${loginForm.password}`).then(r=>r.json());
   if(!res.success){setError('Username atau Password salah');return;}
   localStorage.setItem('session', JSON.stringify(res));
   setSession(res);
 };

 const logout=()=>{localStorage.removeItem('session');setSession(null);};

 if(!session) return <LoginPage loginForm={loginForm} setLoginForm={setLoginForm} doLogin={doLogin} error={error} />;
 if(session.role==='member') return <ParentPortal session={session} students={students} payments={payments} attendance={attendance} logout={logout} />;
 return <AdminDashboard students={students} setStudents={setStudents} payments={payments} attendance={attendance} logout={logout} fetchData={fetchData} />;
}

function LoginPage({loginForm,setLoginForm,doLogin,error}){
 return <div className='loginWrap'><div className='overlay'></div><div className='loginCard'><img src={logo} className='clubLogo'/><h1>SSB SWADAYA FC</h1><p>Cloud Management Login</p><input placeholder='Username' value={loginForm.username} onChange={e=>setLoginForm({...loginForm,username:e.target.value})}/><input type='password' placeholder='Password' value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})}/>{error && <div className='errorBox'>{error}</div>}<button onClick={doLogin}>LOGIN SYSTEM</button></div></div>;
}

function AdminDashboard({students,payments,attendance,logout,fetchData}){
 const [newStudent,setNewStudent]=useState({id:'',name:'',group:'',parent:'',phone:''});
 const addStudent = async()=>{
   await fetch(API_URL,{method:'POST',body:JSON.stringify({action:'addStudent',...newStudent})});
   setNewStudent({id:'',name:'',group:'',parent:'',phone:''});
   fetchData();
 };
 const totalKas = payments.reduce((a,b)=>a+Number(b.amount||0),0);
 return <div className='appShell'><aside className='sidebar'><img src={logo} className='sideLogo'/><h2>ADMIN PANEL CLOUD</h2><nav><div>Dashboard</div><div>Students</div><div>Payments</div><div>Attendance</div></nav><button className='logoutBtn' onClick={logout}>Logout</button></aside><main className='mainContent'><h1>Cloud Dashboard</h1><div className='statsGrid'><div className='statBox'><h3>{students.length}</h3><span>Total Siswa</span></div><div className='statBox'><h3>{attendance.length}</h3><span>Absensi</span></div><div className='statBox'><h3>Rp {totalKas.toLocaleString()}</h3><span>Total Kas</span></div><div className='statBox'><h3>{payments.length}</h3><span>Pembayaran</span></div></div><div className='panel'><h3>Tambah Siswa Cloud</h3><input placeholder='ID' value={newStudent.id} onChange={e=>setNewStudent({...newStudent,id:e.target.value})}/><input placeholder='Nama' value={newStudent.name} onChange={e=>setNewStudent({...newStudent,name:e.target.value})}/><input placeholder='Kelompok' value={newStudent.group} onChange={e=>setNewStudent({...newStudent,group:e.target.value})}/><input placeholder='Orang Tua' value={newStudent.parent} onChange={e=>setNewStudent({...newStudent,parent:e.target.value})}/><input placeholder='HP' value={newStudent.phone} onChange={e=>setNewStudent({...newStudent,phone:e.target.value})}/><button onClick={addStudent}>Kirim Cloud</button></div><div className='panel'><h3>Data Siswa Cloud</h3>{students.map((s,i)=><div className='row' key={i}>{s.id} - {s.name} - {s.group} - {s.parent}</div>)}</div></main></div>;
}

function ParentPortal({session,students,payments,attendance,logout}){
 const child=students.find(s=>s.id===session.studentId);
 const pay=payments.find(p=>p.studentName===child?.name);
 const att=attendance.find(a=>a.studentName===child?.name);
 return <div className='loginWrap'><div className='parentCard'><img src={logo} className='clubLogoSmall'/><h1>PORTAL ORANG TUA CLOUD</h1><h2>{child?.name}</h2><p>ID: {child?.id}</p><p>Kelompok: {child?.group}</p><p>Pembayaran: {pay?pay.status:'Belum Ada'}</p><p>Absensi: {att?att.status:'Belum Ada'}</p><button onClick={logout}>Logout</button></div></div>;
}