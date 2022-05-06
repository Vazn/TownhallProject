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
import anime from '../node_modules/animejs/lib/anime.es.js';
export function articleHandler() {
    if (window.location.pathname.slice(1) === "calendrier") {
        return;
    }
    let articlesCategory;
    if (window.location.pathname.slice(1) === "" || window.location.pathname.slice(1) === "index") {
        articlesCategory = "actualites";
    }
    else {
        articlesCategory = window.location.pathname.slice(1);
    }
    buttonsHandler();
    articleForm(articlesCategory);
}
;
function articleModals() {
    const titles = document.querySelectorAll(".card h3");
    const images = document.querySelectorAll(".card .picture");
    const paragraphs = document.querySelectorAll(".card pre");
    const modal = document.querySelector(".modal");
    const modalContent = document.querySelector(".modalContent");
    for (let i = 0; i < titles.length; i++) {
        titles[i].addEventListener("click", () => {
            modalContent.innerHTML = "";
            const [image, text] = [
                images[i].getAttribute("src"),
                paragraphs[i].textContent
            ];
            const separatorElement = document.createElement("hr");
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
        });
    }
    window.addEventListener("mousedown", (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
        }
    });
}
function buttonsHandler() {
    const gears = document.querySelectorAll(".gear");
    const trash = document.querySelectorAll(".trash");
    for (let i = 0; i < gears.length; i++) {
        const articleTitle = document.querySelectorAll("article h3")[i].textContent;
        const articleContent = document.querySelectorAll("article pre")[i].textContent;
        gears[i].addEventListener("click", updateEventHandler(articleTitle, articleContent));
        if (trash[i] !== undefined) {
            trash[i].addEventListener("click", deleteEventHandler(articleTitle, i));
        }
    }
}
function updateEventHandler(title, content) {
    const h2 = document.querySelector("#adminSection input[name=title]");
    const textarea = document.querySelector("#adminSection textarea");
    return (e) => {
        e.preventDefault();
        h2.setAttribute("value", title);
        textarea.textContent = content;
        window.scroll(0, 5000);
    };
}
function deleteEventHandler(title, i) {
    return (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const articles = document.querySelectorAll("article");
        const data = yield queryControler([`deleteArticle/`, title], {
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
        }
        else {
            alert("Un problême est survenu sur le serveur, suppression impossible !");
        }
    });
}
function articleForm(category) {
    var _a;
    const form = (_a = document.querySelector("#adminSection form")) !== null && _a !== void 0 ? _a : null;
    const feedback = document.querySelector("#articleCreationFeedback");
    if (form === null)
        return;
    form.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const data = yield updateArticle(form, category);
        const operationType = data.type;
        if (data.success) {
            feedback.style.color = "var(--green)";
            feedback.textContent = "";
            feedback.textContent = `${operationType} réussie !`;
        }
        else {
            feedback.style.color = "var(--red)";
            feedback.textContent = "";
            feedback.textContent = `Impossible de contacter le serveur ou la base de donnée !`;
        }
    }));
}
function updateArticle(form, category) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData(form);
        const data = yield queryControler([`articleUpdate/${category}`], {
            method: "POST",
            body: formData,
        });
        return data;
    });
}
export { buttonsHandler, articleForm, articleModals };
