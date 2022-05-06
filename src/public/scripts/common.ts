import { headerStyle } from "./modules/styleModules.js";
import { burgerMenu } from "./modules/responsiveModule.js";
import { articleHandler } from "./modules/articlesModule.js";

(async () => {
   articleHandler();
   headerStyle();
   burgerMenu();
})();