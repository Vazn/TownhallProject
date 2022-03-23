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
import { User, Article, Event } from "./models/index.js";
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
router.get("/deleteArticle/:title", authentify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Article.deleteOne({ title: req.params.title });
    res.json({ success: true });
}));
router.post("/articleCreate", authentify, upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const imagePaths = [];
    const result = yield Article.findOne({ title: title });
    if (result !== null) {
        res.json({ success: false });
    }
    else {
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
    }
}));
router.post("/eventCreate", authentify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, type, description, start, end } = req.body;
    try {
        yield Event.create({
            title: title,
            type: type,
            description: description,
            start: start,
            end: end,
        });
        res.json({ success: true });
    }
    catch (e) {
        console.log("e : ", e);
        res.json({ success: false });
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
router.get("/getEvents", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Event.find({}).lean();
    res.json(data);
}));
router.get("^/$|/index(.html)?", getData("articles", 8), renderTemplate("index", "Commune de Rouffiac d'Aude"));
router.get("/news(.html)?", getData("articles", 0), renderTemplate("news", "Actualités"));
router.get("/calendrier(.html)?", renderTemplate("calendrier", "Agenda et activités"));
router.get("/ecole(.html)?", renderTemplate("ecole", "Ecole"));
router.get("/associations(.html)?", renderTemplate("associations", "Associations"));
router.get("/mediatheque(.html)?", renderTemplate("mediatheque", "Médiatheque"));
router.get("/maisonMedicale(.html)?", renderTemplate("maisonMedicale", "Maison Médicale"));
router.get("/urbanisme(.html)?", renderTemplate("urbanisme", "Urbanisme"));
router.get("/etatCivil(.html)?", renderTemplate("etatCivil", "Etat Civil"));
router.get("/transport(.html)?", renderTemplate("transport", "Transports"));
router.get("/seniors(.html)?", renderTemplate("seniors", "Séniors"));
router.get("/actionSociale(.html)?", renderTemplate("actionSociale", "Action Sociale"));
router.get("/communication(.html)?", renderTemplate("communication", "Communication"));
router.get("/travaux(.html)?", renderTemplate("travaux", "Travaux"));
router.get("/finances(.html)?", renderTemplate("finances", "Finances"));
router.get("/entreprises(.html)?", renderTemplate("entreprises", "Entreprises"));
router.get("/login(.html)?", renderTemplate("login", "Connexion"));
router.get("/legal(.html)?", renderTemplate("legal", "Mentions légales"));
router.get("/*", renderTemplate("404", "Page introuvable"));
function renderTemplate(page, title, scripts = [], styles = []) {
    return (req, res) => {
        var _a;
        let data = (_a = req.data) !== null && _a !== void 0 ? _a : null;
        res.render(`${page}`, {
            page: page,
            title: title,
            logged: req.session.authenticated,
            data: data,
        });
    };
}
function getData(type, limit) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (type === "articles") {
            const data = yield Article.find({}).limit(limit).lean();
            for (let obj of data) {
                obj.title = obj.title.replace(/_/g, ' ');
            }
            req.data = data;
        }
        next();
    });
}
function authentify(req, res, next) {
    if (req.session.authenticated) {
        log("Authentication : OK");
        next();
    }
    else {
        error("Acces denied");
        res.status(403).end();
    }
}
export { router };
