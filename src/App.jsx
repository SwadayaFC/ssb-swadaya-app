import React, { useEffect, useState } from 'react';
import './style.css';

const API_URL = 'https://script.google.com/macros/s/AKfycbxtnSpB7YbVf4CDKj-ZNrz5MxL3pRVbTR8IczafoRrcAyg5RD5QBJoCh8x4rVAkEWJh/exec';
const LOGO_URL = 'https://drive.google.com/uc?export=view&id=1x2wcr8kQUTKY9oxABkOrKeW5ras0Xc8A';
const HERO_BG = 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1600&auto=format&fit=crop';

async function api(action, payload = {}) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: String(err) };
  }
}

function LoginPage({ onSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  async function submitLogin() {
    setLoading(true);
    const res = await api('login', { username, password });
    setLoading(false);
    if (res.success) {
      onSuccess(res.user);
    } else {
      alert(res.message || 'Login gagal');
    }
  }

  return (
    <div className="loginScreen" style={{ backgroundImage: `linear-gradient(rgba(7,12,24,.75),rgba(7,12,24,.75)), url(${HERO_BG})` }}>
      <div className="loginGlass">
        <img src={LOGO_URL} className="clubLogo" alt="logo" />
        <h1>SSB SWADAYA FC</h1>
        <p>Football Academy Management System</p>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <button onClick={submitLogin}>{loading ? 'PROCESSING...' : 'LOGIN SYSTEM'}</button>
      </div>
    </div>
  );
}

function Sidebar({ menu, setMenu, user, logout }) {
  const menus = [
    ['dashboard','🏠 Dashboard'],
    ['students','👥 Data Siswa'],
    ['attendance','📅 Absensi'],
    ['payments','💳 Pembayaran'],
    ['schedule','⚽ Jadwal'],
    ['reports','📊 Laporan']
  ];

  return (
    <aside className="sidebarV22">
      <div className="brandTop">
        <img src={LOGO_URL} alt="logo" />
        <h2>SSB SWADAYA FC</h2>
        <span>Football Academy</span>
      </div>

      <div className="menuWrap">
        {menus.map((m,i)=>(
          <button key={i} className={menu===m[0] ? 'menuBtn active' : 'menuBtn'} onClick={()=>setMenu(m[0])}>{m[1]}</button>
        ))}
      </div>

      <div className="userCard">
        <strong>{user?.name}</strong>
        <small>{user?.role}</small>
      </div>

      <button className="logoutBtn" onClick={logout}>🚪 Logout</button>
    </aside>
  );
}

function HeroBanner() {
  return (
    <div className="heroBanner" style={{ backgroundImage: `linear-gradient(rgba(17,24,39,.55),rgba(17,24,39,.55)), url(${HERO_BG})` }}>
      <div>
        <h1>Welcome Back, Admin</h1>
        <p>Kelola akademi sepak bola dengan sistem enterprise modern.</p>
      </div>
      <div className="heroDate">{new Date().toLocaleDateString('id-ID')}</div>
    </div>
  );
}

function SummaryCards({ summary }) {
  const cards = [
    ['👥','Total Siswa', summary.totalStudents],
    ['✅','Hadir Hari Ini', summary.hadirToday],
    ['💰','Kas Bulan Ini', 'Rp'+Number(summary.income).toLocaleString()],
    ['⚠️','Tunggakan', summary.tunggakan]
  ];

  return (
    <div className="summaryGrid">
      {cards.map((c,i)=>(
        <div className="sumCard" key={i}>
          <div className="sumIcon">{c[0]}</div>
          <div>
            <span>{c[1]}</span>
            <h2>{c[2]}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickActions() {
  const btns = ['+ Tambah Siswa','+ Input Absensi','+ Input Pembayaran','+ Buat Jadwal'];
  return <div className="quickActions">{btns.map((b,i)=><button key={i}>{b}</button>)}</div>;
}

function StudentTable({ students }) {
  return (
    <div className="panel large">
      <div className="panelHeader"><span>👥 Data Siswa Terbaru</span></div>
      <table className="modernTable">
        <thead><tr><th>No</th><th>Nama</th><th>Kelompok</th><th>Orang Tua</th><th>Status</th></tr></thead>
        <tbody>
          {students.slice(0,5).map((s,i)=>(<tr key={i}><td>{i+1}</td><td>{s.name}</td><td>{s.group}</td><td>{s.parent}</td><td><span className="badge active">Aktif</span></td></tr>))}
        </tbody>
      </table>
    </div>
  );
}

function AttendancePanel({ attendance }) {
  return (
    <div className="panel medium">
      <div className="panelHeader"><span>📅 Absensi Hari Ini</span></div>
      <div className="activityList">
        {attendance.slice(0,5).map((a,i)=>(<div className="activityRow" key={i}><span>{a.student}</span><span className={a.status==='Hadir' ? 'badge hadir':'badge belum'}>{a.status}</span></div>))}
      </div>
    </div>
  );
}

function PaymentPanel({ payments }) {
  return (
    <div className="panel large">
      <div className="panelHeader"><span>💳 Pembayaran Terbaru</span></div>
      <table className="modernTable">
        <thead><tr><th>Nama</th><th>Bulan</th><th>Jumlah</th><th>Status</th></tr></thead>
        <tbody>
          {payments.slice(0,5).map((p,i)=>(<tr key={i}><td>{p.studentName}</td><td>{p.month}</td><td>Rp{Number(p.amount).toLocaleString()}</td><td><span className={p.status==='Lunas' ? 'badge active':'badge belum'}>{p.status}</span></td></tr>))}
        </tbody>
      </table>
    </div>
  );
}

function AnnouncementPanel({ announcements }) {
  return (
    <div className="panel medium">
      <div className="panelHeader"><span>📢 Pengumuman</span></div>
      <div className="announceWrap">
        {announcements.slice(0,4).map((a,i)=>(<div className="announceItem" key={i}><h4>{a.title}</h4><p>{a.content}</p></div>))}
      </div>
    </div>
  );
}

function DataTable({ title, rows, cols }) {
  return (
    <div className="tablePage">
      <h2>{title}</h2>
      <table className="modernTable">
        <thead><tr>{cols.map((c,i)=><th key={i}>{c.toUpperCase()}</th>)}</tr></thead>
        <tbody>{rows.map((r,i)=><tr key={i}>{cols.map((c,j)=><td key={j}>{r[c]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function MainContent({ menu, data, summary }) {
  if(menu==='dashboard'){
    return <>
      <HeroBanner />
      <SummaryCards summary={summary} />
      <QuickActions />
      <div className="gridTwo"><StudentTable students={data.students} /><AttendancePanel attendance={data.attendance} /></div>
      <div className="gridTwo"><PaymentPanel payments={data.payments} /><AnnouncementPanel announcements={data.announcements} /></div>
    </>;
  }

  if(menu==='students') return <DataTable title="DATA SISWA" rows={data.students} cols={['name','group','parent','phone','status']} />;
  if(menu==='attendance') return <DataTable title="DATA ABSENSI" rows={data.attendance} cols={['student','date','status']} />;
  if(menu==='payments') return <DataTable title="DATA PEMBAYARAN" rows={data.payments} cols={['studentName','month','amount','status']} />;
  if(menu==='schedule') return <DataTable title="JADWAL LATIHAN" rows={data.schedule} cols={['title','date','time','location']} />;

  return <div className="tablePage"><h2>Menu Dalam Pengembangan</h2></div>;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState('dashboard');
  const [data, setData] = useState({ students: [], attendance: [], payments: [], schedule: [], announcements: [] });

  useEffect(()=>{
    if(loggedIn) loadAllData();
  }, [loggedIn]);

  async function loadAllData(){
    const res = await api('getAllData');
    if(res.success) setData(res.data);
  }

  function getSummary(){
    return {
      totalStudents: data.students.length,
      hadirToday: data.attendance.filter(x=>x.status==='Hadir').length,
      income: data.payments.filter(x=>x.status==='Lunas').reduce((a,b)=>a+Number(b.amount),0),
      tunggakan: data.payments.filter(x=>x.status!=='Lunas').length
    };
  }

  if(!loggedIn){
    return <LoginPage onSuccess={(u)=>{setUser(u);setLoggedIn(true);}} />;
  }

  return (
    <div className="appShell">
      <Sidebar menu={menu} setMenu={setMenu} user={user} logout={()=>setLoggedIn(false)} />
      <div className="contentArea">
        <MainContent menu={menu} data={data} summary={getSummary()} />
        <div className="footer">© 2025 SSB Swadaya FC - Football Academy Management System</div>
      </div>
    </div>
  );
}
