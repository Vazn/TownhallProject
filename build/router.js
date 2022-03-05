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
router.get("^/$|/index(.html)?", renderTemplate("index", "Commune de Rouffiac d'Aude"));
router.get("/login(.html)?", renderTemplate("login", "Connexion"));
router.get("/about(.html)?", renderTemplate("about", "A propos"));
router.get("/legal(.html)?", renderTemplate("legal", "Mentions légales"));
router.get("/activities(.html)?", renderTemplate("activities", "Acitivités"));
router.get("/admin(.html)?", authentify, renderTemplate("admin", "Administration"));
router.get("/*", renderTemplate("404", "Page introuvable"));
function renderTemplate(page, title) {
    return (req, res) => {
        res.render(`${page}`, {
            stylesheet: `${page}.css`,
            script: `${page}.js`,
            title: title,
            logged: req.session.authenticated
        });
    };
}
function authentify(request, response, next) {
    if (request.session.authenticated)
        next();
    else
        response.status(403).end();
}
export { router };
