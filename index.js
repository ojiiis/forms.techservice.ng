const express = require("express");
const {ojs} = require("ojs-loader");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.get("/",(req,res)=>{
res.end(ojs.get("index.html"));
});

app.get("/dashboard",(req,res)=>{
res.end(ojs.get("dashboard.html"));
});
app.get("/submissions",(req,res)=>{
res.end(ojs.get("submission.html"));
});

app.get("/forms",(req,res)=>{
res.end(ojs.get("forms.html"));
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
            console.log(data);
            let run = await fetch("https://forms.techservice.ng/api/push_form/${form_id}",{method:"POST",headers:{
            "Content-Type":"application/json"
            },body:JSON.stringify(data)}).then(r=>r.json()).catch(e=>console.error(e));
        }
    `;
res.end(script);
});
app.post("/api/push_form/:form_id",(req,res)=>{
      let {form_id,data} = req.params;
      console.log(form_id,data);
});
app.get("/test",(req,res)=>{

});

app.listen(3000);