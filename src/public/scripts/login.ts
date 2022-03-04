import { URLSearchParams } from 'url';
import { queryControler } from './modules/fetchModule.js';

(async () => {

   loginForm();

})();

function loginForm() {
   const form :HTMLFormElement = document.querySelector("form[name=loginForm]");

   form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formattedData = new FormData(form);

      const answer = await queryControler("login", formattedData);
      return answer;
   });  
}