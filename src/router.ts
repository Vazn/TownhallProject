import { Request, Response, NextFunction } from 'express';
import express from "express";
import multer from "multer";
import argon from "argon2";

import { __dirname, getDate, log, error } from "./helpers.js";
import { CustomRequest, CustomResponse } from "./types.js";
import { User, Article, Event } from "./models/index.js";


const router = express.Router();
const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      const root :string = __dirname + "/public/uploads"
      if (file.mimetype.includes("image")) {
         const path = root + "/images";
         callback(null, path);
      }
      if (file.mimetype.includes("video")) callback(null, root + "/videos");
      if (file.mimetype.includes("application")) callback(null, root + "/documents");
   },
   filename: (req, file, callback) => {
      const formattedName = getDate() + "-" + file.originalname;
      callback(null, `${formattedName}`);
   }
});
const upload = multer({
   storage: storage,
});
//===========//==========>> ADMIN ROUTES <<=============//===========//

router.post("/createArticle", upload.any(), async (req, res) => {
   const title :string = req.body.title;
   const content :string = req.body.content;
   const imagePaths :Array<string> = [];
   for (let i=0 ; i<req.files.length ; i++) imagePaths.push(req.files[i].filename);

   try {
      await Article.create({
         title: title,
         content: content,
         imagePaths: imagePaths
      });    
      res.json({ success: true });
   } catch (e) {
      res.json({ success: false });
   }
});
router.get("/getArticles", async (req, res) => {
   const articles = await Article.find({});
   res.json(articles);
});

//===========//=========>>  USER ROUTES <<===============//===========//

router.get("/getUsers", async (req :Request, res :Response) => {
   try {
      const users = await User.find();
      res.json(users);
   } catch (e) {
      res.json({ message : e });
   }
});
router.post("/registerUser", async (req :Request, res :Response) => { 
   try {
      const data :Object = await User.create({
         email: req.body.email,
         password: req.body.password,
      });
      res.json(data);
   } catch (e) {
      res.json({ message: e });
   }
});
router.post("/login", async (req :Request, res :Response) => {
   const email :string = req.body.email.trim();
   const password :string = req.body.password.trim();

   if (email !== "" && password !== "") {

      if (req.session.authenticated) res.json({ success: false }); 
      else {
         const existingUser = await User.findOne({ email: email });
         // await argon.verify("<big long hash>", password)

         if (existingUser !== null && existingUser.password === password) {
            req.session.authenticated = true;
            req.session.save();

            res.status(301).json({ success: true });   
         } 
            else {
            res.status(403).json({ success: false });
         }
      }
   } else {
      error("Form data are missing or empty !");
      res.status(400).json({ success: false });
   }
});
router.get("/logout",  (req :Request, res :Response) => {
   req.session.destroy(() => {
      res.redirect("/");
   });
});
router.get("/logged",  (req :Request, res :Response) => {
   res.send(req.session);
});

//===========//========>> PAGES RENDERING <<============//===========//

router.get("/admin(.html)?", renderTemplate("admin", "Administration"));

router.get("^/$|/index(.html)?", getData("articles"), renderTemplate("index", "Commune de Rouffiac d'Aude"));
router.get("/login(.html)?", renderTemplate("login", "Connexion"));
router.get("/about(.html)?", renderTemplate("about", "A propos"));
router.get("/legal(.html)?", renderTemplate("legal", "Mentions légales"));
router.get("/activities(.html)?", renderTemplate("activities", "Acitivités"));
router.get("/*", renderTemplate("404", "Page introuvable"));

function renderTemplate(page :string, title :string) {
   return (req :CustomRequest, res :Response) => {
      let data = req.data ?? null;

      res.render(`${page}`, {
         stylesheet: `${page}.css`,
         script: `${page}.js`,
         title: title,
         logged: req.session.authenticated,
         data: data,
      });  
   }
}
function getData(type :string) {
   return async (req :CustomRequest, res, next) => {
      if (type === "articles") {
         req.data = await Article.find({}).lean();
      }
      next();
   }
}
function authentify(req :Request, res :Response, next :NextFunction) {
   if (req.session.authenticated) {
      log("You're logged in");
      next();
   }
   else res.status(403).end();
}

export { router };

