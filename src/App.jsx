import { useState, useEffect } from 'react';
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
    return <div style={{minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',background:'linear-gradient(135deg,#0f172a,#2563eb)',fontFamily:'Arial'}}>
      <div style={{background:'#fff',padding:40,borderRadius:20,width:400,textAlign:'center',boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
        <h1 style={{fontSize:32,fontWeight:'bold'}}>⚽ SSB SWADAYA FC</h1>
        <p style={{marginBottom:25,color:'#555'}}>Football Academy Management System</p>
        <button style={btn} onClick={()=>doLogin('admin','admin123')}>LOGIN ADMIN</button>
        <button style={{...btn,marginTop:12,background:'#1d4ed8'}} onClick={()=>doLogin('SWD001','12345')}>LOGIN ORANG TUA</button>
      </div>
    </div>
  }

  return <div style={{display:'flex',minHeight:'100vh',fontFamily:'Arial',background:'#f1f5f9'}}>
    <div style={{width:240,background:'#0f172a',color:'#fff',padding:25}}>
      <h2>⚽ SWADAYA FC</h2>
      <p style={{fontSize:13,opacity:0.7}}>{user.role.toUpperCase()} PANEL</p>
      <div style={{marginTop:30,lineHeight:'35px'}}>
        <div>📊 Dashboard</div>
        <div>👥 Data Siswa</div>
        <div>✅ Absensi</div>
        <div>💳 Pembayaran</div>
        <div>📅 Jadwal</div>
      </div>
    </div>

    <div style={{flex:1,padding:30}}>
      <h1 style={{fontSize:28,fontWeight:'bold'}}>Dashboard SSB Swadaya</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:15,marginTop:20}}>
        {Object.values(stats).map((x,i)=><div key={i} style={card}><h2>{x}</h2></div>)}
      </div>

      {user.role==='admin' && <>
        <div style={{marginTop:20}}>
          <button style={btn} onClick={addStudent}>+ Tambah Siswa</button>
          <button style={{...btn,marginLeft:10}} onClick={async()=>{await saveAttendance({siswa_id:'SWD001',nama_siswa:'Andi Saputra',status_hadir:'HADIR',pelatih:'Coach Rian'});loadDashboard();}}>Input Absensi</button>
          <button style={{...btn,marginLeft:10}} onClick={async()=>{await savePayment({bulan:'MEI',siswa_id:'SWD001',nama_siswa:'Andi Saputra',nominal:25000});loadDashboard();}}>Input Pembayaran</button>
        </div>
        <div style={{background:'#fff',padding:20,borderRadius:15,marginTop:25}}>
          <h3>Daftar Siswa Aktif</h3>
          {students.map((s,i)=><div key={i} style={{padding:'8px 0',borderBottom:'1px solid #ddd'}}>{s[0]} - {s[1]} - {s[2]} - {s[5]}</div>)}
        </div>
      </>}

      {user.role==='ortu' && <div style={{background:'#fff',padding:25,borderRadius:15,marginTop:20}}>
        <h3>Portal Orang Tua Siswa</h3>
        <p>Pantau pembayaran, absensi, jadwal, dan komunikasi admin.</p>
      </div>}
    </div>
  </div>
}

const btn = {
  padding:'12px 18px',
  border:'none',
  borderRadius:10,
  background:'#2563eb',
  color:'#fff',
  cursor:'pointer',
  fontWeight:'bold'
};

const card = {
  background:'#fff',
  padding:20,
  borderRadius:14,
  boxShadow:'0 3px 10px rgba(0,0,0,0.08)',
  textAlign:'center',
  fontSize:24,
  fontWeight:'bold'
};
