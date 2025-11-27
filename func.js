import mysql from "mysql2";

const con = mysql.createPool({
    host:"localhost",
    user:"doksummz_form",
    password:"J=^y0hCh)r3W",
    database:"doksummz_form"
});

const query = (query,input)=> new Promise((res,rej)=>{
    con.getConnection((err,connection)=>{
if(err)return rej(err);
connection.query(query,input,(err,result)=>{
if(err) return rej(err);
res(result);
connection.release();
});
});
});


function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour:"2-digit",
    minute:"2-digit",
    second:"2-digit",
    
  });
}
export {query,formatDate}


