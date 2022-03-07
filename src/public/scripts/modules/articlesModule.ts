import { queryControler } from './fetchModule.js';

const articles :NodeListOf<HTMLElement> = document.querySelectorAll("article");
const hr :NodeListOf<HTMLElement> = document.querySelectorAll("hr");

function buttonsHandler() {
   const gears :NodeListOf<HTMLElement> = document.querySelectorAll(".gear");
   const trash :NodeListOf<HTMLElement> = document.querySelectorAll(".trash");
   
   for (let i=0 ; i<gears.length ; i++) {
      const articleTitle :string =  articles[i].childNodes[1].textContent;
      console.log("articleTitle : ", articleTitle)
      gears[i].addEventListener("click", updateEvent(articleTitle, i));
      trash[i].addEventListener("click", deleteEvent(articleTitle, i));
   }
}
function updateEvent(title :string, i :number) {
   const h2 :HTMLElement = document.querySelector("#adminSection input[name=title]");

   return (e :Event) => {
      e.preventDefault();
      h2.setAttribute("value", title);
      window.scroll(0, 5000);
   }
}
function deleteEvent(title :string, i :number) {
   return async (e :Event) => {
      e.preventDefault();
      
      const data = await queryControler([`deleteArticle/`, title], {
         method: "GET",
      });
      if (data.success) {
         articles[i].style.animation = "fadeOut 0.2s forwards, slideOut 3.5s forwards";
         hr[i].style.animation = "fadeOut 0.2s forwards, slideOut 3.5s forwards";   
         setTimeout(() => {
            hr[i].style.display = "none";
            articles[i].style.display = "none";
         }, 1500);
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
   const data = await queryControler(["articleCreate"], {
      method: "POST",
      body: formData,
   });

   return data;
}

export { buttonsHandler, articleForm };