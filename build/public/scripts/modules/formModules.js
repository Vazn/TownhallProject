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
function postTextForm(type, callback = null) {
    const form = document.querySelector(`form[name=${type}]`);
    form.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const formattedData = new FormData(form);
        const json = JSON.stringify(Object.fromEntries(formattedData));
        console.log("json : ", json);
        const answer = yield queryControler([type], {
            method: "POST",
            body: json,
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (callback !== null) {
            callback();
        }
        eventFormFeedback(answer, type);
    }));
}
function eventFormFeedback(answer, type) {
    const feedback = document.querySelector(`#${type}Feedback`);
    if (answer.success) {
        feedback.style.color = "var(--green)";
        feedback.textContent = "";
        if (type === "login") {
            feedback.textContent = "Bienvenue !";
            setTimeout(() => {
                location.replace("/index");
            }, 500);
        }
        else if (type === "eventCreate") {
            feedback.textContent = "Evenement crée avec succés !";
        }
    }
    else {
        feedback.style.color = "var(--red)";
        feedback.textContent = "";
        if (type === "login") {
            feedback.textContent = "Connexion échouée, ce compte n'existe pas";
        }
        else if (type === "eventCreate") {
            feedback.textContent = "Impossible de créer l'évenement !";
        }
    }
}
export { postTextForm, eventFormFeedback };
