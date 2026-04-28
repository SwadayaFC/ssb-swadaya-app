import React,{useState,useEffect} from 'react';
import './App.css';
import logo from './assets/logo.png';
const API_URL='https://script.google.com/macros/s/AKfycbzWMYSK5FAzaZiJO8f9ODnqcHGu5yjPrElWgiVSTVI29Os9MYcyEvsKu5HOn-x46zqr/exec';

export default function App(){
const [page,setPage]=useState('login');
const [loading,setLoading]=useState(true);
const [cloud,setCloud]=useState({students:[],payments:[],attendance:[],schedule:[]});
const [login,setLogin]=useState({username:'',password:''});
const [member,setMember]=useState(null);
const [student,setStudent]=useState({id:'',nama:'',kelompok:'',ortu:'',hp:''});
const [payment,setPayment]=useState({nama:'',bulan:'',nominal:''});
const [att,setAtt]=useState({nama:'',tanggal:'',status:'Hadir'});
const [sch,setSch]=useState({hari:'',jam:'',kelompok:'',lapangan:''});

const fetchCloud=async()=>{setLoading(true);try{const r=await fetch(API_URL+'?action=all');const d=await r.json();setCloud({students:d.students||[],payments:d.payments||[],attendance:d.attendance||[],schedule:d.schedule||[]});}catch(e){console.log(e)}setLoading(false);}
useEffect(()=>{fetchCloud();},[]);

const handleLogin=async()=>{if(login.username==='admin'&&login.password==='admin123'){setPage('admin');return;}
try{const r=await fetch(API_URL+`?action=login&username=${login.username}&password=${login.password}`);const d=await r.json();if(d.success){const found=cloud.students.find(s=>s.id===d.studentId);setMember(found);setPage('member');}else{alert('Login gagal');}}catch{alert('Login gagal');}}

const postData=async(data,msg)=>{await fetch(API_URL,{method:'POST',body:JSON.stringify(data)});alert(msg);fetchCloud();}

if(loading) return <div className='loading-screen'><img src={logo} className='loading-logo'/><h2>Connecting Cloud Database...</h2></div>

if(page==='login') return <div className='login-page'><div className='overlay'></div><div className='login-box'><img src={logo} className='club-logo'/><h1>SSB SWADAYA FC</h1><p>Enterprise Realtime Cloud</p><input placeholder='Username' onChange={e=>setLogin({...login,username:e.target.value})}/><input type='password' placeholder='Password' onChange={e=>setLogin({...login,password:e.target.value})}/><button onClick={handleLogin}>LOGIN SYSTEM</button></div></div>

if(page==='member') return <div className='member-page'><div className='overlay'></div><div className='member-box'><img src={logo} className='club-logo'/><h1>PORTAL ORANG TUA</h1><h2>{member?.nama}</h2><p>ID: {member?.id}</p><p>Kelompok: {member?.kelompok}</p><p>Wali: {member?.ortu}</p><hr/><p>Total Pembayaran: {cloud.payments.filter(p=>p.nama===member?.nama).length}</p><p>Total Absensi: {cloud.attendance.filter(a=>a.nama===member?.nama).length}</p><h3>Jadwal Latihan</h3>{cloud.schedule.map((j,i)=><div key={i}>{j.hari} - {j.jam}</div>)}<button onClick={()=>setPage('login')}>Logout</button></div></div>

const totalKas=cloud.payments.reduce((a,b)=>a+Number(b.nominal||0),0);

return <div className='admin-page'><div className='sidebar'><img src={logo} className='side-logo'/><h2>ADMIN BUSINESS</h2></div><div className='main-content'><h1>Business Management Dashboard</h1><div className='stats'><div className='card'><h2>{cloud.students.length}</h2><p>Total Siswa</p></div><div className='card'><h2>{cloud.payments.length}</h2><p>Pembayaran</p></div><div className='card'><h2>{cloud.attendance.length}</h2><p>Absensi</p></div><div className='card'><h2>Rp {totalKas}</h2><p>Total Kas</p></div></div>

<div className='cloud-table'><h3>Tambah Siswa Baru</h3><input placeholder='ID' onChange={e=>setStudent({...student,id:e.target.value})}/><input placeholder='Nama' onChange={e=>setStudent({...student,nama:e.target.value})}/><input placeholder='Kelompok' onChange={e=>setStudent({...student,kelompok:e.target.value})}/><input placeholder='Orang Tua' onChange={e=>setStudent({...student,ortu:e.target.value})}/><input placeholder='No HP' onChange={e=>setStudent({...student,hp:e.target.value})}/><button onClick={()=>postData({action:'addStudent',...student},'Siswa tersimpan')}>Simpan Siswa</button></div>

<div className='cloud-table'><h3>Input Pembayaran</h3><input placeholder='Nama Siswa' onChange={e=>setPayment({...payment,nama:e.target.value})}/><input placeholder='Bulan' onChange={e=>setPayment({...payment,bulan:e.target.value})}/><input placeholder='Nominal' onChange={e=>setPayment({...payment,nominal:e.target.value})}/><button onClick={()=>postData({action:'addPayment',...payment},'Pembayaran tersimpan')}>Simpan Pembayaran</button></div>

<div className='cloud-table'><h3>Input Absensi</h3><input placeholder='Nama Siswa' onChange={e=>setAtt({...att,nama:e.target.value})}/><input placeholder='Tanggal' onChange={e=>setAtt({...att,tanggal:e.target.value})}/><input placeholder='Status' onChange={e=>setAtt({...att,status:e.target.value})}/><button onClick={()=>postData({action:'addAttendance',...att},'Absensi tersimpan')}>Simpan Absensi</button></div>

<div className='cloud-table'><h3>Input Jadwal</h3><input placeholder='Hari' onChange={e=>setSch({...sch,hari:e.target.value})}/><input placeholder='Jam' onChange={e=>setSch({...sch,jam:e.target.value})}/><input placeholder='Kelompok' onChange={e=>setSch({...sch,kelompok:e.target.value})}/><input placeholder='Lapangan' onChange={e=>setSch({...sch,lapangan:e.target.value})}/><button onClick={()=>postData({action:'addSchedule',...sch},'Jadwal tersimpan')}>Simpan Jadwal</button></div>
</div></div>
}