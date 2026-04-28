import React, { useState } from 'react';
import './App.css';
import logo from './assets/logo.png';

export default function App(){
 const [page,setPage]=useState('login');
 const students=[{id:'SWD001',name:'Andi Saputra',group:'U12',parent:'Bpk Joko',phone:'0812xxxx'},{id:'SWD002',name:'Rizky Maulana',group:'U14',parent:'Bpk Ahmad',phone:'0813xxxx'}];
 const payments=[{name:'Andi Saputra',month:'Juli',amount:'Rp150.000',status:'Lunas'},{name:'Rizky Maulana',month:'Juli',amount:'Rp150.000',status:'Pending'}];
 const attendance=[{name:'Andi Saputra',status:'Hadir'},{name:'Rizky Maulana',status:'Izin'}];
 if(page==='login') return <LoginPage setPage={setPage} />;
 if(page==='ortu') return <ParentPortal setPage={setPage} students={students} payments={payments} attendance={attendance}/>;
 return <AdminDashboard setPage={setPage} students={students} payments={payments} attendance={attendance} />;
}
function LoginPage({setPage}){return <div className='loginWrap'><div className='overlay'></div><div className='loginCard'><img src={logo} className='clubLogo'/><h1>SSB SWADAYA FC</h1><p>Football Academy Management System Enterprise</p><div className='btnRow'><button onClick={()=>setPage('admin')}>LOGIN ADMIN</button><button onClick={()=>setPage('ortu')}>LOGIN ORANG TUA</button></div></div></div>}
function AdminDashboard({setPage,students,payments,attendance}){return <div className='appShell'><aside className='sidebar'><img src={logo} className='sideLogo'/><h2>SWADAYA FC</h2><small>ADMIN PANEL</small><nav><div>🏠 Dashboard</div><div>👥 Data Siswa</div><div>📅 Absensi</div><div>💰 Pembayaran</div><div>🗓 Jadwal Latihan</div><div>📈 Laporan</div></nav><button className='logoutBtn' onClick={()=>setPage('login')}>Logout</button></aside><main className='mainContent'><h1>Dashboard Management</h1><div className='statsGrid'><div className='statBox'><h3>{students.length}</h3><span>Total Siswa</span></div><div className='statBox'><h3>{attendance.length}</h3><span>Input Absensi</span></div><div className='statBox'><h3>Rp25.000.000</h3><span>Total Kas</span></div><div className='statBox'><h3>3</h3><span>Jadwal Minggu Ini</span></div></div><section className='panel'><h3>Daftar Siswa Aktif</h3>{students.map((s,i)=><div className='row' key={i}>{s.id} - {s.name} - {s.group} - {s.parent}</div>)}</section><section className='panel'><h3>Status Pembayaran</h3>{payments.map((p,i)=><div className='row' key={i}>{p.name} | {p.month} | {p.amount} | {p.status}</div>)}</section></main></div>}
function ParentPortal({setPage,students,payments,attendance}){const s=students[0];return <div className='loginWrap'><div className='parentCard'><img src={logo} className='clubLogoSmall'/><h1>PORTAL ORANG TUA</h1><h2>{s.name}</h2><p>Kelompok: {s.group}</p><p>Pembayaran: {payments[0].status}</p><p>Absensi: {attendance[0].status}</p><button onClick={()=>setPage('login')}>KEMBALI</button></div></div>}