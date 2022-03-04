import express from "express";
export { router };
const router = express.Router();
router.get("^/$|/index(.html)?", (request, response) => {
    response.render("index", {
        stylesheet: "home.css",
        scripts: "",
        title: "Mairie de Rouffiac d'Aude",
    });
});
router.get("/login(.html)?", (request, response) => {
    response.render("login", {
        stylesheet: "login.css",
        scripts: "",
        title: "Connexion",
    });
});
router.get("/about(.html)?", (request, response) => {
    response.render("about", {
        stylesheet: "about.css",
        scripts: "",
        title: "A propos",
    });
});
router.get("/legal(.html)?", (request, response) => {
    response.render("legal", {
        stylesheet: "legal.css",
        scripts: "",
        title: "Mentions légales",
    });
});
router.get("/activities(.html)?", (request, response) => {
    response.render("activities", {
        stylesheet: "activities.css",
        scripts: "",
        title: "Mentions légales",
    });
});
router.get("/*", (request, response) => {
    response.status(404).render("404", {
        stylesheet: "404.css",
        scripts: "",
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
    const { login, password } = request.body;
    console.log("login : ", login);
    if (login && password) {
        if (request.session.authenticated) {
            response.json(request.session);
        }
        else {
            if (password === "123") {
                request.session.authenticated = true;
                request.session.user = {
                    pseudo: login,
                    password: password,
                };
                response.status(200).json(request.session);
            }
            else {
                response.status(403).json({ msg: `Bad credentials` });
            }
        }
    }
    else {
        response.status(403).json({ msg: `Bad credentials` });
    }
});
