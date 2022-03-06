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
import multer from "multer";
import { __dirname, getDate, log, error } from "./helpers.js";
import { User, Article } from "./models/index.js";
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const root = __dirname + "/public/uploads";
        if (file.mimetype.includes("image")) {
            const path = root + "/images";
            callback(null, path);
        }
        if (file.mimetype.includes("video"))
            callback(null, root + "/videos");
        if (file.mimetype.includes("application"))
            callback(null, root + "/documents");
    },
    filename: (req, file, callback) => {
        const formattedName = getDate() + "-" + file.originalname;
        callback(null, `${formattedName}`);
    }
});
const upload = multer({
    storage: storage,
});
router.post("/createArticle", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const content = req.body.content;
    const imagePaths = [];
    for (let i = 0; i < req.files.length; i++)
        imagePaths.push(req.files[i].filename);
    try {
        yield Article.create({
            title: title,
            content: content,
            imagePaths: imagePaths
        });
        res.json({ success: true });
    }
    catch (e) {
        res.json({ success: false });
    }
}));
router.get("/getArticles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articles = yield Article.find({});
    res.json(articles);
}));
router.get("/getUsers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find();
        res.json(users);
    }
    catch (e) {
        res.json({ message: e });
    }
}));
router.post("/registerUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield User.create({
            email: req.body.email,
            password: req.body.password,
        });
        res.json(data);
    }
    catch (e) {
        res.json({ message: e });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    if (email !== "" && password !== "") {
        if (req.session.authenticated)
            res.json({ success: false });
        else {
            const existingUser = yield User.findOne({ email: email });
            if (existingUser !== null && existingUser.password === password) {
                req.session.authenticated = true;
                req.session.save();
                res.status(301).json({ success: true });
            }
            else {
                res.status(403).json({ success: false });
            }
        }
    }
    else {
        error("Form data are missing or empty !");
        res.status(400).json({ success: false });
    }
}));
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});
router.get("/logged", (req, res) => {
    res.send(req.session);
});
router.get("/admin(.html)?", renderTemplate("admin", "Administration"));
router.get("^/$|/index(.html)?", getData("articles"), renderTemplate("index", "Commune de Rouffiac d'Aude"));
router.get("/login(.html)?", renderTemplate("login", "Connexion"));
router.get("/about(.html)?", renderTemplate("about", "A propos"));
router.get("/legal(.html)?", renderTemplate("legal", "Mentions légales"));
router.get("/activities(.html)?", renderTemplate("activities", "Acitivités"));
router.get("/*", renderTemplate("404", "Page introuvable"));
function renderTemplate(page, title) {
    return (req, res) => {
        var _a;
        let data = (_a = req.data) !== null && _a !== void 0 ? _a : null;
        res.render(`${page}`, {
            stylesheet: `${page}.css`,
            script: `${page}.js`,
            title: title,
            logged: req.session.authenticated,
            data: data,
        });
    };
}
function getData(type) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (type === "articles") {
            req.data = yield Article.find({}).lean();
        }
        next();
    });
}
function authentify(req, res, next) {
    if (req.session.authenticated) {
        log("You're logged in");
        next();
    }
    else
        res.status(403).end();
}
export { router };
