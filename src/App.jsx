import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/logo.png';

const seedUsers = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
  { username: 'ortu1', password: 'ortu123', role: 'member', name: 'Bpk Joko', studentId: 'SWD001' }
];

export default function App() {
  const [session, setSession] = useState(JSON.parse(localStorage.getItem('session')) || null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const [students, setStudents] = useState(JSON.parse(localStorage.getItem('students')) || [
    { id: 'SWD001', name: 'Andi Saputra', group: 'U12', parent: 'Bpk Joko' },
    { id: 'SWD002', name: 'Rizky Maulana', group: 'U14', parent: 'Bpk Ahmad' }
  ]);

  const [payments] = useState(JSON.parse(localStorage.getItem('payments')) || [
    { name: 'Andi Saputra', amount: '150000', status: 'Lunas' }
  ]);

  const [attendance] = useState(JSON.parse(localStorage.getItem('attendance')) || [
    { name: 'Andi Saputra', status: 'Hadir' }
  ]);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const doLogin = () => {
    const found = seedUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (!found) { setError('Username atau password salah'); return; }
    localStorage.setItem('session', JSON.stringify(found));
    setSession(found);
  };

  const logout = () => {
    localStorage.removeItem('session');
    setSession(null);
  };

  if (!session) return <LoginPage loginForm={loginForm} setLoginForm={setLoginForm} doLogin={doLogin} error={error} />;
  if (session.role === 'member') return <ParentPortal session={session} students={students} payments={payments} attendance={attendance} logout={logout} />;
  return <AdminDashboard students={students} setStudents={setStudents} payments={payments} attendance={attendance} logout={logout} />;
}

function LoginPage({ loginForm, setLoginForm, doLogin, error }) {
  return (
    <div className='loginWrap'>
      <div className='overlay'></div>
      <div className='loginCard'>
        <img src={logo} alt='logo' className='clubLogo' />
        <h1>SSB SWADAYA FC</h1>
        <p>Management System Authentication</p>
        <input placeholder='Username' value={loginForm.username} onChange={(e)=>setLoginForm({...loginForm,username:e.target.value})}/>
        <input type='password' placeholder='Password' value={loginForm.password} onChange={(e)=>setLoginForm({...loginForm,password:e.target.value})}/>
        {error && <div className='errorBox'>{error}</div>}
        <button onClick={doLogin}>LOGIN SYSTEM</button>
        <div className='demoInfo'>Admin: admin/admin123<br/>Member: ortu1/ortu123</div>
      </div>
    </div>
  );
}

function AdminDashboard({ students, setStudents, payments, attendance, logout }) {
  const [newStudent, setNewStudent] = useState({ id:'', name:'', group:'', parent:'' });

  const addStudent = () => {
    if (!newStudent.id || !newStudent.name) return;
    setStudents([...students, newStudent]);
    setNewStudent({ id:'', name:'', group:'', parent:'' });
  };

  const deleteStudent = (id) => setStudents(students.filter(s => s.id !== id));
  const totalKas = payments.reduce((a,b)=>a+Number(b.amount),0);

  return (
    <div className='appShell'>
      <aside className='sidebar'>
        <img src={logo} className='sideLogo' />
        <h2>ADMIN PANEL</h2>
        <nav><div>Dashboard</div><div>Data Siswa</div><div>Pembayaran</div><div>Absensi</div></nav>
        <button className='logoutBtn' onClick={logout}>Logout</button>
      </aside>

      <main className='mainContent'>
        <h1>Dashboard Administrator</h1>
        <div className='statsGrid'>
          <div className='statBox'><h3>{students.length}</h3><span>Total Siswa</span></div>
          <div className='statBox'><h3>{attendance.length}</h3><span>Absensi</span></div>
          <div className='statBox'><h3>Rp {totalKas.toLocaleString()}</h3><span>Total Kas</span></div>
          <div className='statBox'><h3>{payments.length}</h3><span>Pembayaran</span></div>
        </div>

        <div className='panel'>
          <h3>Tambah Siswa Baru</h3>
          <input placeholder='ID' value={newStudent.id} onChange={(e)=>setNewStudent({...newStudent,id:e.target.value})}/>
          <input placeholder='Nama' value={newStudent.name} onChange={(e)=>setNewStudent({...newStudent,name:e.target.value})}/>
          <input placeholder='Kelompok' value={newStudent.group} onChange={(e)=>setNewStudent({...newStudent,group:e.target.value})}/>
          <input placeholder='Orang Tua' value={newStudent.parent} onChange={(e)=>setNewStudent({...newStudent,parent:e.target.value})}/>
          <button onClick={addStudent}>Tambah Data</button>
        </div>

        <div className='panel'>
          <h3>Daftar Siswa</h3>
          {students.map((s,i)=><div className='row' key={i}>{s.id} - {s.name} - {s.group} - {s.parent} <button onClick={()=>deleteStudent(s.id)}>Hapus</button></div>)}
        </div>
      </main>
    </div>
  );
}

function ParentPortal({ session, students, payments, attendance, logout }) {
  const child = students.find(s => s.id === session.studentId);
  const pay = payments.find(p => p.name === child?.name);
  const att = attendance.find(a => a.name === child?.name);

  return (
    <div className='loginWrap'>
      <div className='parentCard'>
        <img src={logo} className='clubLogoSmall' />
        <h1>PORTAL ORANG TUA</h1>
        <h2>{child?.name}</h2>
        <p>ID: {child?.id}</p>
        <p>Kelompok: {child?.group}</p>
        <p>Wali: {child?.parent}</p>
        <hr />
        <p>Pembayaran: {pay ? pay.status : 'Belum Ada'}</p>
        <p>Absensi: {att ? att.status : 'Belum Ada'}</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
