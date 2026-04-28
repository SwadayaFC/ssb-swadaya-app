
import React, { useState, useEffect } from 'react';
import './App.css';
import { apiGetAll, apiAddStudent, apiAddPayment, apiAddAttendance } from './cloudApi';

const logo = 'https://i.imgur.com/1vQwK0T.png';
const bg = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80';

export default function App(){
  const [role,setRole]=useState(null);
  const [user,setUser]=useState('');
  const [pass,setPass]=useState('');
  const [cloud,setCloud]=useState({students:[],payments:[],attendance:[],schedule:[]});
  const [student,setStudent]=useState({id:'',nama:'',kelompok:'',ortu:'',hp:''});
  const [payment,setPayment]=useState({nama:'',bulan:'',nominal:''});
  const [attendance,setAttendance]=useState({nama:'',tanggal:'',status:'Hadir'});

  useEffect(()=>{ if(role) loadCloud(); },[role]);

  async function loadCloud(){
    const data = await apiGetAll();
    setCloud(data);
  }

  function login(){
    if(user==='admin' && pass==='admin123') setRole('admin');
    else if(user==='ortu' && pass==='ortu123') setRole('ortu');
    else alert('Login gagal');
  }

  async function saveStudent(){
    await apiAddStudent(student); loadCloud(); alert('Siswa tersimpan');
  }
  async function savePayment(){
    await apiAddPayment(payment); loadCloud(); alert('Pembayaran tersimpan');
  }
  async function saveAttendance(){
    await apiAddAttendance(attendance); loadCloud(); alert('Absensi tersimpan');
  }

  if(!role){
    return <div className="login-page" style={{backgroundImage:`linear-gradient(rgba(0,20,60,.65),rgba(0,20,60,.65)),url(${bg})`}}>
      <div className="login-box">
        <img src={logo} className="logo"/>
        <h1>SSB SWADAYA FC</h1>
        <p>Realtime Cloud Business Management</p>
        <input placeholder="Username" onChange={e=>setUser(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e=>setPass(e.target.value)} />
        <button onClick={login}>LOGIN SYSTEM</button>
      </div>
    </div>
  }

  if(role==='ortu'){
    const s = cloud.students[0] || {};
    return <div className="login-page" style={{backgroundImage:`linear-gradient(rgba(30,80,0,.45),rgba(30,80,0,.45)),url(${bg})`}}>
      <div className="portal-box">
        <img src={logo} className="logo"/>
        <h1>PORTAL ORANG TUA</h1>
        <h2>{s.nama || '-'}</h2>
        <p>ID: {s.id}</p>
        <p>Kelompok: {s.kelompok}</p>
        <p>Wali: {s.ortu}</p>
        <hr/>
        <p>Total Record Pembayaran: {cloud.payments.length}</p>
        <p>Total Record Absensi: {cloud.attendance.length}</p>
        <h3>Jadwal Latihan</h3>
        {cloud.schedule.map((j,i)=><p key={i}>{j.hari} - {j.jam}</p>)}
        <button onClick={()=>setRole(null)}>Logout</button>
      </div>
    </div>
  }

  const totalKas = cloud.payments.reduce((a,b)=>a+Number(b.nominal||0),0);

  return <div className="dash">
    <aside>
      <img src={logo} className="side-logo"/>
      <h2>ADMIN BUSINESS</h2>
      <div className="menu">Dashboard</div>
      <div className="menu">Students</div>
      <div className="menu">Payments</div>
      <div className="menu">Attendance</div>
    </aside>
    <main>
      <h1>Business Management Dashboard</h1>
      <div className="stats">
        <div className="card"><b>{cloud.students.length}</b><span>Total Siswa</span></div>
        <div className="card"><b>{cloud.payments.length}</b><span>Pembayaran</span></div>
        <div className="card"><b>{cloud.attendance.length}</b><span>Absensi</span></div>
        <div className="card"><b>Rp {totalKas}</b><span>Total Kas</span></div>
      </div>

      <section className="panel">
        <h3>Tambah Siswa Baru</h3>
        <input placeholder="ID" onChange={e=>setStudent({...student,id:e.target.value})}/>
        <input placeholder="Nama" onChange={e=>setStudent({...student,nama:e.target.value})}/>
        <input placeholder="Kelompok" onChange={e=>setStudent({...student,kelompok:e.target.value})}/>
        <input placeholder="Orang Tua" onChange={e=>setStudent({...student,ortu:e.target.value})}/>
        <input placeholder="No HP Wali" onChange={e=>setStudent({...student,hp:e.target.value})}/>
        <button onClick={saveStudent}>Simpan Siswa</button>
      </section>

      <section className="panel">
        <h3>Input Pembayaran</h3>
        <input placeholder="Nama Siswa" onChange={e=>setPayment({...payment,nama:e.target.value})}/>
        <input placeholder="Bulan" onChange={e=>setPayment({...payment,bulan:e.target.value})}/>
        <input placeholder="Nominal" onChange={e=>setPayment({...payment,nominal:e.target.value})}/>
        <button onClick={savePayment}>Simpan Pembayaran</button>
      </section>

      <section className="panel">
        <h3>Input Absensi</h3>
        <input placeholder="Nama Siswa" onChange={e=>setAttendance({...attendance,nama:e.target.value})}/>
        <input placeholder="Tanggal" onChange={e=>setAttendance({...attendance,tanggal:e.target.value})}/>
        <input placeholder="Status" onChange={e=>setAttendance({...attendance,status:e.target.value})}/>
        <button onClick={saveAttendance}>Simpan Absensi</button>
      </section>
    </main>
  </div>
}
