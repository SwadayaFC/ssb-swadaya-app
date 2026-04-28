import { useState } from 'react';
import { loginUser, getDashboardStats, getStudents, saveStudent, saveAttendance, savePayment } from './apiService';

export default function App(){
  const [user,setUser] = useState(null);
  const [stats,setStats] = useState({siswa:0,hadir:0,income:'0',foto:18});
  const [students,setStudents] = useState([]);
  const [showStudent,setShowStudent] = useState(false);
  const [showAbsen,setShowAbsen] = useState(false);
  const [showBayar,setShowBayar] = useState(false);

  const [form,setForm] = useState({nama:'',kelompok:'U12',ortu:'',wa:'',alamat:''});

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

  async function submitStudent(){
    await saveStudent({
      siswa_id:'SWD'+String(Date.now()).slice(-3),
      nama_siswa:form.nama,
      kelompok_umur:form.kelompok,
      ttl:'2014-01-01',
      alamat:form.alamat,
      nama_ortu:form.ortu,
      no_wa_ortu:form.wa,
      spp:25000
    });
    const st = await getStudents();
    setStudents(st.slice(1));
    setStats(await getDashboardStats());
    setShowStudent(false);
  }

  async function submitAbsensi(){
    await saveAttendance({siswa_id:'SWD001',nama_siswa:'Andi Saputra',status_hadir:'HADIR',pelatih:'Coach Rian'});
    setStats(await getDashboardStats());
    setShowAbsen(false);
  }

  async function submitBayar(){
    await savePayment({bulan:'MEI',siswa_id:'SWD001',nama_siswa:'Andi Saputra',nominal:25000});
    setStats(await getDashboardStats());
    setShowBayar(false);
  }

  const btn={padding:'12px 18px',border:'none',borderRadius:10,background:'#2563eb',color:'#fff',cursor:'pointer',fontWeight:'bold'};
  const card={background:'#fff',padding:20,borderRadius:14,boxShadow:'0 3px 10px rgba(0,0,0,0.08)',textAlign:'center'};
  const input={width:'100%',padding:10,marginTop:10,border:'1px solid #ccc',borderRadius:8};

  if(!user){
    return <div style={{minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',background:'linear-gradient(135deg,#0f172a,#2563eb)',fontFamily:'Arial'}}>
      <div style={{background:'#fff',padding:40,borderRadius:20,width:430,textAlign:'center'}}>
        <h1>⚽ SSB SWADAYA FC</h1>
        <p>Football Academy Management System</p>
        <button style={btn} onClick={()=>doLogin('admin','admin123')}>LOGIN ADMIN</button><br/><br/>
        <button style={btn} onClick={()=>doLogin('SWD001','12345')}>LOGIN ORANG TUA</button>
      </div>
    </div>
  }

  return <div style={{display:'flex',minHeight:'100vh',fontFamily:'Arial',background:'#e2e8f0'}}>
    <div style={{width:250,background:'#0f172a',color:'#fff',padding:25}}>
      <h2>⚽ SWADAYA FC</h2>
      <p style={{opacity:.7}}>{user.role.toUpperCase()} PANEL</p>
      <div style={{marginTop:30,lineHeight:'40px'}}>
        <div>📊 Dashboard</div>
        <div>👥 Data Siswa</div>
        <div>✅ Absensi</div>
        <div>💳 Pembayaran</div>
        <div>📅 Jadwal</div>
        <div>🚪 Logout</div>
      </div>
    </div>

    <div style={{flex:1,padding:30}}>
      <h1>Dashboard SSB Swadaya</h1>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:15,marginTop:20}}>
        <div style={card}><b>Total Siswa</b><h2>{stats.siswa}</h2></div>
        <div style={card}><b>Hadir Hari Ini</b><h2>{stats.hadir}</h2></div>
        <div style={card}><b>Kas Bulan Ini</b><h2>{stats.income}</h2></div>
        <div style={card}><b>Foto Galeri</b><h2>{stats.foto}</h2></div>
      </div>

      {user.role==='admin' ? <>
      <div style={{marginTop:20}}>
        <button style={btn} onClick={()=>setShowStudent(true)}>+ Tambah Siswa</button>
        <button style={{...btn,marginLeft:10}} onClick={()=>setShowAbsen(true)}>Input Absensi</button>
        <button style={{...btn,marginLeft:10}} onClick={()=>setShowBayar(true)}>Input Pembayaran</button>
      </div>

      <div style={{background:'#fff',padding:20,borderRadius:15,marginTop:25}}>
        <h3>Daftar Siswa Aktif</h3>
        {students.map((s,i)=><div key={i} style={{padding:'10px 0',borderBottom:'1px solid #ddd'}}>{s[0]} - {s[1]} - {s[2]} - {s[5]}</div>)}
      </div>
      </> :
      <div style={{background:'#fff',padding:20,borderRadius:15,marginTop:25}}>
        <h3>Portal Orang Tua</h3>
        <p>Monitoring pembayaran, absensi, dan jadwal latihan anak.</p>
      </div>}
    </div>

    {showStudent && <Modal title="Tambah Siswa Baru" onClose={()=>setShowStudent(false)}>
      <input style={input} placeholder="Nama Siswa" onChange={e=>setForm({...form,nama:e.target.value})}/>
      <input style={input} placeholder="Kelompok Umur" onChange={e=>setForm({...form,kelompok:e.target.value})}/>
      <input style={input} placeholder="Nama Orang Tua" onChange={e=>setForm({...form,ortu:e.target.value})}/>
      <input style={input} placeholder="WA Orang Tua" onChange={e=>setForm({...form,wa:e.target.value})}/>
      <input style={input} placeholder="Alamat" onChange={e=>setForm({...form,alamat:e.target.value})}/>
      <button style={{...btn,marginTop:15}} onClick={submitStudent}>Simpan</button>
    </Modal>}

    {showAbsen && <Modal title="Input Absensi Hari Ini" onClose={()=>setShowAbsen(false)}>
      <p>Klik simpan untuk absensi hadir.</p>
      <button style={{...btn,marginTop:15}} onClick={submitAbsensi}>Simpan Absensi</button>
    </Modal>}

    {showBayar && <Modal title="Input Pembayaran Bulanan" onClose={()=>setShowBayar(false)}>
      <p>Klik simpan untuk pembayaran Rp25.000</p>
      <button style={{...btn,marginTop:15}} onClick={submitBayar}>Simpan Pembayaran</button>
    </Modal>}
  </div>
}

function Modal({title,children,onClose}){
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.4)',display:'flex',justifyContent:'center',alignItems:'center'}}>
    <div style={{background:'#fff',padding:25,borderRadius:15,width:400}}>
      <h3>{title}</h3>
      {children}
      <div style={{marginTop:15}}><button onClick={onClose}>Tutup</button></div>
    </div>
  </div>
}
