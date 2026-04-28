import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/logo.png';
const API_URL = 'https://script.google.com/macros/s/AKfycbzWMYSK5FAzaZiJO8f9ODnqcHGu5yjPrElWgiVSTVI29Os9MYcyEvsKu5HOn-x46zqr/exec';

export default function App() {
  const [session, setSession] = useState(JSON.parse(localStorage.getItem('session')) || null);
  const [loginForm, setLoginForm] = useState({ username:'', password:'' });
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ fetchData(); },[]);
  const fetchData = async () => {
    try{
      setStudents(await fetch(API_URL+'?action=students').then(r=>r.json()));
      setPayments(await fetch(API_URL+'?action=payments').then(r=>r.json()));
      setAttendance(await fetch(API_URL+'?action=attendance').then(r=>r.json()));
      setSchedule(await fetch(API_URL+'?action=schedule').then(r=>r.json()));
    }catch(e){console.log(e);}
    setLoading(false);
  };

  const doLogin = async () => {
    const res = await fetch(API_URL+`?action=login&username=${loginForm.username}&password=${loginForm.password}`).then(r=>r.json());
    if(!res.success){ setError('Username atau password salah'); return; }
    localStorage.setItem('session', JSON.stringify(res)); setSession(res);
  };
  const logout = ()=>{ localStorage.removeItem('session'); setSession(null); };

  if(loading) return <div className='loginWrap'><div className='loginCard'><h2>Loading Cloud Data...</h2></div></div>;
  if(!session) return <LoginPage loginForm={loginForm} setLoginForm={setLoginForm} doLogin={doLogin} error={error} />;
  if(session.role==='member') return <ParentPortal session={session} students={students} payments={payments} attendance={attendance} schedule={schedule} logout={logout} />;
  return <AdminDashboard students={students} payments={payments} attendance={attendance} schedule={schedule} fetchData={fetchData} logout={logout} />;
}

function LoginPage({ loginForm, setLoginForm, doLogin, error }) {
  return <div className='loginWrap'><div className='overlay'></div><div className='loginCard'><img src={logo} className='clubLogo' alt='logo'/><h1>SSB SWADAYA FC</h1><p>Final Business Management Login</p><input placeholder='Username' value={loginForm.username} onChange={e=>setLoginForm({...loginForm,username:e.target.value})}/><input type='password' placeholder='Password' value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})}/>{error && <div className='errorBox'>{error}</div>}<button onClick={doLogin}>LOGIN SYSTEM</button></div></div>;
}

