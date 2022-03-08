import { queryControler } from './fetchModule.js';
import anime from '../node_modules/animejs/lib/anime.es.js';

const articles :NodeListOf<HTMLElement> = document.querySelectorAll(".card");

function articleModals() {
   const titles :NodeListOf<HTMLElement> = document.querySelectorAll(".card h3");
   
   const images :NodeListOf<HTMLElement> = document.querySelectorAll(".card .picture");
   const paragraphs :NodeListOf<HTMLElement> = document.querySelectorAll(".card p");
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
         separatorElement.style.margin = "4% 0 3% 0";
         const imageElement = document.createElement("img");
         imageElement.setAttribute("src", image);
         const paragraphElement = document.createElement("p");
         paragraphElement.textContent = text;

         modalContent.append(imageElement);
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
      const articleTitle :string = document.querySelectorAll(".card h3")[i].textContent;
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
      let duration = 800;
      let timeline = anime.timeline({
         easing: 'easeOutQuad',
         duration: duration,
         targets: articles[i],
      });
      if (data.success) {
         timeline.add({
            opacity: 0.2,
         }).add({
            translateY: "-400",
            // rotateY: "180deg",
         }, `-=${duration}`);
         setTimeout(() => {
            articles[i].style.display = "none";
         }, duration - 300);
      } else {
         alert("Un problême est survenu sur le serveur, suppression impossible !");
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
   console.log("formData : ", formData)
   const data = await queryControler(["articleCreate"], {
      method: "POST",
      body: formData,
   });

   return data;
}

export { buttonsHandler, articleForm, articleModals };