import mysql from "mysql2";
const con = mysql.createPool({
    host:"localhost",
    user:"doksummz_form",
    password:"[=p+sFxADuVE",
    database:"doksummz_form"
});

// const con = mysql.createPool({
//     host:"localhost",
//     user:"admin",
//     password:"1234",
//     database:"doksummz_form"
// });

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

function formatDate(timestamp = Date.now()) {
  // Convert input to number if possible
  const ts = Number(timestamp);

  if (!ts) {
    console.error("Invalid timestamp:", timestamp);
    return "Invalid date";
  }

  let date;

  // Detect unit
  if (ts > 1e12) {
    date = new Date(ts); // milliseconds
  } else {
    date = new Date(ts * 1000); // seconds
  }

  if (isNaN(date.getTime())) {
    console.error("Date parsing failed:", timestamp);
    return "Invalid date";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
export {query,formatDate}


