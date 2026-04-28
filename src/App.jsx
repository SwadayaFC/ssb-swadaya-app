import React, { useState } from 'react'; import './App.css';

const logo = 'https://i.ibb.co/6JQp8fH/SwadayaFC-logo.png';

export default function App() { const [page, setPage] = useState('login');

const students = [ { id: 'SWD001', name: 'Andi Saputra', group: 'U12', parent: 'Bpk Joko' }, { id: 'SWD002', name: 'Rizky Maulana', group: 'U12', parent: 'Bpk Ahmad' }, { id: 'SWD003', name: 'Daffa Ardiansyah', group: 'U10', parent: 'Bpk Ardi' }, { id: 'SWD004', name: 'Farel Ramadhan', group: 'U14', parent: 'Bpk Fajar' } ];

const payments = [ { name: 'Andi Saputra', amount: 'Rp150.000', status: 'Lunas' }, { name: 'Rizky Maulana', amount: 'Rp150.000', status: 'Lunas' }, { name: 'Daffa Ardiansyah', amount: 'Rp150.000', status: 'Belum Lunas' } ];

if (page === 'login') return ; if (page === 'ortu') return ; return ; }

function LoginPage({ setPage }) { return ( SSB SWADAYA FC Football Academy Management System Premium <button onClick={() => setPage('admin')}>LOGIN ADMIN <button onClick={() => setPage('ortu')}>LOGIN ORANG TUA ); }

function AdminDashboard({ setPage, students, payments }) { return ( SSB SWADAYA FC Football Academy Management )
                                                          <nav>
      <div>Dashboard</div>
      <div>Data Siswa</div>
      <div>Absensi</div>
      <div>Pembayaran</div>
      <div>Jadwal Latihan</div>
      <div>Pengumuman</div>
      <div>Laporan</div>
    </nav>

    <button className='logoutBtn' onClick={() => setPage('login')}>Logout</button>
  </aside>

  <main className='mainContent'>
    <div className='hero'>
      <h1>Selamat Datang, Admin!</h1>
      <p>Kelola akademi dengan mudah & profesional</p>
    </div>

    <div className='statsGrid'>
      <div className='statBox'><h3>{students.length}</h3><span>Total Siswa</span></div>
      <div className='statBox'><h3>12</h3><span>Hadir Hari Ini</span></div>
      <div className='statBox'><h3>Rp25.000.000</h3><span>Kas Bulan Ini</span></div>
      <div className='statBox'><h3>6</h3><span>Tunggakan</span></div>
    </div>

    <div className='actionGrid'>
      <button>+ Tambah Siswa</button>
      <button>Input Absensi</button>
      <button>Input Pembayaran</button>
      <button>Jadwal Latihan</button>
    </div>

    <div className='panelGrid'>
      <div className='panel'>
        <h3>Data Siswa Aktif</h3>
        {students.map((s, i) => (
          <div className='row' key={i}>{s.id} - {s.name} - {s.group} - {s.parent}</div>
        ))}
      </div>

      <div className='panel'>
        <h3>Status Pembayaran</h3>
        {payments.map((p, i) => (
          <div className='row' key={i}>{p.name} - {p.amount} - {p.status}</div>
        ))}
      </div>
    </div>
  </main>
</div>
); }

function ParentPortal({ setPage, students, payments }) { const student = students[0];

return ( PORTAL ORANG TUA {student.name} ID Siswa : {student.id} Kelompok : {student.group} Wali : {student.parent} Status Pembayaran {payments[0].amount} - {payments[0].status} Absensi Bulan Ini Hadir 7x | Izin 1x | Alpha 0x <button onClick={() => setPage('login')}>Kembali ); }
