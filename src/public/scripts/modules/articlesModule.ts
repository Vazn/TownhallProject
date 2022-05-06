import { queryControler } from './fetchModule.js';
import anime from '../node_modules/animejs/lib/anime.es.js';

export function articleHandler() {
   if (window.location.pathname.slice(1) === "calendrier") {
      return;
   }
   
   /* Categorie des articles d'une page = chemin de la page - le "/" */
   let articlesCategory;
   if (window.location.pathname.slice(1) === "" || window.location.pathname.slice(1) === "index") {
      articlesCategory = "actualites";
   } else {
      articlesCategory = window.location.pathname.slice(1);
   }

   buttonsHandler();
   articleForm(articlesCategory);
};

function articleModals() {
   const titles :NodeListOf<HTMLElement> = document.querySelectorAll(".card h3");
   
   const images :NodeListOf<HTMLElement> = document.querySelectorAll(".card .picture");
   const paragraphs :NodeListOf<HTMLElement> = document.querySelectorAll(".card pre");
	const modal :HTMLElement = document.querySelector(".modal");
   const modalContent :HTMLElement = document.querySelector(".modalContent");
   
	for (let i=0 ; i<titles.length ; i++) {
      titles[i].addEventListener("click", () => {
         modalContent.innerHTML = "";
         const [image, text] = [
            images[i].getAttribute("src"), 
            paragraphs[i].textContent
         ];

         const separatorElement = document.createElement("hr"); /* littleHr */
         separatorElement.setAttribute("class", "littleHr");
         separatorElement.style.margin = "1% 0 1% 0";
         const titleElement = document.createElement("h3");
         titleElement.textContent = titles[i].textContent;
         const paragraphElement = document.createElement("p");
         paragraphElement.textContent = text;

         modalContent.append(titleElement);
         modalContent.append(separatorElement);
         modalContent.append(paragraphElement);

			modal.style.visibility = "visible";
			modal.style.opacity = "100";
		})
	}
	
	window.addEventListener("mousedown", (e) => {					
      if (e.target === modal) {
         modal.style.opacity = '0';
         modal.style.visibility = 'hidden';
      }
	})
}
function buttonsHandler() {
   const gears :NodeListOf<HTMLElement> = document.querySelectorAll(".gear");
   const trash :NodeListOf<HTMLElement> = document.querySelectorAll(".trash");
   
   for (let i=0 ; i<gears.length ; i++) {
      const articleTitle :string = document.querySelectorAll("article h3")[i].textContent;
      const articleContent :string = document.querySelectorAll("article pre")[i].textContent;
      gears[i].addEventListener("click", updateEventHandler(articleTitle, articleContent));
      if (trash[i] !== undefined) {
         trash[i].addEventListener("click", deleteEventHandler(articleTitle, i));
      }
   }
}
function updateEventHandler(title :string, content :string) {
   const h2 :HTMLElement = document.querySelector("#adminSection input[name=title]");
   const textarea :HTMLElement = document.querySelector("#adminSection textarea");

   return (e :Event) => {
      e.preventDefault();
      
      h2.setAttribute("value", title);
      textarea.textContent = content;
      window.scroll(0, 5000);
   }
}
function deleteEventHandler(title :string, i :number) {
   return async (e :Event) => {
      e.preventDefault();
      const articles :NodeListOf<HTMLElement> = document.querySelectorAll("article");
      const data = await queryControler([`deleteArticle/`, title], {
         method: "GET",
      });
      let duration = 800;
      let timeline = anime.timeline({
         easing: 'easeOutQuad',
         duration: duration,
         targets: articles[i],
      });
      if (data.success) {
         timeline.add({
            opacity: 0,
         });
         setTimeout(() => {
            articles[i].style.display = "none";
         }, duration + 100);
      } else {
         alert("Un problême est survenu sur le serveur, suppression impossible !");
      }
   }
}
function articleForm(category :string) {
   const form :HTMLFormElement = document.querySelector("#adminSection form") ?? null;
   const feedback :HTMLElement= document.querySelector("#articleCreationFeedback");

   if (form === null) return;
   form.addEventListener("submit", async (e) => {
      e.preventDefault();

      //== Quand un admin crée un article avec un titre qui existe déja => modifie l'article existant
      const data = await updateArticle(form, category);

      const operationType = data.type;
      if (data.success) {
         feedback.style.color = "var(--green)";
         feedback.textContent = "";
         feedback.textContent = `${operationType} réussie !`;
      } else {
         feedback.style.color = "var(--red)";
         feedback.textContent = "";
         feedback.textContent = `Impossible de contacter le serveur ou la base de donnée !`;
      }
   });
}
async function updateArticle(form :HTMLFormElement, category :string) :Promise<any> {

   const formData  = new FormData(form);
   const data = await queryControler([`articleUpdate/${category}`], {
      method: "POST",
      body: formData,
   });

   return data;
}

export { buttonsHandler, articleForm, articleModals };