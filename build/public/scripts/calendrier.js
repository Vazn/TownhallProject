var e=this&&this.__awaiter||function(e,t,n,o){function i(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,r){function a(e){try{c(o.next(e))}catch(e){r(e)}}function l(e){try{c(o.throw(e))}catch(e){r(e)}}function c(e){e.done?n(e.value):i(e.value).then(a,l)}c((o=o.apply(e,t||[])).next())}))};import{postTextForm as t}from"./modules/formModules.js";import{FullCalendar as n}from"./node_modules/fullcalendar/main.js";function o(){return e(this,void 0,void 0,(function*(){n.globalLocales.push({code:"fr",week:{dow:1,doy:4},buttonText:{prev:"Précédent",next:"Suivant",today:"Aujourd'hui",year:"Année",month:"Mois",week:"Semaine",day:"Jour",list:"Planning"},weekText:"Sem.",allDayText:"Toute la journée",moreLinkText:"en plus",noEventsText:"Aucun événement à afficher"});const e=document.getElementById("calendar"),t=new n.Calendar(e,{locale:"fr",initialView:"dayGridMonth",initialDate:new Date(Date.now()),eventSources:[{url:"/getEvents"}],events:[],eventColor:"#FAE790",eventTextColor:"#3f3f3f",eventMouseEnter:()=>{document.body.style.cursor="pointer"},eventMouseLeave:()=>{document.body.style.cursor="default"},eventClick:e=>{const t=document.querySelector(".modal"),n=document.querySelector(".modalContent"),o=e.event.title,i=e.event.extendedProps.description;n.innerHTML="";const r=document.createElement("h3");r.textContent=o;const a=document.createElement("hr");a.setAttribute("class","littleHr"),a.style.margin="1% 0 1% 0";const l=document.createElement("p");l.textContent=i,n.append(r),n.append(a),n.append(l),t.style.visibility="visible",t.style.opacity="100",window.addEventListener("mousedown",(e=>{e.target===t&&(t.style.opacity="0",t.style.visibility="hidden")}))}});return t.render(),t}))}e(void 0,void 0,void 0,(function*(){const e=yield o();t("eventCreate",(()=>e.refetchEvents()))}));