import express from "express";
import { ojs } from "ojs-loader";
import {query,formatDate} from "./func.js";
import cors from "cors";

let user_id; //= "hJk89LsjxyP67";
function getCookie(req,name) {
  //console.log(req.headers.cookie, "cookie header");
  const value = `; ${req.headers.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use((req,res,next)=>{
  // console.log(getCookie(req,"uid"));
    user_id = getCookie(req,"uid");
    next();
});

app.get("/.well-known/acme-challenge/79NIalHEMm0YZFFPWmnl1uoTx5hkkbJAhTXvpoEgO5Y",(req,res)=>{
  res.end("79NIalHEMm0YZFFPWmnl1uoTx5hkkbJAhTXvpoEgO5Y.Gr4Oc50vxgPq01-CP7aUQVMkOMJDFd_7-zr-e7TNA1g");
});
app.get("/docs/api-reference",(req,res)=>{
  //res.end(ojs.get("docs.html"));
  res.end("");
});
app.get("/logout",(req,res)=>{
  res.header("Set-Cookie",`uid=; Path=/; HttpOnly`);
  res.redirect("/");
});

app.get("/",(req,res)=>{
res.end(ojs.get("index.html"));
});

const getUser = async(user_id)=>{
   let user = await query("SELECT * FROM `users` WHERE `uid`=? ",[user_id]);
   return user[0];
}
const public_key = async(user_id)=>{
   let pubKey = await query("SELECT `public_key` FROM `users` WHERE `uid`=? ",[user_id]);
  return pubKey[0]?.public_key;
}
function random(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}

app.get("/dashboard",async(req,res)=>{
    let [pubKey,user] = await Promise.all([public_key(user_id),getUser(user_id)]);
   let [his,forms] = await Promise.all([
      query("SELECT (select count(*) as total from form_submission WHERE owner_id=?) AS submission, ( select count(*) as total from forms where status='active' and owner_id=? ) as active;",[pubKey,pubKey]),
      query("select * from form_submission where owner_id=? ORDER by id DESC limit 2",[pubKey])
   ]);
   const {submission,active} = his[0];
   for(let i in forms){
     let data = JSON.parse(forms[i].data);
     forms[i].data = [];
    for(let v in data){
      forms[i].data.push(data[v])
    }
   forms[i].data = forms[i].data.join(", ").slice(0,100);
    forms[i].date = formatDate(forms[i].date);
   }
  //  console.log(his,forms)
res.end(ojs.get("dashboard.html",{forms,submission,active,user:user.fullname,key:user.public_key}));
});
app.get("/submissions",async(req,res)=>{
 let [pubKey,user] = await Promise.all([public_key(user_id),getUser(user_id)]);
 let forms = await query("SELECT q1.`id`, q1.`form_id`, q1.`data`, q1.`view`, q1.`date`,q2.form_label FROM `form_submission` q1 INNER JOIN `forms` q2 on q1.`form_id`=q2.`form_id` AND q1.owner_id=? ORDER by id DESC",[pubKey]);
  for(let i in forms){
    let d = JSON.parse(forms[i].data);
   let data= [];
    for(let i in d){
        data.push(d[i]);
    }
    forms[i].data = data;
    forms[i].firstData = data[0];
    forms[i].date = formatDate(forms[i].date);
    forms[i].secoundData = data[1];
  }
  
 res.end(ojs.get("submission.html",{user:user.fullname,forms,total_forms:forms.length}));
});

app.get("/submissions/:form_id",async(req,res)=>{
 const form_id = req.params.form_id;
 let [pubKey,user] = await Promise.all([public_key(user_id),getUser(user_id)]);
 let forms = await query("SELECT q1.`id`, q1.`form_id`, q1.`data`, q1.`view`, q1.`date`,q2.form_label FROM `form_submission` q1 INNER JOIN `forms` q2 on q1.`form_id`=q2.`form_id` AND q1.owner_id=? WHERE `q1`.`form_id`=? ORDER by id DESC",[pubKey,form_id]);
  for(let i in forms){
    let d = JSON.parse(forms[i].data);
   let data= [];
    for(let i in d){
        data.push(d[i]);
    }
    forms[i].data = data;
    forms[i].firstData = data[0];
    forms[i].date = formatDate(forms[i].date);
    forms[i].secoundData = data[1];
  }
 
 res.end(ojs.get("submission.html",{user:user.fullname,forms,total_forms:forms.length}));
});
app.get("/submissions/view/:form_uid",async(req,res)=>{
   let [pubKey,user] = await Promise.all([public_key(user_id),getUser(user_id)]);
  const form_uid= req.params.form_uid;
  let f = await query("SELECT * FROM `form_submission` WHERE id=? AND owner_id=?",[form_uid,pubKey]);
   const data = JSON.parse(f[0].data);
 let r = `<table>
  <tr>
    <th>Key</th>
    <th>Value</th>
  </tr>`;
    
for (let i in data) {
  r += `<tr>
    <td>${i}</td>
    <td>${data[i]}</td>
  </tr>`;
}

r += `</table>`;

res.end(ojs.get("view.html", { data: r ,user:user.fullname}));
});
app.get("/forms",async(req,res)=>{
    let [pubKey,user] = await Promise.all([public_key(user_id),getUser(user_id)]);
 let forms = await query("SELECT * FROM `forms` WHERE `owner_id`=?",[pubKey]);
  
 for(let i in forms){
    let ts = await query("SELECT * FROM `form_submission` WHERE `owner_id`=? AND form_id=? ",[pubKey,forms[i].form_id]);
    forms[i].last_received = formatDate(forms[i].last_active);
    forms[i].total_received = ts.length;
  }
  
  res.end(ojs.get("forms.html",{forms,user:user.fullname}));
});

app.get("/new",async (req,res)=>{
let [pubKey,user] = await Promise.all([public_key(user_id),getUser(user_id)]);
res.end(ojs.get("new.html",{user:user.fullname}));
});

app.get("/auth",(req,res)=>{
res.end(ojs.get("auth.html"));
});
app.get("/script/:form_id",(req,res)=>{
    let form_id = req.params.form_id;
    let script = `
       [...document.getElementsByTagName("form")].forEach((v)=>{
         let a = v.getAttribute("tech-service-form");
           if(a && a != ""){
             v.onsubmit = async function(e){e.preventDefault();await window.tech_service_form(v)}
           }
        });
        window.tech_service_form = async (v)=>{
            let data = Object.fromEntries(new FormData(v));
            
           let run = await fetch("https://forms.techservice.ng/api/push_form/${form_id}",{method:"POST",headers:{
          // let run = await fetch("http://localhost:3000/api/push_form/${form_id}",{method:"POST",headers:{
            "Content-Type":"application/json"
            },body:JSON.stringify(data)}).then(r=>r.json()).catch(e=>console.error(e));
            if(run.status)alert(run.data.message);
            if(run.data.redirect)setTimeout(()=>window.location=run.data.redirect,2000);
           v.reset();  
        }
    `;
    
res.end(script);
});

app.post("/signin",async(req,res)=>{
     
      let {email, password} = req.body;
      let user = await query("SELECT * FROM `users` WHERE `email`=? AND `password`=? ",[email,password]);  
      if(user.length == 0){
        let response = {
          status:false,
          data:{
            message:"Invalid email or password"
          }
        }
        res.end(JSON.stringify(response));
      }else{
        res.header("Set-Cookie",`uid=${user[0].uid}; Path=/; HttpOnly`);
       // user_id = user[0].uid;  
        let response = {
          status:true,
          data:{
            message:"Login successful",
            redirect:"/dashboard"
          }
        }
        res.end(JSON.stringify(response));
      }
});
app.post("/signup",async(req,res)=>{
      let {email, password,fullname} = req.body;
      let check = await query("SELECT * FROM `users` WHERE `email`=? ",[email]);
      if(check.length > 0){
        let response = {
          status:false,
          data:{
            message:"Email already exists"
          }
        }
        res.end(JSON.stringify(response));
      }else{
        let uid = random(20);
        let pubKey = random(30);
        await query("INSERT INTO `users`(`uid`, `email`, `password`, `fullname`, `public_key`,`date`) VALUES (?,?,?,?,?,?)",[uid,email,password,fullname,pubKey,Math.floor(Date.now()/1000)]);
        res.header("Set-Cookie",`uid=${uid}; Path=/; HttpOnly`);
       // user_id = uid;
        let response = {
          status:true,
          data:{
            message:"Signup successful",
            redirect:"/dashboard"
          }
        }
        res.end(JSON.stringify(response));
      }   
});
app.post("/new",async(req,res)=>{

     let {formName, responseMessage,redirectUrl} = req.body;
     let pubKey = await public_key(user_id);
     let form_id = random(10);
    query("INSERT INTO `forms`(`owner_id`, `form_id`, `form_label`, `last_active`, `redirect_url`, `success_message`, `date`) VALUES (?,?,?,?,?,?,?)",[pubKey,form_id,formName,Math.floor(Date.now()/1000),redirectUrl,responseMessage,Math.floor(Date.now()/1000)]);
      let response = {
        status:true,
        data:{
          message:"form created",
          redirect:"/dashboard",
        }
      }
      res.end(JSON.stringify(response));
});
app.post("/api/push_form/:form_id",async(req,res)=>{
      let [form_id,data] = [req.params.form_id,req.body];
       let pubKey;
      let getPk = await query("SELECT `owner_id` FROM `forms` WHERE `form_id`=? ",[form_id]);
      if(getPk.length > 0){
         pubKey = getPk[0].owner_id;
      }else{
         pubKey = null;
      }
      console.log(getPk[0].owner_id);
      console.log(form_id,data,pubKey);
      // let pubKey = await public_key(user_id);
      let [message,__,_] = await Promise.all([
         query("SELECT success_message,redirect_url FROM `forms` WHERE `form_id`=? ",[form_id]),
         query("INSERT INTO `form_submission`(`form_id`,`owner_id`, `data`, `date`) VALUES (?,?,?,?)",[form_id,pubKey,JSON.stringify(data),Math.floor(Date.now()/1000)]),
         query("UPDATE `forms` set `last_active`=? WHERE `form_id`=?",[Math.floor(Date.now()/1000),form_id])
      ]);
     // console.log(form_id,data);
      let response = {
        status:true,
        data:{
          message:message[0].success_message,
          redirect:message[0].redirect_url,
        }
      }
      res.end(JSON.stringify(response));
});

app.get("/test",(req,res)=>{

});

app.listen(3000,()=>console.log(`http://localhost:3000`));