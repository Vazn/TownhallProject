var e=this&&this.__awaiter||function(e,t,s,o){function n(e){return e instanceof s?e:new s((function(t){t(e)}))}return new(s||(s=Promise))((function(s,i){function a(e){try{c(o.next(e))}catch(e){i(e)}}function l(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){e.done?s(e.value):n(e.value).then(a,l)}c((o=o.apply(e,t||[])).next())}))};import t from"express";import s from"multer";import{log as o,error as n}from"./helpers.js";import{User as i}from"./models/index.js";const a=t.Router(),l=s.diskStorage({destination:(e,t,s)=>{t.mimetype.includes("image")&&s(null,"uploads/images"),t.mimetype.includes("video")&&s(null,"uploads/videos"),t.mimetype.includes("application")&&s(null,"uploads/documents")},filename:(e,t,s)=>{const{originalname:o}=t;s(null,`${d()}-${o}`)}}),c=s({storage:l});function r(e,t){return(s,o)=>{o.render(`${e}`,{stylesheet:`${e}.css`,script:`${e}.js`,title:t,logged:s.session.authenticated})}}function d(){const e=new Date(Date.now());return("0"+e.getDate()).slice(-2)+"-"+("0"+(e.getMonth()+1)).slice(-2)+"-"+e.getFullYear()}a.post("/createArticle",c.any(),((e,t)=>{console.log(e.body)})),a.get("/getUsers",((t,s)=>e(void 0,void 0,void 0,(function*(){try{const e=yield i.find();s.json(e)}catch(e){s.json({message:e})}})))),a.post("/registerUser",((t,s)=>e(void 0,void 0,void 0,(function*(){const e=new i({email:t.body.email,password:t.body.password});try{const t=yield e.save();s.json(t)}catch(e){s.json({message:e})}})))),a.post("/login",((t,s)=>e(void 0,void 0,void 0,(function*(){const e=t.body.email.trim(),o=t.body.password.trim();if(""!==e&&""!==o)if(t.session.authenticated)s.json({success:!1});else{const n=yield i.findOne({email:e});null!==n&&n.password===o?(t.session.authenticated=!0,t.session.save(),s.status(301).json({success:!0})):s.status(403).json({success:!1})}else n("Form data are missing or empty !"),s.status(400).json({success:!1})})))),a.get("/logout",((e,t)=>{e.session.destroy((()=>{t.redirect("/")}))})),a.get("/logged",((e,t)=>{t.send(e.session)})),a.get("/admin(.html)?",r("admin","Administration")),a.get("^/$|/index(.html)?",r("index","Commune de Rouffiac d'Aude")),a.get("/login(.html)?",r("login","Connexion")),a.get("/about(.html)?",r("about","A propos")),a.get("/legal(.html)?",r("legal","Mentions légales")),a.get("/activities(.html)?",r("activities","Acitivités")),a.get("/*",r("404","Page introuvable"));export{a as router};