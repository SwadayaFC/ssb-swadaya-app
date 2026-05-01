import React, { useEffect, useState } from 'react';
import './style.css';

const API_URL = 'https://script.google.com/macros/s/AKfycbwmDkiHuFEemLOfpbHH4Nh2XuLfOcqzJOpev-4cWSF-ogbnCBD7Mgbln492qIgYLSVU/exec';
const LOGO_URL = '/logo.png';
const HERO_BG = '/bg.jpg';

async function api(action, payload = {}) {
  try{
    const res = await fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({ action, ...payload })
    });

    return await res.json();
  }catch(err){
    return {
      success:false,
      message:'Koneksi ke Google Apps Script gagal'
    };
  }
}

function LoginPage({ onSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  async function submitLogin() {
  const res = await api('login', { username, password });

  if(res.success){
    onSuccess(res.user);
  }else{
    alert(res.message);
  }

  return (
    <div className="loginScreen" style={{ backgroundImage: `linear-gradient(rgba(7,12,24,.75),rgba(7,12,24,.75)), url(${HERO_BG})` }}>
      <div className="loginGlass">
        <img src={LOGO_URL} alt="logo" style={{width:'120px',marginBottom:'15px'}} />
        <h1>SSB SWADAYA FC</h1>
        <p>Football Academy Management System</p>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <button onClick={submitLogin}>LOGIN SYSTEM</button>
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
    ['announcements','📢 Pengumuman']
  ];

  return (
    <aside className="sidebarV22">
      <div className="brandTop">
        <img src={LOGO_URL} alt="logo" style={{width:'95px',margin:'10px auto',display:'block'}} />
        <h2>SSB SWADAYA FC</h2>
        <span>Football Academy</span>
      </div>

      <div className="menuWrap">
        {menus.map((m,i)=>(
          <button
            key={i}
            className={menu===m[0] ? 'menuBtn active' : 'menuBtn'}
            onClick={()=>setMenu(m[0])}
          >
            {m[1]}
          </button>
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

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState('dashboard');

  const [data, setData] = useState({
    students: [],
    attendance: [],
    payments: [],
    schedule: [],
    announcements: []
  });

  const [showStudentModal, setShowStudentModal] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name:'',
    group:'',
    parent:'',
    phone:'',
    photo:''
  });

  useEffect(()=>{
    if(loggedIn) loadAllData();
  },[loggedIn]);

  async function loadAllData(){
  const res = await api('getAllData');

  if(res.success){
    setData(res.data);
  }else{
    alert(res.message);
  }
}

  async function saveStudent(){
    const res = await api('addStudent', studentForm);
    alert(res.message);

    if(res.success){
      setShowStudentModal(false);
      setStudentForm({
        name:'',
        group:'',
        parent:'',
        phone:'',
        photo:''
      });
      loadAllData();
    }
  }

  async function removeStudent(id){
  if(!window.confirm('Hapus siswa ini?')) return;

  const res = await api('deleteStudent',{id});
  alert(res.message);

  if(res.success){
    loadAllData();
  }
}

  function Dashboard(){
    return (
      <>
        <div className="Banner" style={{
  backgroundImage:`linear-gradient(rgba(2,8,25,.65),rgba(2,8,25,.65)), url(${HERO_BG})`,
  backgroundSize:'cover',
  backgroundPosition:'center',
  borderRadius:'20px',
  padding:'35px'
}}
          <div>
            <h1>Welcome Back, Admin</h1>
            <p>Kelola akademi sepak bola dengan sistem enterprise modern.</p>
          </div>
        </div>

        <div className="summaryGrid">
          <div className="sumCard">
            <div className="sumIcon">👥</div>
            <div>
              <span>Total Siswa</span>
              <h2>{data.students.length}</h2>
            </div>
          </div>

          <div className="sumCard">
            <div className="sumIcon">📅</div>
            <div>
              <span>Absensi</span>
              <h2>{data.attendance.length}</h2>
            </div>
          </div>

          <div className="sumCard">
            <div className="sumIcon">💳</div>
            <div>
              <span>Pembayaran</span>
              <h2>{data.payments.length}</h2>
            </div>
          </div>

          <div className="sumCard">
            <div className="sumIcon">📢</div>
            <div>
              <span>Pengumuman</span>
              <h2>{data.announcements.length}</h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  function StudentsPage(){
    return (
      <div className="tablePage">
        <div className="topBarPage">
          <h2>DATA SISWA</h2>
          <button onClick={()=>setShowStudentModal(true)}>+ Tambah Siswa</button>
        </div>

        <table className="modernTable">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kelompok</th>
              <th>Orang Tua</th>
              <th>HP</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.students.map((s,i)=>(
              <tr key={i}>
                <td>{s.name}</td>
                <td>{s.group}</td>
                <td>{s.parent}</td>
                <td>{s.phone}</td>
                <td>
                  <button className="delBtn" onClick={()=>removeStudent(s.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if(!loggedIn){
    return (
      <LoginPage onSuccess={(u)=>{
        setUser(u);
        setLoggedIn(true);
      }} />
    );
  }

  return (
    <div className="appShell">
      <Sidebar
        menu={menu}
        setMenu={setMenu}
        user={user}
        logout={()=>setLoggedIn(false)}
      />

      <div className="contentArea">
        {menu === 'dashboard' && <Dashboard />}
        {menu === 'students' && <StudentsPage />}

        {menu === 'attendance' && (
          <div className="tablePage">
            <h2>DATA ABSENSI</h2>
            <table className="modernTable">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.attendance.map((a,i)=>(
                  <tr key={i}>
                    <td>{a.student}</td>
                    <td>{a.date}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {menu === 'payments' && (
          <div className="tablePage">
            <h2>DATA PEMBAYARAN</h2>
            <table className="modernTable">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Bulan</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p,i)=>(
                  <tr key={i}>
                    <td>{p.studentName}</td>
                    <td>{p.month}</td>
                    <td>Rp{Number(p.amount).toLocaleString()}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {menu === 'schedule' && (
          <div className="tablePage">
            <h2>JADWAL LATIHAN</h2>
            <table className="modernTable">
              <thead>
                <tr>
                  <th>Kegiatan</th>
                  <th>Tanggal</th>
                  <th>Jam</th>
                  <th>Lokasi</th>
                </tr>
              </thead>
              <tbody>
                {data.schedule.map((j,i)=>(
                  <tr key={i}>
                    <td>{j.title}</td>
                    <td>{j.date}</td>
                    <td>{j.time}</td>
                    <td>{j.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {menu === 'announcements' && (
          <div className="tablePage">
            <h2>PENGUMUMAN</h2>
            {data.announcements.map((n,i)=>(
              <div className="announceItem" key={i}>
                <h4>{n.title}</h4>
                <p>{n.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        show={showStudentModal}
        title="Tambah Siswa Baru"
        onClose={()=>setShowStudentModal(false)}
      >
        <input
          placeholder="Nama Siswa"
          value={studentForm.name}
          onChange={e=>setStudentForm({...studentForm,name:e.target.value})}
        />

        <input
          placeholder="Kelompok Umur"
          value={studentForm.group}
          onChange={e=>setStudentForm({...studentForm,group:e.target.value})}
        />

        <input
          placeholder="Nama Orang Tua"
          value={studentForm.parent}
          onChange={e=>setStudentForm({...studentForm,parent:e.target.value})}
        />

        <input
          placeholder="No HP"
          value={studentForm.phone}
          onChange={e=>setStudentForm({...studentForm,phone:e.target.value})}
        />

        <input
          placeholder="URL Foto"
          value={studentForm.photo}
          onChange={e=>setStudentForm({...studentForm,photo:e.target.value})}
        />

        <button onClick={saveStudent}>SIMPAN SISWA</button>
      </Modal>
    </div>
  );
}
