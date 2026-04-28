const API_URL = 'https://script.google.com/macros/s/AKfycbxqjfXRXwvYJpeENySWUiLPlhQYRHS1_XqxfWZIbgFpsPOJbA1LytmUrIPRzOr0ZLKC/exec';

export async function postData(action,payload={}){
  const res = await fetch(API_URL,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({action,...payload})
  });
  return await res.json();
}

export const loginUser = (username,password)=>postData('loginUser',{username,password});
export const getDashboardStats = ()=>postData('getDashboardStats');
export const getStudents = ()=>postData('getStudents');
export const saveStudent = (data)=>postData('saveStudent',data);
export const saveAttendance = (data)=>postData('saveAttendance',data);
export const savePayment = (data)=>postData('savePayment',data);
