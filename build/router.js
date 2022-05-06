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
import { __dirname, getDate, formatTitles, log, error } from "./helpers.js";
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
router.post("/articleUpdate/:category", upload.any(), authentify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = formatTitles(req.body.title);
    const content = req.body.content;
    const result = yield Article.findOne({ title: title });
    const imagePaths = [];
    const docPaths = [];
    let thumbnail;
    if (req.files !== undefined) {
        for (let i = 0; i < req.files.length; i++) {
            if (req.files[i].fieldname === "documents") {
                docPaths.push(req.files[i].filename);
            }
            else if (req.files[i].fieldname === "images") {
                imagePaths.push(req.files[i].filename);
            }
            else if (req.files[i].fieldname === "thumbnail") {
                thumbnail = req.files[i].filename;
            }
        }
    }
    if (result === null) {
        try {
            yield Article.create({
                title: title,
                content: content,
                images: {
                    empty: imagePaths.length === 0,
                    imagesPaths: imagePaths,
                },
                documents: {
                    empty: docPaths.length === 0,
                    docPaths: docPaths,
                },
                thumbnail: thumbnail,
                category: req.params.category,
            });
            res.json({
                type: "Creation",
                success: true,
            });
        }
        catch (e) {
            res.json({
                type: "Creation",
                success: false,
            });
        }
    }
    else {
        try {
            yield Article.updateOne({ title: title }, {
                $set: {
                    content: content,
                    images: {
                        empty: imagePaths.length === 0,
                        imagesPaths: imagePaths,
                    },
                    documents: {
                        empty: docPaths.length === 0,
                        docPaths: docPaths,
                    },
                    thumbnail: thumbnail,
                }
            });
            res.json({
                type: "Modification",
                success: true
            });
        }
        catch (e) {
            res.json({
                type: "Modification",
                success: false,
            });
        }
    }
}));
router.post("/eventCreate", authentify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, description, start, end } = req.body;
    console.log("start : ", start);
    const title = formatTitles(req.body.title);
    const result = yield Event.findOne({ title: title });
    if (result === null) {
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
    }
    else {
        try {
            yield Event.updateOne({ title: title }, {
                $set: {
                    title: title,
                    type: type,
                    description: description,
                    start: start,
                    end: end,
                }
            });
            res.json({
                type: "Modification",
                success: true
            });
        }
        catch (e) {
            res.json({
                type: "Modification",
                success: false,
            });
        }
    }
}));
router.get("/deleteEvent/:title", authentify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Event.deleteOne({ title: req.params.title });
    res.json({ success: true });
}));
router.get("/getEvents", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Event.find({}).lean();
    res.json(data);
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
router.get("^/$|/index(.html)?", getData(["actualites", "informations"], 8), renderTemplate("index", "Commune de Rouffiac d'Aude"));
router.get("/actualites(.html)?", getData(["actualites"], 0), renderTemplate("actualites", "Actualités"));
router.get("/calendrier(.html)?", renderTemplate("calendrier", "Agenda et activités"));
router.get("/ecole(.html)?", getData(["ecole"], 0), renderTemplate("articlesLayout", "Ecole"));
router.get("/associations(.html)?", getData(["associations"], 0), renderTemplate("articlesLayout", "Associations"));
router.get("/mediatheque(.html)?", getData(["mediatheque"], 0), renderTemplate("articlesLayout", "Médiatheque"));
router.get("/transport(.html)?", getData(["transport"], 0), renderTemplate("articlesLayout", "Transports"));
router.get("/entreprises(.html)?", getData(["entreprises"], 0), renderTemplate("articlesLayout", "Entreprises"));
router.get("/urbanisme(.html)?", getData(["urbanisme"], 0), renderTemplate("articlesLayout", "Urbanisme"));
router.get("/etatCivil(.html)?", getData(["etatCivil"], 0), renderTemplate("articlesLayout", "Etat Civil"));
router.get("/scolarite(.html)?", getData(["scolarite"], 0), renderTemplate("articlesLayout", "Scolarité"));
router.get("/risques(.html)?", getData(["risques"], 0), renderTemplate("articlesLayout", "Risques"));
router.get("/leVillage(.html)?", getData(["leVillage"], 0), renderTemplate("articlesLayout", "Le village"));
router.get("/lesElus(.html)?", getData(["lesElus"], 0), renderTemplate("articlesLayout", "Les Elus"));
router.get("/lesCommissions(.html)?", getData(["]lesCommissions"], 0), renderTemplate("articlesLayout", "Les Commissions"));
router.get("/login(.html)?", renderTemplate("login", "Connexion"));
router.get("/legal(.html)?", renderTemplate("legal", "Mentions légales"));
function renderTemplate(page, title) {
    return (req, res) => {
        var _a;
        let inputData = (_a = req.data) !== null && _a !== void 0 ? _a : null;
        res.render(`${page}`, {
            page: page,
            title: title,
            logged: req.session.authenticated,
            data: inputData,
        });
    };
}
function getData(categoryList, limit) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const dataList = {};
        for (let category of categoryList) {
            const data = yield Article.find({ category: category }).limit(limit).lean();
            for (let obj of data) {
                obj.title = obj.title.replace(/_/g, ' ');
            }
            if (categoryList.length === 1) {
                dataList["main"] = data;
            }
            else {
                dataList[category] = data;
            }
        }
        req.data = dataList;
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
