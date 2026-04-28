import { useState } from 'react';
import { loginUser, getDashboardStats, getStudents, saveStudent, saveAttendance, savePayment } from './apiService';

export default function App(){
  const [user,setUser] = useState(null);
  const [stats,setStats] = useState({siswa:0,hadir:0,income:'0',foto:18});
  const [students,setStudents] = useState([]);

  async function doLogin(username,password){
    const res = await loginUser(username,password);
    if(res.success){
      setUser(res);
      setStats(await getDashboardStats());
      if(res.role==='admin'){
        const st = await getStudents();
        setStudents(st.slice(1));
      }
    } else alert('Login gagal');
  }

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
    const st = await getStudents();
    setStudents(st.slice(1));
  }

  async function inputAbsensi(){
    await saveAttendance({siswa_id:'SWD001',nama_siswa:'Andi Saputra',status_hadir:'HADIR',pelatih:'Coach Rian'});
    setStats(await getDashboardStats());
  }

  async function inputBayar(){
    await savePayment({bulan:'MEI',siswa_id:'SWD001',nama_siswa:'Andi Saputra',nominal:25000});
    setStats(await getDashboardStats());
  }

  const btn={padding:'12px 18px',border:'none',borderRadius:10,background:'#2563eb',color:'#fff',cursor:'pointer',fontWeight:'bold',marginTop:10};
  const card={background:'#fff',padding:20,borderRadius:14,boxShadow:'0 3px 10px rgba(0,0,0,0.08)',textAlign:'center',fontSize:24,fontWeight:'bold'};

  if(!user){
    return (
      <div style={{minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',background:'linear-gradient(135deg,#0f172a,#2563eb)',fontFamily:'Arial'}}>
        <div style={{background:'#fff',padding:40,borderRadius:20,width:400,textAlign:'center'}}>
          <h1>⚽ SSB SWADAYA FC</h1>
          <p>Football Academy Management System</p>
          <button style={btn} onClick={()=>doLogin('admin','admin123')}>LOGIN ADMIN</button><br/>
          <button style={{...btn,background:'#1d4ed8'}} onClick={()=>doLogin('SWD001','12345')}>LOGIN ORANG TUA</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{display:'flex',minHeight:'100vh',fontFamily:'Arial',background:'#f1f5f9'}}>
      <div style={{width:240,background:'#0f172a',color:'#fff',padding:25}}>
        <h2>⚽ SWADAYA FC</h2>
        <p>{user.role.toUpperCase()} PANEL</p>
      </div>
      <div style={{flex:1,padding:30}}>
        <h1>Dashboard SSB Swadaya</h1>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:15,marginTop:20}}>
          <div style={card}>{stats.siswa}</div>
          <div style={card}>{stats.hadir}</div>
          <div style={card}>{stats.income}</div>
          <div style={card}>{stats.foto}</div>
        </div>

        {user.role==='admin' ? (
          <>
            <div style={{marginTop:20}}>
              <button style={btn} onClick={addStudent}>+ Tambah Siswa</button>
              <button style={{...btn,marginLeft:10}} onClick={inputAbsensi}>Input Absensi</button>
              <button style={{...btn,marginLeft:10}} onClick={inputBayar}>Input Pembayaran</button>
            </div>
            <div style={{background:'#fff',padding:20,borderRadius:15,marginTop:25}}>
              <h3>Daftar Siswa Aktif</h3>
              {students.map((s,i)=><div key={i}>{s[0]} - {s[1]} - {s[2]} - {s[5]}</div>)}
            </div>
          </>
        ) : (
          <div style={{background:'#fff',padding:25,borderRadius:15,marginTop:20}}>
            <h3>Portal Orang Tua Siswa</h3>
            <p>Pantau pembayaran, absensi, jadwal, dan komunikasi admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
