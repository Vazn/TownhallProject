import { queryControler } from './fetchModule.js';

function postTextForm(type :string, callback :Function = null) {
   const form :HTMLFormElement = document.querySelector(`form[name=${type}]`);

   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formattedData = new FormData(form);
      console.log("formattedData : ", formattedData)
      const json = JSON.stringify(Object.fromEntries(formattedData));
      console.log("json : ", json)

      const answer :Object = await queryControler([type], {
         method: "POST",
         body: json,
         headers: {
            "Content-Type": "application/json"
         },
      });
      if (callback !== null) {
         callback();
      }
      eventFormFeedback(answer, type);
   });
}
function eventFormFeedback(answer, type :string) {
   const feedback :HTMLElement = document.querySelector(`#${type}Feedback`);
   
   if (answer.success) {
      feedback.style.color = "var(--green)";
      feedback.textContent = "";
      if (type === "login") {
         feedback.textContent = "Bienvenue !";   
         setTimeout(() => {
            location.replace("/index");   
         }, 500);
      } else if (type === "eventCreate") {
         feedback.textContent = "Evenement crée avec succés !";   
      }
   } else {
      feedback.style.color = "var(--red)";
      feedback.textContent = "";
      if (type === "login") {
         feedback.textContent = "Connexion échouée, ce compte n'existe pas";
      } else if (type === "eventCreate") {
         feedback.textContent = "Impossible de créer l'évenement !";   
      }
   }  
}

export { postTextForm, eventFormFeedback };