const express = require("express");
const {ojs} = require("ojs-loader");
const app = express();
const func = require("./func");

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.get("/",(req,res)=>{
res.end(ojs.get("index.html"));
});
let user_id = "hJk89LsjxyP67";
const getUser = async(user_id)=>{
   let user = await func.query("SELECT * FROM `users` WHERE `uid`=? ",[user_id]);
   return user[0];
}
const public_key = async(user_id)=>{
   let pubKey = await func.query("SELECT `public_key` FROM `users` WHERE `uid`=? ",[user_id]);
  return pubKey[0].public_key;
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
      func.query("SELECT (select count(*) as total from form_submission WHERE owner_id=?) AS submission, ( select count(*) as total from forms where status='active' and owner_id=? ) as active;",[pubKey,pubKey]),
      func.query("select * from form_submission where owner_id=? limit 2",[pubKey])
   ]);
   const {submission,active} = his[0];
   for(let i in forms){
     let data = JSON.parse(forms[i].data);
     forms[i].data = [];
    for(v in data){
      forms[i].data.push(data[v])
    }
   forms[i].data = forms[i].data.join(", ").slice(0,100);
    forms[i].date = func.formatDate(new Date(forms[i].date * 1000));
   }
   console.log(his,forms)
res.end(ojs.get("dashboard.html",{forms,submission,active,user:user.fullname,key:user.public_key}));
});
app.get("/submissions",async(req,res)=>{
 let [pubKey,user] = await Promise.all([public_key(user_id),getUser(user_id)]);
 let forms = await func.query("SELECT q1.`id`, q1.`form_id`, q1.`data`, q1.`view`, q1.`date`,q2.form_label FROM `form_submission` q1 INNER JOIN `forms` q2 on q1.`form_id`=q2.`form_id` AND q1.owner_id=?",[pubKey]);
  for(let i in forms){
    let d = JSON.parse(forms[i].data);
    data= [];
    for(let i in d){
        data.push(d[i]);
    }
    forms[i].data = data;
    forms[i].firstData = data[0];
    forms[i].date = func.formatDate(new Date(forms[i].date/1000));
    forms[i].secoundData = data[1];
  }
  
 res.end(ojs.get("submission.html",{user:user.fullname,forms,total_forms:forms.length}));
});

app.get("/submissions/:form_id",async(req,res)=>{
 const form_id = req.params.form_id;
 let [pubKey,user] = await Promise.all([public_key(user_id),getUser(user_id)]);
 let forms = await func.query("SELECT q1.`id`, q1.`form_id`, q1.`data`, q1.`view`, q1.`date`,q2.form_label FROM `form_submission` q1 INNER JOIN `forms` q2 on q1.`form_id`=q2.`form_id` AND q1.owner_id=? WHERE `q1`.`form_id`=?",[pubKey,form_id]);
  for(let i in forms){
    let d = JSON.parse(forms[i].data);
    data= [];
    for(let i in d){
        data.push(d[i]);
    }
    forms[i].data = data;
    forms[i].firstData = data[0];
    forms[i].date = func.formatDate(new Date(forms[i].date/1000));
    forms[i].secoundData = data[1];
  }
 
 res.end(ojs.get("submission.html",{user:user.fullname,forms,total_forms:forms.length}));
});
app.get("/submissions/view/:form_uid",async(req,res)=>{
  const form_uid= req.params.form_uid;
   res.end("");
});
app.get("/forms",async(req,res)=>{
    let [pubKey,user] = await Promise.all([public_key(user_id),getUser(user_id)]);
 let forms = await func.query("SELECT q1.`id`, q1.`owner_id`, q1.`form_id`, q1.`form_label`, q1.`last_active`,q2.total_received FROM `forms` q1 LEFT JOIN (SELECT COUNT(*) AS `total_received`,form_id FROM `form_submission` GROUP BY `form_id`) q2 on q1.form_id=q2.form_id AND q1.owner_id=?",[pubKey]);
  for(let i in forms){
    forms[i].last_received = func.formatDate(new Date(forms[i].last_active/1000));
  }
  
  res.end(ojs.get("forms.html",{forms}));
});

app.get("/new",(req,res)=>{

res.end(ojs.get("new.html"));
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
            "Content-Type":"application/json"
            },body:JSON.stringify(data)}).then(r=>r.json()).catch(e=>console.error(e));
           v.reset();  
        }
    `;
res.end(script);
});
app.post("/new",async(req,res)=>{

     let {formName, responseMessage,redirectUrl} = req.body;
     let pubKey = await public_key(user_id);
     let form_id = random(10);
    func.query("INSERT INTO `forms`(`owner_id`, `form_id`, `form_label`, `last_active`, `redirect_url`, `success_message`, `date`) VALUES (?,?,?,?,?,?,?)",[pubKey,form_id,formName,Math.floor(Date.now()/100),redirectUrl,responseMessage,Math.floor(Date.now()/100)])
      let response = {
        status:true,
        data:{
          message:"form created",
          redirect:redirectUrl,
        }
      }
      res.end(JSON.stringify(response));
});
app.post("/api/push_form/:form_id",async(req,res)=>{
      let [form_id,data] = [req.params.form_id,req.body];
      let [message,query,_] = await Promise.all([
         func.query("SELECT success_message,redirect_url FROM `forms` WHERE `form_id`=? ",[form_id]),
         func.query("INSERT INTO `form_submission`(`form_id`, `data`, `date`) VALUES (?,?,?)",[form_id,JSON.stringify(data),Math.floor(Date.now()/100)]),
         func.query("UPDATE `forms` set `last_active`=?",[Math.floor(Date.now()/1000)])
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

app.listen(3000);