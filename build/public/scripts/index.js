var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { buttonsHandler, articleForm, articleModals } from "./modules/articlesModule.js";
import Splide from './node_modules/@splidejs/splide/dist/js/splide.js';
(() => __awaiter(void 0, void 0, void 0, function* () {
    slideHandler();
    buttonsHandler();
    articleForm();
    articleModals();
}))();
function slideHandler() {
    new Splide('.splide', {
        type: "slide",
        perPage: 4,
        autoWidth: true,
        gap: '1rem',
        perMove: 1,
        speed: 600,
        rewindSpeed: 800,
        rewind: true,
        breakpoints: {
            850: {
                perPage: 2,
            },
        }
    }).mount();
}
