import { buttonsHandler, articleForm, articleModals } from "./modules/articlesModule.js";
import Splide from './node_modules/@splidejs/splide/dist/js/splide.js';

(async () => {
   slideHandler();

   buttonsHandler();
   articleForm();
   articleModals();
})();

function slideHandler() {
   new Splide( '.splide', {
      type: "slide",
      perPage: 4,
      fixedWidth : '300px',
      fixedHeight: '320px',
      gap: '1rem',
      padding: '1rem',
      perMove: 1,
      speed: 600,
      rewindSpeed: 800,
      rewind : true,

      breakpoints: {
         850: {
            perPage: 2,
         },
      }
   }).mount();
}