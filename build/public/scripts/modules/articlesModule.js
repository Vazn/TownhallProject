var t=this&&this.__awaiter||function(t,e,n,o){function c(t){return t instanceof n?t:new n((function(e){e(t)}))}return new(n||(n=Promise))((function(n,r){function i(t){try{u(o.next(t))}catch(t){r(t)}}function l(t){try{u(o.throw(t))}catch(t){r(t)}}function u(t){t.done?n(t.value):c(t.value).then(i,l)}u((o=o.apply(t,e||[])).next())}))};import{queryControler as e}from"./fetchModule.js";function n(){const t=document.querySelectorAll(".gear"),e=document.querySelectorAll(".trash"),n=document.querySelectorAll("article");for(let r=0;r<t.length;r++){const i=n[r].childNodes[1].textContent;t[r].addEventListener("click",o(i)),e[r].addEventListener("click",c(i))}}function o(t){const e=document.querySelector("#adminSection input[name=title]");return n=>{n.preventDefault(),e.setAttribute("value",t),window.scroll(0,5e3)}}function c(n){return o=>t(this,void 0,void 0,(function*(){o.preventDefault();(yield e(`/deleteArticle/${n}`,{method:"GET"})).success}))}function r(){var e;const n=null!==(e=document.querySelector("#adminSection form"))&&void 0!==e?e:null,o=document.querySelector("#articleCreationFeedback");null!==n&&n.addEventListener("submit",(e=>t(this,void 0,void 0,(function*(){e.preventDefault();(yield i(n)).success?(o.style.color="var(--green)",o.textContent="",o.textContent="Article crée / modifié avec succés !"):(o.style.color="var(--red)",o.textContent="",o.textContent="Echec lors de la création / modification de l'article !")}))))}function i(n){return t(this,void 0,void 0,(function*(){const t=new FormData(n);return yield e("createArticle",{method:"POST",body:t})}))}export{n as buttonsHandler,r as articleForm};