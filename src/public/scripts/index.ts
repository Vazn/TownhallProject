import { articleModals } from "./modules/articlesModule.js";
import Splide from './node_modules/@splidejs/splide/dist/js/splide.js';

(async () => {
   slideHandler();
   articleModals();
})();

function slideHandler() {
   new Splide( '.splide', {
      type: "slide",
      padding: { left: 30, right: 30 },
      perPage: 4,
      fixedWidth : '300px',
      fixedHeight: '320px',
      gap: '1rem',
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