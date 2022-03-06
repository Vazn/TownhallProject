import { queryControler } from './fetchModule.js';

function buttonsHandler() {
   const gears :NodeListOf<HTMLElement> = document.querySelectorAll(".gear");
   const trash :NodeListOf<HTMLElement> = document.querySelectorAll(".trash");
   const articles :NodeListOf<HTMLElement> = document.querySelectorAll("article");
   
   for (let i=0 ; i<gears.length ; i++) {
      const articleTitle :string =  articles[i].childNodes[1].textContent;
      gears[i].addEventListener("click", updateEvent(articleTitle));
      trash[i].addEventListener("click", deleteEvent(articleTitle));
   }
}
function updateEvent(title :string) {
   const h2 :HTMLElement = document.querySelector("#adminSection input[name=title]");

   return (e :Event) => {
      e.preventDefault();
      h2.setAttribute("value", title);
      window.scroll(0, 5000);
   }
}
function deleteEvent(title :string) {
   return async (e :Event) => {
      e.preventDefault();
      
      const data = await queryControler(`/deleteArticle/${title}`, {
         method: "GET",
      });
      if (data.success) {
         
      } else {

      }
   }
}

function articleForm() {
   const form :HTMLFormElement = document.querySelector("#adminSection form") ?? null;
   const feedback :HTMLElement= document.querySelector("#articleCreationFeedback");

   if (form === null) return;
   form.addEventListener("submit", async (e) => {
      e.preventDefault();

      //== Quand un admin crée un article avec un titre qui existe déja => modifie l'article existant
      const data = await updateArticle(form);
      console.log("data : ", data);

      if (data.success) {
         feedback.style.color = "var(--green)";
         feedback.textContent = "";
         feedback.textContent = "Article crée / modifié avec succés !";
      } else {
         feedback.style.color = "var(--red)";
         feedback.textContent = "";
         feedback.textContent = "Echec lors de la création / modification de l'article !";
      }
   });
}

async function updateArticle(form :HTMLFormElement) :Promise<any> {
   const formData  = new FormData(form);
   const data = await queryControler("createArticle", {
      method: "POST",
      body: formData,
   });

   return data;
}

export { buttonsHandler, articleForm };