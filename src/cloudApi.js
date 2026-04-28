
const API = 'https://script.google.com/macros/s/AKfycbzWMYSK5FAzaZiJO8f9ODnqcHGu5yjPrElWgiVSTVI29Os9MYcyEvsKu5HOn-x46zqr/exec';

export async function apiGetAll(){
  try{
    const res = await fetch(API);
    return await res.json();
  }catch{
    return {students:[],payments:[],attendance:[],schedule:[]};
  }
}
export async function apiAddStudent(data){
  return fetch(API,{method:'POST',body:JSON.stringify({action:'addStudent',...data})});
}
export async function apiAddPayment(data){
  return fetch(API,{method:'POST',body:JSON.stringify({action:'addPayment',...data})});
}
export async function apiAddAttendance(data){
  return fetch(API,{method:'POST',body:JSON.stringify({action:'addAttendance',...data})});
}
