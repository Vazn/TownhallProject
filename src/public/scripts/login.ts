import { URLSearchParams } from 'url';
import { queryControler } from './modules/fetchModule.js';

(async () => {

   loginForm();

})();

function loginForm() {
   const form :HTMLFormElement = document.querySelector("form[name=loginForm]");
   const main :HTMLElement = document.querySelector("main");
   const feedback :HTMLElement = document.querySelector("#loginFeedback");

   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formattedData = new FormData(form);
      const json = JSON.stringify(Object.fromEntries(formattedData));

      const answer = await queryControler("login", {
         method: "POST",
         body: json,
         headers: {
            "Content-Type": "application/json"
         },
      });

      if (answer.success) {
         feedback.style.color = "var(--green)";
         feedback.textContent = "";
         feedback.textContent = "Bienvenue !";   
         setTimeout(() => {
            location.replace("/index");   
         }, 500);
      } else {
         feedback.style.color = "var(--red)";
         feedback.textContent = "";
         feedback.textContent = "Connexion échouée, ce compte n'existe pas";
      }
      return answer;
   });  
}