import React, { useState, useEffect } from 'react';
import { Users, CalendarCheck, Wallet, Image, Home, ClipboardList, LogOut } from 'lucide-react';

const SHEET_API = 'https://script.google.com/macros/s/AKfycbxqjfXRXwvYJpeENySWUiLPlhQYRHS1_XqxfWZIbgFpsPOJbA1LytmUrIPRzOr0ZLKC/exec';

export default function App() {
  const [page, setPage] = useState('login');
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetch(SHEET_API)
      .then((r) => r.json())
      .then((d) => {
        setStudents(d.students || []);
        setPayments(d.payments || []);
        setAttendance(d.attendance || []);
      })
      .catch(() => {});
  }, []);

  const totalIncome = payments.reduce((a, b) => a + Number(b.jumlah || 0), 0);

  if (page === 'login') return <LoginPage setPage={setPage} />;
  if (page === 'ortu') return <ParentPortal setPage={setPage} students={students} payments={payments} />;
  return (
    <AdminDashboard
      setPage={setPage}
      students={students}
      payments={payments}
      attendance={attendance}
      totalIncome={totalIncome}
    />
  );
}

function LoginPage({ setPage }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-950 to-blue-600 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center">
        <img src="https://i.imgur.com/4szzQJh.png" alt="logo" className="w-40 mx-auto mb-4" />
        <h1 className="text-5xl font-black text-blue-950 mb-2">SSB SWADAYA FC</h1>
        <p className="text-gray-600 mb-8">Football Academy Management System Premium</p>
        <div className="space-y-4">
          <button onClick={() => setPage('admin')} className="w-full bg-blue-700 text-white py-4 rounded-2xl font-bold">LOGIN ADMIN</button>
          <button onClick={() => setPage('ortu')} className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold">LOGIN ORANG TUA</button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ setPage }) {
  const menus = [
    ['Dashboard', Home],
    ['Data Siswa', Users],
    ['Absensi', CalendarCheck],
    ['Pembayaran', Wallet],
    ['Laporan', ClipboardList],
    ['Galeri', Image]
  ];

  return (
    <div className="w-72 bg-blue-950 text-white min-h-screen p-6">
      <img src="https://i.imgur.com/4szzQJh.png" alt="logo" className="w-24 mx-auto mb-3" />
      <h2 className="text-center text-2xl font-bold mb-10">SWADAYA FC</h2>
      <div className="space-y-3">
        {menus.map(([name, Icon]) => (
          <div key={name} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
            <Icon size={18} /> {name}
          </div>
        ))}
        <button onClick={() => setPage('login')} className="flex items-center gap-3 bg-red-600 p-3 rounded-xl w-full mt-10">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-4">
      <div className="bg-blue-100 p-4 rounded-2xl"><Icon className="text-blue-700" /></div>
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-3xl font-black">{value}</div>
      </div>
    </div>
  );
}

function AdminDashboard({ setPage, students, payments, attendance, totalIncome }) {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar setPage={setPage} />
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-black mb-8">Dashboard SSB Swadaya Premium</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} title="Total Siswa" value={students.length} />
          <StatCard icon={CalendarCheck} title="Absensi Hari Ini" value={attendance.length} />
          <StatCard icon={Wallet} title="Total Pemasukan" value={'Rp' + totalIncome.toLocaleString()} />
          <StatCard icon={Image} title="Dokumentasi" value="18" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl shadow p-6">
            <h2 className="font-bold text-xl mb-4">Daftar Siswa Aktif</h2>
            <div className="space-y-3">
              {students.map((s, i) => (
                <div key={i} className="border rounded-xl p-3 flex justify-between">
                  <span>{s.id} - {s.nama}</span>
                  <span>{s.kelas}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="font-bold text-xl mb-4">Pembayaran Terbaru</h2>
            <div className="space-y-3">
              {payments.map((p, i) => (
                <div key={i} className="border rounded-xl p-3">
                  {p.nama} - Rp{Number(p.jumlah || 0).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParentPortal({ setPage, students, payments }) {
  const siswa = students[0] || {};
  const bayar = payments[0] || {};

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <button onClick={() => setPage('login')} className="mb-6 bg-red-600 text-white px-5 py-2 rounded-xl">Kembali</button>
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-black mb-6">Portal Orang Tua Siswa</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-2xl">
            <h3 className="font-bold mb-2">Data Anak</h3>
            <p>{siswa.nama}</p>
            <p>{siswa.kelas}</p>
            <p>{siswa.ortu}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl">
            <h3 className="font-bold mb-2">Status Pembayaran</h3>
            <p>Terakhir Bayar: Rp{Number(bayar.jumlah || 0).toLocaleString()}</p>
            <p>Status: LUNAS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
