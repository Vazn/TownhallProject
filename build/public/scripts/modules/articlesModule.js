var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { queryControler } from './fetchModule.js';
const articles = document.querySelectorAll("article");
const hr = document.querySelectorAll("hr");
function buttonsHandler() {
    const gears = document.querySelectorAll(".gear");
    const trash = document.querySelectorAll(".trash");
    for (let i = 0; i < gears.length; i++) {
        const articleTitle = articles[i].childNodes[1].textContent;
        console.log("articleTitle : ", articleTitle);
        gears[i].addEventListener("click", updateEvent(articleTitle, i));
        trash[i].addEventListener("click", deleteEvent(articleTitle, i));
    }
}
function updateEvent(title, i) {
    const h2 = document.querySelector("#adminSection input[name=title]");
    return (e) => {
        e.preventDefault();
        h2.setAttribute("value", title);
        window.scroll(0, 5000);
    };
}
function deleteEvent(title, i) {
    return (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const data = yield queryControler([`deleteArticle/`, title], {
            method: "GET",
        });
        if (data.success) {
            articles[i].style.animation = "fadeOut 0.2s forwards, slideOut 3.5s forwards";
            hr[i].style.animation = "fadeOut 0.2s forwards, slideOut 3.5s forwards";
            setTimeout(() => {
                hr[i].style.display = "none";
                articles[i].style.display = "none";
            }, 1500);
        }
        else {
        }
    });
}
function articleForm() {
    var _a;
    const form = (_a = document.querySelector("#adminSection form")) !== null && _a !== void 0 ? _a : null;
    const feedback = document.querySelector("#articleCreationFeedback");
    if (form === null)
        return;
    form.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const data = yield updateArticle(form);
        console.log("data : ", data);
        if (data.success) {
            feedback.style.color = "var(--green)";
            feedback.textContent = "";
            feedback.textContent = "Article crée / modifié avec succés !";
        }
        else {
            feedback.style.color = "var(--red)";
            feedback.textContent = "";
            feedback.textContent = "Echec lors de la création / modification de l'article !";
        }
    }));
}
function updateArticle(form) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData(form);
        const data = yield queryControler(["articleCreate"], {
            method: "POST",
            body: formData,
        });
        return data;
    });
}
export { buttonsHandler, articleForm };