function AdminDashboard({ students, payments, attendance, schedule, fetchData, logout }) {
  const [search,setSearch]=useState('');
  const [student,setStudent]=useState({ id:'', name:'', group:'', parent:'', phone:'' });
  const [payment,setPayment]=useState({ studentName:'', month:'', amount:'', status:'Lunas' });
  const [att,setAtt]=useState({ studentName:'', date:'', status:'Hadir' });
  const [sch,setSch]=useState({ date:'', time:'', group:'', field:'' });

  const postData = async (data) => { await fetch(API_URL,{method:'POST', body:JSON.stringify(data)}); fetchData(); };
  const totalKas = payments.reduce((a,b)=>a+Number(b.amount||0),0);
  const filteredStudents = students.filter(s => (s.name||'').toLowerCase().includes(search.toLowerCase()) || (s.id||'').toLowerCase().includes(search.toLowerCase()));

  return <div className='appShell'><aside className='sidebar'><img src={logo} className='sideLogo' alt='logo'/><h2>ADMIN BUSINESS</h2><nav><div>Dashboard</div><div>Students</div><div>Payments</div><div>Attendance</div><div>Schedule</div></nav><button className='logoutBtn' onClick={logout}>Logout</button></aside><main className='mainContent'>
  <h1>Business Management Dashboard</h1>
  <div className='statsGrid'><div className='statBox'><h3>{students.length}</h3><span>Total Siswa</span></div><div className='statBox'><h3>{payments.length}</h3><span>Pembayaran</span></div><div className='statBox'><h3>{attendance.length}</h3><span>Absensi</span></div><div className='statBox'><h3>Rp {totalKas.toLocaleString()}</h3><span>Total Kas</span></div></div>
  <div className='panel'><h3>Tambah Siswa Baru</h3><input placeholder='ID' onChange={e=>setStudent({...student,id:e.target.value})}/><input placeholder='Nama' onChange={e=>setStudent({...student,name:e.target.value})}/><input placeholder='Kelompok' onChange={e=>setStudent({...student,group:e.target.value})}/><input placeholder='Orang Tua' onChange={e=>setStudent({...student,parent:e.target.value})}/><input placeholder='No HP Wali' onChange={e=>setStudent({...student,phone:e.target.value})}/><button onClick={()=>postData({action:'addStudent',...student})}>Simpan Siswa</button></div>
  <div className='panel'><h3>Input Pembayaran</h3><input placeholder='Nama Siswa' onChange={e=>setPayment({...payment,studentName:e.target.value})}/><input placeholder='Bulan' onChange={e=>setPayment({...payment,month:e.target.value})}/><input placeholder='Nominal' onChange={e=>setPayment({...payment,amount:e.target.value})}/><button onClick={()=>postData({action:'addPayment',...payment})}>Simpan Pembayaran</button></div>
  <div className='panel'><h3>Input Absensi</h3><input placeholder='Nama Siswa' onChange={e=>setAtt({...att,studentName:e.target.value})}/><input placeholder='Tanggal' onChange={e=>setAtt({...att,date:e.target.value})}/><input placeholder='Status' onChange={e=>setAtt({...att,status:e.target.value})}/><button onClick={()=>postData({action:'addAttendance',...att})}>Simpan Absensi</button></div>
  <div className='panel'><h3>Input Jadwal Latihan</h3><input placeholder='Tanggal' onChange={e=>setSch({...sch,date:e.target.value})}/><input placeholder='Jam' onChange={e=>setSch({...sch,time:e.target.value})}/><input placeholder='Kelompok' onChange={e=>setSch({...sch,group:e.target.value})}/><input placeholder='Lapangan' onChange={e=>setSch({...sch,field:e.target.value})}/><button onClick={()=>postData({action:'addSchedule',...sch})}>Simpan Jadwal</button></div>
  <div className='panel'><h3>Search Data Siswa</h3><input placeholder='Cari nama / ID siswa...' value={search} onChange={e=>setSearch(e.target.value)}/></div>
  <div className='panel'><h3>Daftar Siswa</h3>{filteredStudents.map((s,i)=><div className='row' key={i}>{s.id} | {s.name} | {s.group} | {s.parent}<span><button onClick={()=>window.open(`https://wa.me/${String(s.phone||'').replace(/^0/,'62')}`)}>Chat Wali</button><button onClick={()=>postData({action:'deleteStudent',id:s.id})}>Delete</button></span></div>)}</div>
  <div className='panel'><h3>Daftar Pembayaran</h3>{payments.map((p,i)=><div className='row' key={i}>{p.studentName} | {p.month} | Rp {Number(p.amount||0).toLocaleString()} | {p.status}</div>)}</div>
  <div className='panel'><h3>Daftar Absensi</h3>{attendance.map((a,i)=><div className='row' key={i}>{a.studentName} | {a.date} | {a.status}</div>)}</div>
  <div className='panel'><h3>Daftar Jadwal</h3>{schedule.map((s,i)=><div className='row' key={i}>{s.date} | {s.time} | {s.group} | {s.field}</div>)}</div>
  </main></div>;
}

function ParentPortal({ session, students, payments, attendance, schedule, logout }) {
  const child = students.find(s=>s.id===session.studentId);
  const pay = payments.filter(p=>p.studentName===child?.name);
  const att = attendance.filter(a=>a.studentName===child?.name);
  return <div className='loginWrap'><div className='parentCard'><img src={logo} className='clubLogoSmall' alt='logo'/><h1>PORTAL ORANG TUA</h1><h2>{child?.name}</h2><p>ID: {child?.id}</p><p>Kelompok: {child?.group}</p><p>Wali: {child?.parent}</p><hr/><p>Total Record Pembayaran: {pay.length}</p><p>Total Record Absensi: {att.length}</p><h3>Jadwal Latihan</h3>{schedule.map((s,i)=><div key={i} className='row'>{s.date} | {s.time} | {s.group} | {s.field}</div>)}<button onClick={logout}>Logout</button></div></div>;
}
