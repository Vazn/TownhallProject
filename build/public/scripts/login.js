var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { queryControler } from './modules/fetchModule.js';
(() => __awaiter(void 0, void 0, void 0, function* () {
    loginForm();
}))();
function loginForm() {
    const form = document.querySelector("form[name=loginForm]");
    const main = document.querySelector("main");
    const feedback = document.querySelector("#loginFeedback");
    form.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const formattedData = new FormData(form);
        const json = JSON.stringify(Object.fromEntries(formattedData));
        const answer = yield queryControler("login", {
            method: "POST",
            body: json,
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (answer.success) {
            feedback.style.color = "var(--green)";
            feedback.textContent = "";
            feedback.textContent = "Bienvenue !";
            setTimeout(() => {
                location.replace("/index");
            }, 500);
        }
        else {
            feedback.style.color = "var(--red)";
            feedback.textContent = "";
            feedback.textContent = "Connexion échouée, ce compte n'existe pas";
        }
        return answer;
    }));
}
