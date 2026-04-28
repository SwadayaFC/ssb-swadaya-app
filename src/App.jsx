import React, { useState } from 'react';
          <div>Data Siswa</div>
          <div>Absensi</div>
          <div>Pembayaran</div>
          <div>Jadwal Latihan</div>
          <div>Pengumuman</div>
          <div>Laporan</div>
        </nav>
        <button className='logoutBtn' onClick={()=>setPage('login')}>Logout</button>
      </aside>

      <main className='mainContent'>
        <div className='hero'>
          <h1>Selamat Datang, Admin!</h1>
          <p>Kelola akademi dengan mudah & profesional</p>
        </div>

        <div className='statsGrid'>
          <div className='statBox'><h3>{students.length}</h3><span>Total Siswa</span></div>
          <div className='statBox'><h3>12</h3><span>Hadir Hari Ini</span></div>
          <div className='statBox'><h3>Rp25.000</h3><span>Kas Bulan Ini</span></div>
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
            <h3>Data Siswa Terbaru</h3>
            {students.map((s,i)=><div key={i} className='row'>{s.id} - {s.name} - {s.group} - {s.parent}</div>)}
          </div>

          <div className='panel'>
            <h3>Pembayaran Terbaru</h3>
            {payments.map((p,i)=><div key={i} className='row'>{p.name} - {p.amount} - {p.status}</div>)}
          </div>
        </div>
      </main>
    </div>
  )
}

function ParentPortal({setPage,students,payments}){
  const student = students[0];
  return (
    <div className='loginWrap'>
      <div className='parentCard'>
        <img src={logo} className='clubLogoSmall'/>
        <h1>PORTAL ORANG TUA</h1>
        <h2>{student.name}</h2>
        <p>ID Siswa : {student.id}</p>
        <p>Kelompok : {student.group}</p>
        <p>Orang Tua : {student.parent}</p>
        <hr/>
        <h3>Status Pembayaran</h3>
        <p>{payments[0].amount} - {payments[0].status}</p>
        <h3>Absensi Bulan Ini</h3>
        <p>Hadir 7x | Izin 1x | Alpha 0x</p>
        <button onClick={()=>setPage('login')}>Kembali</button>
      </div>
    </div>
  )
}
