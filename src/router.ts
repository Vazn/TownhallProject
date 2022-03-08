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

router.get("/deleteArticle/:title", authentify, async (req, res) => {
   await Article.deleteOne({title: req.params.title});
   res.json({ success: true });
});
router.post("/articleCreate", authentify, upload.any(), async (req, res) => {
   const { title, content }  = req.body;
   const imagePaths :Array<string> = [];
   const result = await Article.findOne({title: title});

   if (result !== null) {
      res.json({ success: false });
   } else {
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
   }
});
router.post("/eventCreate", authentify, async (req, res) => {
   const { title, type, description, start, end }  = req.body;
   try {
      await Event.create({
         title: title,
         type: type,
         description: description,
         start: start,
         end: end,
      });    
      res.json({ success: true });
   } catch (e) {
      console.log("e : ", e)
      res.json({ success: false });
   }
});

//===========//=========>>  USER ROUTES <<===============//===========//

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

//===========//==============>> AJAX <<=================//===========//

router.get("/getEvents",  async (req :Request, res :Response) => {
   const data = await Event.find({}).lean();
   res.json(data);
});
//===========//========>> PAGES RENDERING <<============//===========//

router.get("/life(.html)?", renderTemplate("life", "Au quotidien"));
router.get("/calendar(.html)?", renderTemplate("calendar", "Agenda et activités"));
router.get("^/$|/index(.html)?", getData("articles", 8), renderTemplate("index", "Commune de Rouffiac d'Aude"));
router.get("/procedures(.html)?", renderTemplate("procedures", "Vos démarches"));
router.get("/about(.html)?", renderTemplate("about", "La municipalité"));
router.get("/news(.html)?", getData("articles", 0), renderTemplate("news", "Actualités"));

router.get("/login(.html)?", renderTemplate("login", "Connexion"));
router.get("/legal(.html)?", renderTemplate("legal", "Mentions légales"));

router.get("/*", renderTemplate("404", "Page introuvable"));

function renderTemplate(page :string, title :string, scripts :Array<string> = [], styles :Array<string> = []) {
   return (req :CustomRequest, res :Response) => {
      let data = req.data ?? null;

      res.render(`${page}`, {
         page: page,
         title: title,
         logged: req.session.authenticated,
         data: data,
      });  
   }
}
function getData(type :string, limit :number) {
   return async (req :CustomRequest, res, next) => {
      if (type === "articles") {
         const data = await Article.find({}).limit(limit).lean();
         for (let obj of data) {
            obj.title =  obj.title.replace(/_/g,' ')         
         }
         req.data = data;
      }
      next();
   }
}
function authentify(req :Request, res :Response, next :NextFunction) {
   if (req.session.authenticated) {
      log("Authentication : OK");
      next();
   }
   else{
      error("Acces denied");
      res.status(403).end();
   } 
}

export { router };

