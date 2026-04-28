import { useState, useEffect } from 'react';
import { loginUser, getDashboardStats, getStudents, saveStudent, saveAttendance, savePayment } from './apiService';

function Card({children}){ return <div style={{background:'#fff',padding:20,borderRadius:12,boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>{children}</div> }

export default function App(){
  const [user,setUser] = useState(null);
  const [stats,setStats] = useState({siswa:0,hadir:0,income:'0',foto:18});
  const [students,setStudents] = useState([]);

  async function doLogin(username,password){
    const res = await loginUser(username,password);
    if(res.success){
      setUser(res);
      loadDashboard();
      if(res.role==='admin') loadStudents();
    }else alert('Login gagal');
  }

  async function loadDashboard(){ setStats(await getDashboardStats()); }
  async function loadStudents(){ const data = await getStudents(); setStudents(data.slice(1)); }

  async function addStudent(){
    await saveStudent({
      siswa_id:'SWD'+String(Date.now()).slice(-3),
      nama_siswa:'Siswa Baru',
      kelompok_umur:'U12',
      ttl:'2014-01-01',
      alamat:'Baturaja',
      nama_ortu:'Ortu Baru',
      no_wa_ortu:'089000000',
      spp:25000
    });
    loadStudents();
  }

  if(!user){
    return <div style={{padding:40,fontFamily:'Arial'}}>
      <h1>SSB SWADAYA LOGIN</h1>
      <button onClick={()=>doLogin('admin','admin123')}>Login Admin Demo</button>
      <button onClick={()=>doLogin('SWD001','12345')} style={{marginLeft:10}}>Login Ortu Demo</button>
    </div>
  }

  return <div style={{padding:40,fontFamily:'Arial'}}>
    <h1>SSB SWADAYA APP ({user.role})</h1>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:15,marginBottom:20}}>
      {Object.values(stats).map((x,i)=><Card key={i}><b>{x}</b></Card>)}
    </div>

    {user.role==='admin' && <>
      <button onClick={addStudent}>Tambah Siswa</button>
      <button onClick={async()=>{await saveAttendance({siswa_id:'SWD001',nama_siswa:'Andi Saputra',status_hadir:'HADIR',pelatih:'Coach Rian'});loadDashboard();}} style={{marginLeft:10}}>Input Absensi</button>
      <button onClick={async()=>{await savePayment({bulan:'MEI',siswa_id:'SWD001',nama_siswa:'Andi Saputra',nominal:25000});loadDashboard();}} style={{marginLeft:10}}>Input Pembayaran</button>
      <div style={{marginTop:20}}>
        <h3>Data Siswa</h3>
        {students.map((s,i)=><div key={i}>{s[0]} - {s[1]} - {s[2]}</div>)}
      </div>
    </>}

    {user.role==='ortu' && <Card><h3>Panel Orang Tua</h3><p>Lihat data anak, absensi, pembayaran.</p></Card>}
  </div>
}