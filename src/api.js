const API_URL = "https://script.google.com/macros/s/AKfycbx6L0TpLHPGgb433UbYKOIOCKzVvf1-Vq2UXgl45qKYHLU8DQU4SHGHEJXT45AUqdyZ/exec";

export async function apiGet(action){
  const res = await fetch(`${API_URL}?action=${action}`);
  return await res.json();
}

export async function apiPost(payload){
  const res = await fetch(API_URL,{
    method:'POST',
    body:JSON.stringify(payload),
    headers:{
      'Content-Type':'application/json'
    }
  });
  return await res.json();
}

export async function login(username,password){
  return await apiPost({
    action:'login',
    username,
    password
  });
}

export async function getDashboard(){
  return await apiGet('dashboard');
}

export async function getStudents(){
  return await apiGet('students');
}

export async function getStaff(){
  return await apiGet('staff');
}

export async function getPayments(){
  return await apiGet('payments');
}

export async function getAttendance(){
  return await apiGet('attendance');
}

export async function getSchedule(){
  return await apiGet('schedule');
}

export async function addStudent(data){
  return await apiPost({action:'addStudent',...data});
}

export async function updateStudent(data){
  return await apiPost({action:'updateStudent',...data});
}

export async function deleteStudent(id){
  return await apiPost({action:'deleteStudent',id});
}

export async function addStaff(data){
  return await apiPost({action:'addStaff',...data});
}

export async function updateStaff(data){
  return await apiPost({action:'updateStaff',...data});
}

export async function deleteStaff(id){
  return await apiPost({action:'deleteStaff',id});
}

export async function addPayment(data){
  return await apiPost({action:'addPayment',...data});
}

export async function updatePayment(data){
  return await apiPost({action:'updatePayment',...data});
}

export async function deletePayment(id){
  return await apiPost({action:'deletePayment',id});
}

export async function addAttendance(data){
  return await apiPost({action:'addAttendance',...data});
}

export async function updateAttendance(data){
  return await apiPost({action:'updateAttendance',...data});
}

export async function deleteAttendance(id){
  return await apiPost({action:'deleteAttendance',id});
}

export async function addSchedule(data){
  return await apiPost({action:'addSchedule',...data});
}

export async function updateSchedule(data){
  return await apiPost({action:'updateSchedule',...data});
}

export async function deleteSchedule(id){
  return await apiPost({action:'deleteSchedule',id});
}
