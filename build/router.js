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
import { error } from "./helpers.js";
import { User } from "./models/index.js";
const router = express.Router();
router.get("/getUsers", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find();
        response.json(users);
    }
    catch (e) {
        response.json({ message: e });
    }
}));
router.post("/registerUser", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User({
        email: request.body.email,
        password: request.body.password,
    });
    try {
        const data = yield user.save();
        response.json(data);
    }
    catch (e) {
        response.json({ message: e });
    }
}));
router.post("/login", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const email = request.body.email.trim();
    const password = request.body.password.trim();
    if (email !== "" && password !== "") {
        if (request.session.authenticated)
            response.json({ success: false });
        else {
            const existingUser = yield User.findOne({ email: email });
            if (existingUser !== null && existingUser.password === password) {
                request.session.authenticated = true;
                request.session.email = email;
                request.session.save();
                response.status(301).json({ success: true });
            }
            else {
                response.status(403).json({ success: false });
            }
        }
    }
    else {
        error("Form data are missing or empty !");
        response.status(400).json({ success: false });
    }
}));
router.get("/logout", (request, response) => {
    request.session.destroy(() => {
        response.redirect("/");
    });
});
router.get("/logged", (request, response) => {
    response.send(request.session);
});
router.get("^/$|/index(.html)?", (request, response) => {
    response.render("index", {
        stylesheet: "index.css",
        script: "",
        title: "Mairie de Rouffiac d'Aude",
        logged: request.session.authenticated
    });
});
router.get("/login(.html)?", (request, response) => {
    response.render("login", {
        stylesheet: "login.css",
        script: "login.js",
        title: "Connexion",
        logged: request.session.authenticated
    });
});
router.get("/about(.html)?", (request, response) => {
    response.render("about", {
        stylesheet: "about.css",
        script: "",
        title: "A propos",
        logged: request.session.authenticated
    });
});
router.get("/legal(.html)?", (request, response) => {
    response.render("legal", {
        stylesheet: "legal.css",
        script: "",
        title: "Mentions légales",
        logged: request.session.authenticated
    });
});
router.get("/activities(.html)?", (request, response) => {
    response.render("activities", {
        stylesheet: "activities.css",
        script: "activities.js",
        title: "Activités",
        logged: request.session.authenticated
    });
});
router.get("/admin(.html)?", (request, response) => {
    if (request.session.authenticated) {
        response.render("admin", {
            stylesheet: "admin.css",
            script: "admin.js",
            title: "Administation",
            logged: request.session.authenticated
        });
    }
    else {
        response.status(403).end();
    }
});
router.get("/*", (request, response) => {
    response.status(404).render("404", {
        stylesheet: "404.css",
        script: "",
        title: "Page introuvable",
        logged: request.session.authenticated
    });
});
export { router };
