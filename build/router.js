var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import formidable from "formidable";
import { connect, error } from "./helpers.js";
const router = express.Router();
connect();
router.get("^/$|/index(.html)?", (request, response) => {
    response.render("index", {
        stylesheet: "home.css",
        script: "",
        title: "Mairie de Rouffiac d'Aude",
    });
});
router.get("/login(.html)?", (request, response) => {
    response.render("login", {
        stylesheet: "login.css",
        script: "login.js",
        title: "Connexion",
    });
});
router.get("/about(.html)?", (request, response) => {
    response.render("about", {
        stylesheet: "about.css",
        script: "",
        title: "A propos",
    });
});
router.get("/legal(.html)?", (request, response) => {
    response.render("legal", {
        stylesheet: "legal.css",
        script: "",
        title: "Mentions légales",
    });
});
router.get("/activities(.html)?", (request, response) => {
    response.render("activities", {
        stylesheet: "activities.css",
        script: "",
        title: "Mentions légales",
    });
});
router.get("/*", (request, response) => {
    response.status(404).render("404", {
        stylesheet: "404.css",
        script: "",
        title: "Erreur",
    });
});
router.post("/fetchTest", (request, response) => {
    response.json({
        attribut1: 1,
        attribut2: "blaaaa",
    });
});
router.post("/login", (request, response) => {
    const form = formidable();
    form.parse(request, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            error("Unable to parse form data !");
            response.status(400).json({ sucess: false });
        }
        const { email, password } = fields;
        error({ test: 1 });
        if (typeof email === "string" && typeof password === "string") {
            if (request.session.authenticated)
                response.json(request.session);
            else {
            }
        }
        else {
            error("Form data are missing or wrong type !");
            response.status(400).json({ sucess: false });
        }
    }));
});
export { router };
